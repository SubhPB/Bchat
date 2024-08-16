// Byimaan

import { HTTPFeatures } from "@/utils/features/http";
import { SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD, SRC_APP_API_AUTENTICATION_REGISTER, SRC_APP_API_EXTERNAL_AFFAIRS } from "../../consts"
import { NextResponse } from "next/server";
import { JWT } from "@/utils/features/security/jwt";
import { JwtPayload } from "jsonwebtoken";
import { BcryptUtils } from "@/utils/features/security/bcrypt";
import { db } from "@/lib/db";

/**
 * This endpoint is responsible for channging the password of an account (old_password --> new_password)
 * It needs a valid reset_token to operate which will be received by either serachParams or through POST body
 * JOBS 
 *      1. verify the reset_token and then decrypt it
 *      2. extract reset_key from the token
*       3. Use the reset_key to query database that whether reset_key is already been used or not.
*       4. Change the password of user with newPassword
*       6. If every thing go fine return the access_token so that it can be used to signin the user  
 */

const WHERE_IAM = SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.address;

const MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD = SRC_APP_API_AUTENTICATION_REGISTER.minLengthOfPassword

export async function POST(request: Request){

    const reqFeatures = new HTTPFeatures.request(request);
    let userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();
    let statusCode = 500, errorMessage = "Oops! Something went wrong.";

    try {
        const searchParams = new URL(request.url).searchParams;
        /**
         * User can send reset_token either in body or by searchParams but we give priority to reset_token that is received in request body
         */
        const {newPassword, reset_token=searchParams.get('reset_token')} = await request.json() 

        if (
            typeof newPassword === 'string'
            && typeof reset_token === 'string'
            && reset_token.length >= 8 // we know a jwt token with a length less than 8 is not possible
        ){
            if (newPassword.length < MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD){
                statusCode = 400, errorMessage = `New Password is too short`
                throw new Error(errorMessage)
            };

            // here we a valid newPassword but still need to verify reset_token
            const payload = JWT.verifyJWTToken(reset_token) as JwtPayload | null;

            if (
                payload
                && payload?.recipient?.includes(WHERE_IAM) 
                && payload?.user
                && payload?.reset_key
            ){
                // security check
                const existingToken = await db.resetPasswordToken.findUnique({
                    where: {
                        token: payload.reset_key,
                        userId: payload.user.id 
                    }
                });

                // security check 1
                if (!existingToken){
                    statusCode = 404, errorMessage = "You are not authorized to change password because the provided token no longer exists";
                    throw new Error(errorMessage)
                };

                // security check 2
                if (existingToken.expiresAt < new Date()){
                    statusCode = 401, errorMessage = "This url is may have been expired and no longer valid to change password."
                    throw new Error(errorMessage)
                };

                // security check 3
                // possible values - true | false
                if (!existingToken.isValid){
                    // this means token was already used to change password
                    statusCode = 401, errorMessage = "This seems like you already have changed your password. Now you are not authorized to change your password using this url.";
                    throw new Error(errorMessage)
                };

                const hashedPassword = await BcryptUtils.generateHashPassword(newPassword);

                const updatedData = await db.resetPasswordToken.update({
                    where: {
                        userId: payload.user.id,
                        token: payload.reset_key
                    }, data: {
                        isValid: false,
                        user: {
                            update: {
                                password: hashedPassword
                            }
                        }
                    }, include: {
                        user: true
                    }
                });

                if (!updatedData){
                    statusCode = 500, errorMessage = "Oops! Due to some server internal conflicts your request has been failed.";
                    throw new Error(errorMessage)
                };

                const {user:{password, ...updatedUserWithoutPassword}} = updatedData;

                const jwtPayload = {
                    from: WHERE_IAM,
                    recipient: [
                        SRC_APP_API_EXTERNAL_AFFAIRS.SRC_LIB_AUTH.address
                    ],
                    user: updatedUserWithoutPassword
                };

                return NextResponse.json({
                    /**
                     * access_token will be useful for signIn for src/lib/auth
                     */
                    'access_token': JWT.generateJWTToken({
                        payload: jwtPayload,
                        expiresIn: SRC_APP_API_EXTERNAL_AFFAIRS.SRC_LIB_AUTH.token.expiresIn
                    }),
                    'userFriendlyData': userFriendlyObject.addToastObject({
                        message: "Successfully updated your password",
                        type: 'SUCCESS',
                        position: 'top-center'
                    }).create()
                }, {
                    status: 201
                })

            } else {
                statusCode = 406, errorMessage = 'Your request has been discarded due to invalid or expired authorization information.';
                throw new Error(errorMessage);
            }

        } else {
            statusCode = 400, errorMessage = "Access denied due to bad request.";
            throw new Error(errorMessage)
        }

    } catch {
        return NextResponse.json({
            'userFriendlyData': userFriendlyObject.addToastObject({
                message: errorMessage,
                type: 'ERROR',
                position: 'top-center'
            }).create()
        }, {
            status: statusCode
        })
    }
}