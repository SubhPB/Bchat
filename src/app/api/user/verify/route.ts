// BYIMAAN

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { comparePassword } from "@/utils/bcrypt";
import { _console } from "@/utils/console";

export async function POST(req: Request, res: Response){

    const data = await req.json() as Partial<User>;

    if (data && data.email && data.password){

        try {
            const user = await db.user.findUnique({
                where: {
                    email: data.email
                }
            });

            if (!user){
                return NextResponse.json({
                   feedback: "Invalid Credentials!" 
                }, {
                    status: 404
                })
            };

            const passwordMatch = await comparePassword({
                password: data.password, 
                hashedPassword: user.password as string
            });

            if (passwordMatch){
                return NextResponse.json({
                    feedback: "Verified"
                }, {
                    status: 200
                })
            };

            // If code reaches here this means email is correct but not the password.
            return NextResponse.json(
                {
                    feedback: "Invalid Credentials.",
                    email: user.email
                }, {
                    // this status code will help us to allow the user to have the option of reset passwrod
                    status: 409,
                    statusText: "Conflict"
                }
            )

        } catch {
            return new NextResponse(
                undefined,
                {
                    status: 500
                }
            )
        }
    }

    return new NextResponse(undefined, {
        status: 400,
    })
}