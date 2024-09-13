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

const REDIS_CACHE_TIME_IN_MS = 9000;

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

const cursorMessageDateIsCorrect = (timeStr:string) => {
    return (
        timeStr && timeStr.length === 13
         && !isNaN(parseInt(timeStr)) 
         && new Date(parseInt(timeStr)).toString() !== 'Invalid Date'
         /** this date should be older than current time and should not be in future */
         && new Date(parseInt(timeStr)) < new Date(Date.now())
    )
}

export async function GET(request: Request){

    const reqFeatures = new HTTPFeatures.request(request);
    const userFriendlyObject = reqFeatures.serverSideFeatures.getUserFriendlyObject();

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let statusCode = 500, errorMessage = "Something went wrong at the server side";

    try {

        const userId = headers().get('x-userId');
        if (!userId) { throw new Error("Something went wrong at the server side while getting userId") };

        const thisURL = new URL(request.url);
        let cursorMessageId = thisURL.searchParams.get('cursorMessageId') || undefined,

        /* Default value of cursorMessageDate is a week ago */
        cursorMessageDate : (Date | string | null) = thisURL.searchParams.get('cursorMessageDate');

        if ( cursorMessageDate && cursorMessageDateIsCorrect(cursorMessageDate)) {
            cursorMessageDate = new Date(cursorMessageDate)
        } else {
            cursorMessageDate = oneWeekAgo;
        }
    
        /** Should need redis before computing the expensive this db query */
        /** 
         * Endpoint as key for redis : --> app/api/bchat/conversation/[conversationId]?userId=<userId>&cursorMessageId=<cursorMessageId>&cursorMessageDate=<cursorMessageDate.getTime()>
         */

        let data: ConversationSuccessReturnType['GET'] = null;

        const cached : ConversationSuccessReturnType['GET'] = null /** check cached value from redis */

        if (!cached){
            data = await getEveryConversationIncludingMessagesAndParticipants({
                userId,
                cursorMessageId,
                tillDate: cursorMessageDate
            });
            if (data){
                /** Update redis cache */
            }
        } else {
            data = cached
        };
        
        return NextResponse.json({
            /** Be aware before changing the keyName 'data' of the payload because frontend is expecting it to be 'data' */
            'data': data
        }, {status: 200})

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

export type ConversationSuccessReturnType = {
    GET: Prisma.PromiseReturnType<typeof getEveryConversationIncludingMessagesAndParticipants>
}

