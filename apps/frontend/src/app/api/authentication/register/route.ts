// Byimaan

import { NextResponse } from "next/server";
import { JWT } from "@/utils/features/security/jwt";
import { BcryptUtils } from "@/utils/features/security/bcrypt";
import { db } from "@/lib/db";
import { HTTPFeatures } from "@/utils/features/http";

const WHERE_IAM = "src/app/api/authentication/register";

const MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD = 4;
const MINIMUM_LENGTH_OF_USERNAME = 4;

const SRC_LIB_AUTH = {
    address: "src/lib/auth",
    token : {
        expiresInSeconds: 120, // 2 min
        expiresIn: `${120}s` // JWT friendly format
    }
};

export async function POST(request: Request){
    const reqFeatures = new HTTPFeatures.request(request);

    let userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();
    let errorMessage : string | null  = null;

    try {

        const reqBody = await request.json();

        const reqBodyKeys = ['username', 'email', 'password', 'rePassword'];

        const missingFields = reqBodyKeys.filter(
            bodyKey => !Object.keys(reqBody).includes(bodyKey)
        );

        if (missingFields.length > 0) {
            errorMessage = `The following fields are missing :- ${missingFields.join(', ')} `;
            throw new Error(errorMessage)
        };

        if (!reqBodyKeys.every(key => typeof reqBody[key] === 'string')){
            errorMessage = "Provided data is not valid.";
            throw new Error(errorMessage)
        };

        // variable
        const email = reqBody.email.trim()

        const emailIsOKAY = email.includes('@') && email.includes('.');

        if (!emailIsOKAY) {
            errorMessage = "The given email is not valid";
            throw new Error(errorMessage)
        };

        // variable
        const password = reqBody.password.trim();

        const passwordIsOKAY = password.length >= MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD && password === reqBody.rePassword;

        if (!passwordIsOKAY){
            errorMessage = "The given password is not valid";
            throw new Error(errorMessage)
        };

        // variable
        const username = reqBody.username.trim();

        const usernameIsOKAY = username.length >= MINIMUM_LENGTH_OF_USERNAME

        if (!usernameIsOKAY){
            errorMessage = "The given username is not valid"
            throw new Error(errorMessage)
        };

        const user = await db.user.findUnique({
            where: {
                email: reqBody.email
            }
        });

        if (user){
            errorMessage = "A user already exits with this email";
            throw new Error(errorMessage)
        };

        const hashedPassword = await BcryptUtils.generateHashPassword(password);

        const newUser = await db.user.create({
            data: {
                email: reqBody.email,
                name: reqBody.username,
                password: hashedPassword
            }
        });

        const {password: _password, ...newUserWithoutPassword} = newUser;

        const payload = {
            from: WHERE_IAM,
            recipient: [
                SRC_LIB_AUTH.address
            ],
            user: newUserWithoutPassword
        };

        return NextResponse.json({
            'access_token': JWT.generateJWTToken({
                payload,
                expiresIn: SRC_LIB_AUTH.token.expiresIn
            }),
            'userFriendlyData': userFriendlyObject.addToastObject({
                message: "Account has been successfully created",
                type: 'SUCCESS'
            }).create()
        }, {
            status: 202
        })


    } catch {

        return NextResponse.json({
            'userFriendlyData': userFriendlyObject.addToastObject({
                message: errorMessage  ?? "Something went wrong!",
                type: "ERROR"
            }).create()
        }, {
            status: errorMessage ? 400 : 500
        })
    }
}