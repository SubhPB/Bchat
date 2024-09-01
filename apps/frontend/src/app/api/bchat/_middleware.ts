/**
 * Byimaan
 */

import { NextResponse } from "next/server";
import { Middleware, NextAuthFunction } from "@/utils/features/security/middleware";

import { bchatUserMiddlewareFn } from "./user/_middleware";

export const apiBchatMiddlewareFn :NextAuthFunction = (req, ctx) => {

    const isAuthenticated = !! req.auth;
    const givenPath = req.nextUrl.pathname;

    if (!isAuthenticated){
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
    /** This header will be helpful for child api subroutes nd the server side components to identify user and to make DB calls */
    requestHeaders.set('x-userId', userId);

    const bchatUserMiddleware = new Middleware('/api/bchat/user/*', bchatUserMiddlewareFn);
    if(bchatUserMiddleware.pathMatches(givenPath)){
        /** remember it is very important to set the x-userId header for the proper working of this middleware */
        req.headers.set('x-userId', userId)
        return bchatUserMiddleware.trigger(req, ctx)
    };

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}