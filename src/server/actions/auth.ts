// BYIMAAN

'use server';

import { db } from "@/lib/db";
import { signUpFormValues } from "@/app/auth/_components/Signup";
import { hashPassword } from "@/utils/bcrypt";

export const signUpAction = async ({values}: {values: signUpFormValues}) => {

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
        throw new Error('Password is needed to create user!')
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

        const {password, ..._user} = {...user}
        
        return _user;
    } catch (error: any){
        throw new Error('An Error occured while creating user ', error)
    };
}