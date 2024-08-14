// Byimaan

/**
 * In this api user will pass its credentials Then 
 *  Our task is to 
 *  - Verify 
 *      -> if valid 
 *          generate a jwt token holding the values of user which will be consumed by the `async authorize` of 'next-auth' by signIn in in 
 *          order to actauly login
 *      -> if not valid
 *          1st scenerio : All the credential values such as email and password then return HTTP[404] 
 *              
*           2nd scenrio : Email exists but password is wrong then generate a token holding user info and return HTTP[406] with a instruction
*            to  pop up the forget password feature
 *      
 */

import { JWT } from "@/utils/features/security/jwt";
import { HTTPFeatures } from "@/utils/features/http";
import { NextResponse } from "next/server";
import { BcryptUtils } from "@/utils/features/security/bcrypt";
import { db } from "@/lib/db";

import {SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD, SRC_APP_API_AUTENTICATION_LOGIN, SRC_APP_API_EXTERNAL_AFFAIRS } from "../../consts";

const SRC_LIB_AUTH = SRC_APP_API_EXTERNAL_AFFAIRS.SRC_LIB_AUTH;

const SRC_APP_AUTHENTICATION__FORMS_LOGIN = SRC_APP_API_EXTERNAL_AFFAIRS.SRC_APP_AUTHENTICATION__FORMS_LOGIN;

const WHERE_IAM = SRC_APP_API_AUTENTICATION_LOGIN.address;

export async function POST(request:Request){
    const reqFeatures = new HTTPFeatures.request(request);

    let userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    try {
        const reqBody = await request.json();
    
        let {email, password} = reqBody;
    
    
        if (
            typeof email === 'string'
              && typeof password === 'string'
               && email.trim().includes('@') && email.trim().includes('.')
             ){
                email = email.trim();
                password = password.trim();

                const user = await db.user.findUnique({
                    where: {email}
                });

                if (user && user.password){

                    const passwordDoesMatch = await BcryptUtils.comparePassword({
                        password: password,
                        hashedPassword: user.password
                    });

                    const {password: _password, ...userWithoutPassword} = user;

                    // Access token for next-auth/signin
                    if (passwordDoesMatch){
                        const payload = {
                            from: WHERE_IAM,
                            recipient: [
                                SRC_LIB_AUTH.address
                            ],
                            user: userWithoutPassword,
                        }
                        return NextResponse.json({
                            'access_token': JWT.generateJWTToken({
                                payload, expiresIn: SRC_LIB_AUTH.token.expiresIn
                            })
                        }, {
                            status: 202
                        })
                    }
                    // Forget password feature
                    else {
                        // here we know email is correct but password is wrong
                        const payload = {
                            from: WHERE_IAM,
                            recipient: [
                                SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.address,
                                SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.subRoutes.access_token.address,
                            ],
                            user: userWithoutPassword
                        }
                        return NextResponse.json({
                            'access_token': JWT.generateJWTToken({
                                payload,
                                expiresIn: SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.token.expiresIn,
                            }),
                            /**
                             * This metadata will be useful for the _forms/login.tsx to response more effectivily with user without decryptying the token
                             */
                            'metadata': {
                                recipient: [
                                    SRC_APP_AUTHENTICATION__FORMS_LOGIN.address
                                ],
                                token: {
                                    email,
                                    expiresInTimestamp : Date.now() + SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD.token.expiresInSeconds * 1000
                                }
                            }
                        }, {
                            status: 406 // not acceptable
                        })
                    }
                };

                
        }
       
        return NextResponse.json(
            {
                "userFriendlyData": userFriendlyObject.addToastObject({
                    message: "Invalid credentials!",
                    type: 'ERROR'
                }).create()
            }, {
                status: 404 // Not found
            }
        );

    } catch {
        return NextResponse.json({
            "userFriendlyData": userFriendlyObject.addToastObject({
                type: 'ERROR',
                message: 'Opps! Something went wrong.'
            }).create()
        }, {
            status: 500
        });
    }

}