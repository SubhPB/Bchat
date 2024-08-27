/**
 * Byimaan
 * This api route is responsible for PATCH and DELETE operations in the Contact model
 */

import { NextResponse } from "next/server";
import { HTTPFeatures } from "@/utils/features/http";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { Prisma } from "@repo/db";

import { SRC_APP_API_BCHAT } from "@/app/api/consts";

type ArgsTS = {
    params: {
        contactId: string,
    }
};

const MINIMUM_ACCEPTABLE_CONTACT_NAME = SRC_APP_API_BCHAT.subRoutes.contact.minLengthOfContactName;

type UpdateContactThenIncludeContactFieldProps = {
    contactId: string;
    name ?: string;
    isBlocked ?: boolean
};

const updateContactThenIncludeContactField = async ({contactId, name, isBlocked}:UpdateContactThenIncludeContactFieldProps) => (
    await db.contact.update({
        where: {
            id: contactId
        },
        data: {
            name,
            isBlocked
        },
        include: {
            contact: {
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
                    /** Basically we want to send all fields except encrypted password */
                },
            }
        }
    })
);

type ContactIDSuccessReturnType = {
    PATCH: Prisma.PromiseReturnType<typeof updateContactThenIncludeContactField>
}

export async function PATCH(request: Request, args: ArgsTS){

    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    const userId = headers().get('x-userId'), contactId = args.params.contactId;

    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        if (!userId || contactId.length < 4){
            statusCode = 400, errorMessage = "Server can't process a bad request";
            throw new Error(errorMessage)
        };

        const {name, block} = await request.json();

        if (name == undefined && block === undefined){
            /** Atleast one of the field is required */
            statusCode = 400; errorMessage = "Incomplete values";
            throw new Error(errorMessage)
        }

        if (
            (typeof block !== 'boolean' && block !== undefined)
            || (typeof name !== 'string' && name !== undefined)
        ){
            statusCode = 400; errorMessage = "Failed! found invalid data type of the values";
            throw new Error(errorMessage)
        }

        if ( typeof name === 'string' && name.length < MINIMUM_ACCEPTABLE_CONTACT_NAME ){
            statusCode = 400; errorMessage = `Invalid 'name' value. It is expected to be atleast of ${MINIMUM_ACCEPTABLE_CONTACT_NAME} characters.`;
            throw new Error(errorMessage)
        };

        /** Till here we have fully fitered out the values of name and block field */
        const updatedContact = await updateContactThenIncludeContactField({contactId, name, isBlocked: block});

        return NextResponse.json({
            /**
             * Be aware that on the client side we expect responsedata only by 'data' key so do not change the name of the following key.
             */
            'data': updatedContact,
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