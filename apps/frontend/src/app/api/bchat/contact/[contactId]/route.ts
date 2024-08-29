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

const deleteContact = async (contactId: string) => (
    await db.contact.delete({
        where: {
            id: contactId
        }
    })
);

const getContactThenIncludeContactField = async (contactId: string) => (
    await db.contact.findUnique({
        where: {
            id: contactId
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
                }
            }
        }
    })
)

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

};

export async function DELETE(request: Request, args: ArgsTS) {
    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    const userId = headers().get('x-userId'), contactId = args.params.contactId;

    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        if (!contactId || contactId.length < 5){
            /** contactId is uuid and not possible to be too short */
            statusCode = 404, errorMessage = "Contact not found";
            throw new Error(errorMessage)
        };

        if (!userId){
            /**Althougl this condition was checkd in the middleware but still repeated in the case if some one accidently rewrite the middleware logic */
            statusCode = 401, errorMessage = "You are not authorized to perform this operation";
            throw new Error(errorMessage)
        };

        const deletedContact = await deleteContact(contactId);

        return NextResponse.json({
            'data': deletedContact            
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
};

export async function GET(request: Request, args: ArgsTS){
    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    const contactId = args.params.contactId;

    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {
        const contact = await getContactThenIncludeContactField(contactId);

        if (!contact){
            statusCode = 404, errorMessage = "Contact not found.";
            throw new Error(errorMessage)
        };

        return NextResponse.json({
            'data': contact
        }, {
            status: 200
        });
        
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

/** In the components and redux the following types will be useful */
export type ContactIDSuccessReturnType = {
    PATCH: Prisma.PromiseReturnType<typeof updateContactThenIncludeContactField>,
    DELETE: Prisma.PromiseReturnType<typeof deleteContact>,
    GET: NonNullable<Prisma.PromiseReturnType< typeof getContactThenIncludeContactField >>
}