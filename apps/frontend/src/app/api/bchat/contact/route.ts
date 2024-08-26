/**
 * Byimaan
 * 
 * As we have written in middeware.
 * Only authenticated user can access this endpoint.
 */

import { Prisma } from "@repo/db";
import { NextResponse } from "next/server"
import { HTTPFeatures } from "@/utils/features/http"
import { db } from "@/lib/db";


type FindManyContactsOfUserAndIncludeContactProps = {
    userId: string,
    sortingStrategy: 'asc' | 'desc'
};
type ContactCreateAndIncludeContactProps = {
    userId: string;
    contactId: string;
    isBlocked: boolean;
    name: string
};

/** These 2 helping Functions we made them outside the scope of API function in order to extract return type of them and then use that type in components */
const findManyContactsOfUserAndIncludeContact = async ({userId, sortingStrategy}: FindManyContactsOfUserAndIncludeContactProps) => (
    await db.contact.findMany({
        where: {
            userId,
        }, include: {
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
        }, orderBy: {
            createdAt: sortingStrategy
        }
    })
);
const contactCreateAndIncludeContact = async ({userId, contactId, isBlocked, name }: ContactCreateAndIncludeContactProps) => (
    await db.contact.create({
        data: {
            name, isBlocked, contactId, userId,
        }, include: {
            contact : {
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
);
/** GET all the contacts assoicated to this user */
export async function GET(request: Request){

    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    let statusCode = 500, errorMessage = "Something went wrong at the server side";
    try {

        const userId = request.headers.get("x-userId");

        if(!userId){
            /**Although this condition is already been addressed in api/bchat/_middleware */
            errorMessage = "UserId is required.";
            throw new Error(errorMessage)
        };

        const searchParams = new URL(request.url).searchParams;

        /** Default strategy is ['desc'] means newest to oldest contacts*/
        const sortingStrategy = searchParams.get('orderBy') === 'asc' ? 'asc' : 'desc';

        const contacts = await findManyContactsOfUserAndIncludeContact({userId, sortingStrategy})

        return NextResponse.json({
            data: contacts
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
    };

};

/** [POST] in order to create new contact assoicated to the currentUser t*/
export async function POST(request: Request){
    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();
    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {
        const userId = request.headers.get("x-userId");

        if(!userId){
            /**Although this condition is already been addressed in api/bchat/_middleware */
            errorMessage = "UserId is required.";
            throw new Error(errorMessage)
        };

        let {name, email, block=false} = await request.json();

        if (typeof name === 'string' && name.length < 4){
            errorMessage = "Invalid name, name should be of atleast four characters", statusCode = 400;
            throw new Error(errorMessage)
        };

        if (typeof email !== 'string' || !(email.includes('.') && email.includes('@')) || typeof block !== 'boolean'){
            errorMessage = "Invalid contact information ", statusCode = 400;
            throw new Error(errorMessage)
        };

        if (typeof name !== 'string' && name !== undefined){
            errorMessage = "Invalid data type 'name' is supposed to be a string", statusCode = 400;
            throw new Error(errorMessage)
        };

        /* find the contactUser, A user whose email has been given and currentUser wants to add that person in his/her contacts*/
        const contactUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!contactUser){
            statusCode = 404, errorMessage = `Oops! There is no user exists with email of ${email}`;
            throw new Error(errorMessage)
        };

        // assigning default name value if name is not given.
        if (!name) {
            name = contactUser.name
        };

        /** try/catch to handle if user intending to recreate existing contact and db will throw an error because @unique [userId, contactId] */
        try {
            const newlyCreatedContact = await contactCreateAndIncludeContact({userId, name, isBlocked: block, contactId: contactUser.id})

            return NextResponse.json({
                'data': newlyCreatedContact
            }, {status: 200});
        } catch {
            errorMessage = "Oops! failed to perform the operation!", statusCode = 400;
            throw new Error(errorMessage)
        }

    
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

export type ContactSucceesReturnType = {
    GET: Prisma.PromiseReturnType<typeof findManyContactsOfUserAndIncludeContact>,
    POST: Prisma.PromiseReturnType<typeof contactCreateAndIncludeContact>
};
