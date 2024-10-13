/**
 * Byimaan 
 * server side actions specific to conversation
 */
"use server";

import { db } from "@/lib/db";
import {nanoid} from "nanoid"

import { generatePreSignedUrlInstance } from "../../aws/S3/pre_signed_url/generate";

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
            name: conversationId,
            participants: {
                create: [
                    {
                        userId: users.user1Id
                    },
                    {
                        userId: users.user2Id
                    }
                ]
            }
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

/*
* So the props to create group conversation would be different from the previous one
*/

type CreateGroupConversation = {
    groupName: string;
    leaderUserId: string;
    memberUserIds: string[];
    imageContentType ?: string;
};


const S3_ROOT_PATH = 'public/app',
 SIGNED_URL_EXPIRES_IN_SECS = 2 * 60,
 MODEL_NAME = 'conversation',
 OBJECT_KEY_NAME = 'image',
 DEFAULT_OBJECT_ID_LENGTH = 24;


export const createGroupConversation = async (
    {
        groupName,
        leaderUserId,
        memberUserIds,
        imageContentType
    } : CreateGroupConversation
) => {

    memberUserIds = memberUserIds.filter((id) => id !== leaderUserId);

    if (memberUserIds.length === 0) {
        throw new Error("Group should have at least one member");
    };

    const objectId = nanoid(DEFAULT_OBJECT_ID_LENGTH);

    let keyName : undefined |string = undefined, 
     signedUrl: undefined | string = undefined;

    if (imageContentType && imageContentType.includes('/')){
        try {
            keyName = `${S3_ROOT_PATH}/${MODEL_NAME}/${objectId}/${OBJECT_KEY_NAME}.${imageContentType.split('/')[1]}`;
            signedUrl = await generatePreSignedUrlInstance.PUT({
                keyName,
                expiresIn: SIGNED_URL_EXPIRES_IN_SECS,
                contentType: imageContentType
            });
        } catch (error) {
            keyName = undefined;
        }
    }

    const conversation = await db.conversation.create({
        data: {
            id: objectId,
            name: groupName,
            type: "GROUP",
            image: keyName,
            participants: {
                create: [
                    {
                        userId: leaderUserId,
                        status: "ADMIN"
                    },
                    ...memberUserIds.map((id) => ({
                        userId: id,
                    }))
                ]
            }
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

    return {
        conversation,
        pre_signed_url: signedUrl
    }
}