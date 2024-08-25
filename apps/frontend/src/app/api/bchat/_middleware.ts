/**
 * Byimaan
 */

import { NextResponse } from "next/server";
import { NextAuthFunction } from "@/utils/features/security/middleware";

export const apiBchatMiddlewareFn :NextAuthFunction = (req) => {

    const isAuhtenticated = !! req.auth;

    if (!isAuhtenticated){
        return NextResponse.json('You are not authorized to access this endpoint', {
            status: 401
        })
    };

    const userId = req.auth?.user?.id ?? req.auth?.adapterUser?.id as string | undefined
    
    if (typeof userId !== 'string'){
        /** VERY RARE CONDITION :- If user is authenticated but not have userId then it is wried and indicates developer might have done mistake during the configration of next-auth*/
        return NextResponse.json('Invalid request, server has found corrupted data in the request.', {
            status: 400
        })
    };
    
    const requestHeaders = new Headers(req.headers);
    /** This header will be helpful for child api subroutes to identify user and to make DB calls */
    requestHeaders.set('x-userId', userId)

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}