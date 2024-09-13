/**
 * Byimaan
 * 
 * Goals of this code :-
 * 
 *  GET
 *    - Return all the conversations in which user is participating.
 *    - Return empty array if user is not participating in any conversation yet.    
 *    - Return --> Converstion[] --> Message[] + Participant[] of each conversation
 */

import { db } from "@/lib/db";
import { Prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { HTTPFeatures } from "@/utils/features/http";

type GetEveryConversationIncludingMessagesAndParticipantsProps = {
    /** need userId,
     * need how many old messages are needed e.g a week, a month, what's the value of cursor from current time 
    */
   userId: string;
   cursorMessageId ?: string;
   tillDate: Date;
}

const getEveryConversationIncludingMessagesAndParticipants = async (
    {userId, cursorMessageId, tillDate}: GetEveryConversationIncludingMessagesAndParticipantsProps
) => {
    const data = await db.participant.findUnique({
        where: {
            userId: userId
        },
        include: {
            conversations: {
                include: {
                    messages: {
                        include: {
                            deletedBy: true
                        },
                        cursor: cursorMessageId ? {
                            id: cursorMessageId
                        } : undefined,
                        orderBy: {
                           createdAt: 'desc' 
                        },
                        where: {
                            createdAt: {
                                /** Keep an eye on this if you want to change it to 'lt' if our query logic behaves opposite */
                                gt: tillDate
                            }
                        }
                    },
                    participants: true
                },
                orderBy: {
                    /** SO we need new ones first and old oness last 
                     *  desc : because Date.now() > oldDate --> descreasing order
                    */
                    updatedAt: 'desc'
                }
            }
        }
    });

    return data ? data.conversations : null; 
};

export async function GET(request: Request){

    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        const userId = headers().get('x-userId');
        if (!userId) { throw new Error("Something went wrong at the server side while getting userId") };

        const thisURL = new URL(request.url);
        const cursorMessageId = thisURL.searchParams.get('cursorMessageId') || undefined,
        cursorMessageDate = thisURL.searchParams.get('cursorMessageDate') || undefined;
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        /** Should need redis before computing the expensive this db query */

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
    return NextResponse.json({})
};

export type ConversationSuccessReturnType = {
    GET: Prisma.PromiseReturnType<typeof getEveryConversationIncludingMessagesAndParticipants>
}

