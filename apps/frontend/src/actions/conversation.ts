/**
 * Byimaan 
 * server side actions specific to conversation
 */
"use server";

import { db } from "@/lib/db";

type CreateConversationAmongTwoUsers = {
    user1Id : string;
    user2Id : string;
}

/** Bug that need to be fixed in the following code */
export const createConversationAmongTwoUsers = async (users: CreateConversationAmongTwoUsers) => {
    const conversation = await db.conversation.upsert({
        where: {
            type: "ONE_TO_ONE",
            id: `${users.user1Id}-${users.user2Id}`
        },
        create: {
            id: `${users.user1Id}-${users.user2Id}`,
            participants: {
                create: [
                    {
                        userId: users.user1Id
                    },
                    {
                        userId: users.user2Id
                    }
                ]
            }, name: `${users.user1Id}-${users.user2Id}`
        },
        update: {
           /* Nothing to update */ 
        },
         include: {
            participants: {
                include: {
                    user: {
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
                    },   
                }
            },
            messages: true
        }
    });
    return conversation
}