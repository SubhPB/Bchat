
import { _console } from "@/utils/console";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type ArgsTS = {
    params: {
        id: string
    }
}


export async function PATCH(req: Request, args: ArgsTS){

    // these primitive keys should never update their values in
    const primitiveKeys: (keyof User)[] = ['password', 'email', 'id', 'createdAt'];
    const id = args.params.id;
    
    try {
        const partialData = await req.json() as Partial<User>;

        if (primitiveKeys.some(primitiveKey => Object(partialData).hasOwnProperty(primitiveKey))){
            return new NextResponse(`Request Denied. `, {status: 403})
        };

        const mofifiedUser = await db.user.update({
            where: {
                id
            },
            data: {
                ...partialData
            }
        });

        // exclude password.
        const {password, ...user } = mofifiedUser;

        return NextResponse.json(user)

    } catch (error){
        _console._log.doRed(`ApiLog '/api/user/${id}' [(PUT:5xx)]`, 'Failed to update the user');
        if (error instanceof Error){
            _console._log.doYellow(error.message)
        };
        return new NextResponse("Internal server error while updating the user info.", {
            status: 500
        })
    };
}