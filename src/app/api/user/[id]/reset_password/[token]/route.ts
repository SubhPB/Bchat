// Byimaan

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ResetPasswordActions } from "@/server/actions/resetPassword";
import { NextResponse } from "next/server";
import { _console } from "@/utils/console";


type ArgsTS = {
    params: {
        id: string,
        token: string
    }
}

export async function POST(req: Request, args: ArgsTS){

    let email = decodeURIComponent(args.params.id);
    let token = decodeURIComponent(args.params.token);

    const data = await req.json();

    if (!data || !data?.newPassword || (typeof data.newPassword !== 'string') || data?.newPassword?.length < 6){
        return NextResponse.json({
            "feedback": "A valid new password is needed"
        }, {
            status: 400
        })
    };

    if (!email || !email.includes("@") || !email.includes('.')){
        return NextResponse.json({
            "feedback" : "The given email is not valid."
        }, {status: 400})
    };

    if (!token || token.length < 8){
        return NextResponse.json({
            "feedback" : "The given token is not valid."
        }, {status: 400})
    };


    let tokenDetails : undefined | Prisma.PromiseReturnType<typeof ResetPasswordActions.getTokenAndUserDetails>

    try {
        tokenDetails = await ResetPasswordActions.getTokenAndUserDetails(token);

        if (!tokenDetails){
            return NextResponse.json({
                "feedback": `Token ${token} is not recognised by the server.`
            }, {
                status: 404
            })
        };

        if (tokenDetails.user.email !== email){
            return NextResponse.json({
                "feedback": `Alert! ${token} is a corrupted token and not acceptable by the server.`
            }, {
                status: 406
            })
        };

        if (tokenDetails.expiresAt.getTime() < Date.now()){
            return NextResponse.json({
                "feedback": `Invalid token, ${token} has been expired.`
            }, {
                status: 406
            })
        };
    } catch {
        return NextResponse.json({
            "feedback": "Due to an internal server error we are not able to process ypur request."
        }, {
            status: 500
        })
    };

    // still double check the true ownership of token
    if (tokenDetails.user.email === email){
        try {
            const updatedUser = await ResetPasswordActions.updateNewPasswordinDB(tokenDetails.userId, data.newPassword as string);
            
            try {
                const pastDate = new Date(new Date().getTime() - 10000); 
                await db.resetPasswordToken.updateMany({
                    where: {
                        userId: updatedUser.id,
                        expiresAt: {
                            gte: new Date()
                        }
                    }, data : {
                        expiresAt: pastDate
                    }
                });
            } catch {
                _console._log.doRed("Failed to expire the token")
            }

            return NextResponse.json({
                "feedback": "Your password has been successfully updated"
            }, {
                status: 201
            })
        } catch {
            return NextResponse.json({
                "feedback": "Oops! Due to some reason your request to update password has been failed."
            }, {
                status: 500
            })
        }
    }

    return NextResponse.json({
        "feedback": "Oops! Something went wrong."
    }, {
        status: 400
    })
}

