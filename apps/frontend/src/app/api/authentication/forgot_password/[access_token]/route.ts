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
import { HTTPFeatures } from "@/utils/features/http";
import { JWT } from "@/utils/features/security/jwt";
import { SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD } from "@/app/api/consts";

const WHERE_IAM = SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.subRoutes.access_token;

export async function GET(request: Request, args: ArgsTS){

    const userFriendlyObject = new HTTPFeatures.request(request).serverSideFeatures.getUserFriendlyObject();
    let statusCode = 500, errorMessage = "Something went wrong!", access_token = args.params.access_token;

    try {
        /** Check the format of given Access Token */
        if (access_token && typeof access_token === 'string' && access_token.length > 8){
            // Now our responsiblity to check whether access_token is also valid and belongs to this file.
            const data = JWT.verifyJWTToken(access_token);

            if (data && typeof data !== 'string' && data){

            } else {
                statusCode = 423, errorMessage = ''
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