// BYIMAAN

'use server';

import { db } from "@/lib/db";
import { signUpFormValues } from "@/app/auth/_components/Signup";
import { hashPassword } from "@/utils/bcrypt";
import { generatePreSignedUrlInstance } from "../../../aws/S3/pre_signed_url/generate";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";

/* Here we have 2 tasks to do :-
    1) create user 
    2) After user creation if presignedUrl is demanded then return & generate preSignedUrl
*/


type Args = {
    values: signUpFormValues,
    imageMetaData ?: {
        imageName: string,
        contentType: string
    } 
};

type UploadMetaData = {
    signedUrl: null | string,
    key: null | string
} | undefined;

type ReturnType = {
    user: Omit<User, 'password'>,
    uploadMetaData: UploadMetaData
}

export const signUpAction = async ({values, imageMetaData}:Args): Promise<ReturnType> => {

    const {email, password, username, firstName, lastName, } = values;

    const existingUser = await db.user.findUnique({
        where: {
            email
        }
    })

    if (existingUser){
        throw new Error("Cannot create User because an another user already exist with this email")
    };

    if (!password){
        throw new Error('Password is required to create account.')
    }

    try {
        const hashedPassword = await hashPassword(values.password);
        const user = await db.user.create({
            data: {
                name: username,
                password: hashedPassword,
                email:email,
                firstName,
                lastName
            }
        });

        const {password, ..._user} = {...user};

        let signedUrl= null, key = null

        if (imageMetaData){
            const {imageName, contentType} = imageMetaData
            try {
                const type = contentType.split('/')[0];
                key =  `user/${user.id}/${type}/${imageName}`
                const preSignedUrl = await generatePreSignedUrlInstance.PUT({
                    keyName: key,
                    contentType,
                    expiresIn: 2* 60
                });
                signedUrl = preSignedUrl
            } catch {

            }
        };
        
        return {
            user: _user,
            uploadMetaData: {
                signedUrl,
                key, // this will be stored in user model as user['image']
            }
        };

    } catch (error: any){
        throw new Error('An Error occured while creating user ', error)
    };
}