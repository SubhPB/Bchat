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
import { getRedisClientOrThrow } from "@/lib/io-redis/client";
// import {createRedisInstanceOrThrow} from "@repo/io-redis"
const REDIS_CACHE_TIME_IN_SECS = 15;

type GetEveryConversationIncludingMessagesAndParticipantsProps = {
    /** need userId,
     * need how many old messages are needed e.g a week, a month, what's the value of cursor from current time 
    */
   userId: string;
   cursorMessageId ?: string;
   tillDate: Date;
};

const getEveryConversationIncludingMessagesAndParticipants = async({userId, cursorMessageId, tillDate}: GetEveryConversationIncludingMessagesAndParticipantsProps) => {

    const data = await db.conversation.findMany({
        where: {
            participants: {
                some: {
                    userId: userId
                },
            },
        }, include: {
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
                    }
                }
            }
        },orderBy : {
            updatedAt: 'desc'
        }
    });
    return data
}

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

        let cached: ConversationSuccessReturnType['GET'] | null = null;
        let redisClient: null | ReturnType<typeof getRedisClientOrThrow> = null;  
        const cacheKey = `app/api/bchat/conversation?userId=${userId}&cursorMessageId=${cursorMessageId}&cursorMessageDate=${cursorMessageDate.getTime()}`
        try {
            redisClient = getRedisClientOrThrow({consumerName: "Frontend/GetEveryConversationIncludingMessagesAndParticipants"});
            redisClient.get(cacheKey, async (err, result) => {
                if (result){
                    cached = JSON.parse(result);
                };
            })
        } catch {
            /** This will be thrown if redis is not available */
            redisClient = null;
        };
        
        if (!cached) {
            
            cached = await getEveryConversationIncludingMessagesAndParticipants({
                userId,
                cursorMessageId,
                tillDate: cursorMessageDate
            })

            if (redisClient) {
                await redisClient.set(cacheKey, JSON.stringify(cached), "EX", REDIS_CACHE_TIME_IN_SECS);
            }
        };

        return NextResponse.json({
            /** Be aware before changing the keyName 'data' of the payload because frontend is expecting it to be 'data' */
            'data': cached,
            "redisHealth": redisClient ? "GOOD" : "BAD"
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

