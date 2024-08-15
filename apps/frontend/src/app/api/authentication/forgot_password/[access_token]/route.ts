/**
 * BYIMAAN
 * 
 * [Dedicated endpoint for unauthenticated user to make a request to server to change their password because they have forgotten their password] 
 * 
 * This endpoint is responsible for sending an email to the user who have forgot his/her password
 * To operate it needs -
 *      1. A valid encrypted jwt <access_token> holding the values of user who wants to change password.
 *      2. User must pass the background checkup
 *          [2.1] user have not requested too many times to change password
 *          [2.2] user have not recently changed his/her password using this endpoint and now again trying change password 
 *          [2.3]
 */

type ArgsTS = {
    params: {
        access_token: string,
    }
};

import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@repo/db";

import { HTTPFeatures } from "@/utils/features/http";
import { JWT } from "@/utils/features/security/jwt";
import { SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD, SRC_APP_API_EXTERNAL_AFFAIRS } from "@/app/api/consts";
import { db } from "@/lib/db";

const WHERE_IAM = SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.subRoutes.access_token.address;
const EMAIL_MAX_LIMIT = SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.subRoutes.access_token.maxNumberoOfEmailsAllowedToSend;
const PASSWORD_RESET_TOKEN = SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.subRoutes.access_token.resetToken

export async function GET(request: Request, args: ArgsTS){

    const userFriendlyObject = new HTTPFeatures.request(request).serverSideFeatures.getUserFriendlyObject();
    let statusCode = 500, errorMessage = "Something went wrong!", access_token = args.params.access_token;

    try {
        /** Check the format of given Access Token */
        if (access_token && typeof access_token === 'string' && access_token.length > 8){
            // Now our responsiblity to check whether access_token is also valid and belongs to this file.
            const data = JWT.verifyJWTToken(access_token) as null | JwtPayload;

            if (
                data 
                && data?.recipient?.includes(WHERE_IAM)
                && data?.user
            ){
                //Now we are fully sure that this is access_token is acceptable.

                /**
                 * Before sending an email with passKey we need to perform the background check of the user.
                 * in order to determine whether user is really deserve to request forgot_password for more see [2.1] & [2.2]
                 */

                const user = data.user as Omit<User, 'password'>;
                const currentDateTime = new Date()
                
                const userWhoForgotPassword = await db.user.findUnique({
                    where: {
                        id: user.id
                    },
                    include: {
                        passwordTokens: {
                            where: {
                                expiresAt: {
                                    gt: currentDateTime
                                }
                            }
                        }
                    }
                });

                if (!userWhoForgotPassword){
                    /* This condition is very-very rare but possible if someone like hacker intentionally trying to access other accounts
                     Means that this user account no longer exists or might have been deleted */
                    statusCode = 409, errorMessage = "Failed! Corrupted data is not allowed";
                    throw new Error(errorMessage)
                };

                const nonExpiredPasswordTokens = userWhoForgotPassword.passwordTokens;

                /**
                 * Check if user recently has changed his/her password.
                 *  & it is possible for a passwordResetToken to be unvalid but not expired which represents that token is already been used to change the password using the api/authentication/forgot_password.
                 */
                const validTokens = nonExpiredPasswordTokens.filter(token => token.isValid);
                const userHasRecentlyChangedPassword = validTokens < nonExpiredPasswordTokens;

                if (userHasRecentlyChangedPassword){
                    statusCode = 429, errorMessage = "Oops! It seems you have recently changed your password. Changing password multiple times is not allowed. Please try again later";
                    throw new Error(errorMessage)
                };

                // Now let's ensure that we are not exceeding the limit to send email.
                if (validTokens.length >= EMAIL_MAX_LIMIT){
                    statusCode = 429, errorMessage = "Too many requests! You have exceeded the limit of request to change password";
                    throw new Error(errorMessage)
                };

                // At this point, we are fully eligible to send email.

                const newResetPasswordData = await db.resetPasswordToken.create({
                    data: {
                        userId: userWhoForgotPassword.id,
                        expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN.expiresInSeconds * 1000), // converted into milliseconds
                        isValid: true,
                    }
                });

                const {password: _password, passwordTokens: _passwordTokens, ...userWithoutPassword} = userWhoForgotPassword;

                // jwt payload.
                const payload = {
                    from: WHERE_IAM,
                    recipient: [
                        SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.address,
                        SRC_APP_API_EXTERNAL_AFFAIRS.SRC_APP_AUTHENTICATION_FORGOT_PASSWORD.address
                    ],
                    user: userWithoutPassword,
                    reset_key: newResetPasswordData.token
                };

                const reset_token = JWT.generateJWTToken({
                    payload, 
                    expiresIn: PASSWORD_RESET_TOKEN.expiresIn
                })

                /**
                 *  SEND EMAIL with resetToken
                 */


            } else {
                statusCode = 406, errorMessage = 'Your request about forgot password has been discarded due to invalid or expired authorization information.';
                throw new Error(errorMessage);
            }

        } else {
            statusCode = 400, errorMessage = "Access denied due to bad request."
            throw new Error(errorMessage)
        }

    } catch {
        return NextResponse.json(
            {
                'userFriendlyData': userFriendlyObject.addToastObject({
                    message: errorMessage,
                    type: 'ERROR'
                }).create
            }, {
                status: statusCode
            }
        )
    };
}