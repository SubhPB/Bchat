/**
 * Byimaan 
 * server side actions specific to conversation
 */
"use server";

import { db } from "@/lib/db";

type CreateConversationAmongTwoUsers = {
    user1Id : string;
    user2Id : string;
};

const getOneToOneConversationID = (userIds: string[]) => userIds.sort().join("_")

/** Bug that need to be fixed in the following code */
export const createConversationAmongTwoUsers = async (users: CreateConversationAmongTwoUsers) => {

    /** For One to One Conversation ID will be the combination of user1Id and user2Id
     * This will help to simplfy the code at frontend and backend
     * we would be able to identify conversation type just by Id.
     * so more ... 
     */

    const conversationId = getOneToOneConversationID([users.user1Id, users.user2Id]);

    const conversation = await db.conversation.upsert({
        where: {
            type: "ONE_TO_ONE",
            id: conversationId 
        },
        create: {
            id: conversationId,
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
           /* Nothing to update 
            * Although, this condition indicates that both users are now mutual friends
           */ 
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