/**
 * Byimaan
 * 
 * Any authenticated user can acccess GET method in order to get the info about any user.
 *  But for the remaining method lke PATCH only the account owner could access it.
 * 
 *  All the logic of identifying user will be done in the middleware.
 * 
 * 
 */

import { NextResponse } from "next/server";
import { HTTPFeatures } from "@/utils/features/http";
import { db } from "@/lib/db";
import { Prisma } from "@repo/db";

import { MINIMUM_LENGTH_OF_PASSWORD } from "../../../consts";
import { BcryptUtils } from "@/utils/features/security/bcrypt";

const MAXIMUM_LENGTH_OF_ANY_NAME = 50;

const getUserData = async (id: string) => (
    await db.user.findUnique({
        where: {id},
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            firstName: true,
            lastName: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    })
);

type UpdateUser = {
    id: string;
    passwordWithoutEncryption ?: string;
    firstName ?: string;
    lastName ?: string;
    image ?: string
}

const updateUser = async ({id, passwordWithoutEncryption, firstName, lastName, image}:UpdateUser) => {
    /**
     * remember we have to encrypt the password if given before updatition
     */

    let password = passwordWithoutEncryption;
    if (password){
        //let's encrypt it now.
        password = await BcryptUtils.generateHashPassword(password);
    };

    return await db.user.update({
        where: {id},
        data: {
            password,
            firstName,
            lastName,
            image
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            firstName: true,
            lastName: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

type ArgsTS = {
    params: {
        id: string,
    }
};

export async function GET(request: Request, args: ArgsTS){
    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();
    const userId = args.params.id;

    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        const userData = await getUserData(userId);

        if (!userData){
            statusCode = 404, errorMessage = `There is no user exists associated to the given ID`;
            throw new Error(errorMessage)
        };

        return NextResponse.json({
            /** remember do not change the key name other than 'data' otherwise some frontend fucntionalities would not work as expected */
            'data': userData
        }, {
            status: 200
        })

    } catch {
        return NextResponse.json({
            'userFriendlyData': userFriendlyObject.addToastObject({
                message: errorMessage,
                type: "ERROR"
            }).create()
        }, {
            status: statusCode
        })
    }
}

export async function PATCH(request: Request, args: ArgsTS){
    const userId = args.params.id; /*This userId is of account owner who have reached this endpoint to update his/her accout details*/
    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();
    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        let {password, firstName, lastName, image} = await request.json();

        const filedValues = [password, firstName, lastName, image]
        
        if (filedValues.every(val => val === undefined)){
            statusCode = 400, errorMessage = 'No changes found, edit atleast one field to update.';
            throw new Error(errorMessage)
        };

        if (filedValues.some(val => typeof val !== 'string' && val !== undefined)){
            statusCode = 400, errorMessage = 'Request rejected! Found invalid data type.'
            throw new Error(errorMessage)
        };

        if (password && password.length < MINIMUM_LENGTH_OF_PASSWORD){
            statusCode = 400, errorMessage = `Password should be of atleast ${MINIMUM_LENGTH_OF_PASSWORD} characters long`;
            throw new Error(errorMessage)
        };

        if ((firstName && firstName.length > MAXIMUM_LENGTH_OF_ANY_NAME) || (lastName && lastName.length > MAXIMUM_LENGTH_OF_ANY_NAME)){
            statusCode = 400, errorMessage = `The first or the last name should not be longer than ${MAXIMUM_LENGTH_OF_ANY_NAME} characters.`;
            throw new Error(errorMessage)
        };

        const updatedUser = await updateUser({id: userId, firstName, lastName, image, passwordWithoutEncryption: password});

        return NextResponse.json({
            /** Do not attempt to change the name of key 'data' otherwise some frontend fucntionalities would not work */
            'data': updatedUser
        }, {
            status: 201
        })


    } catch {
        return NextResponse.json({
            'userFriendlyData': userFriendlyObject.addToastObject({
                message: errorMessage,
                type: "ERROR"
            }).create()
        }, {
            status: statusCode
        })
    }


}

export type UserSuccessReturnType = {
    GET: NonNullable<Prisma.PromiseReturnType<typeof getUserData>>;
    PATCH: NonNullable<Prisma.PromiseReturnType<typeof updateUser>>
}