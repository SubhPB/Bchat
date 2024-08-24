/**
 * Byimaan
 */

import { NextAuthFunction } from "@/utils/features/security/middleware";
import { NextResponse } from "next/server";
import { bChatMiddlewareFn } from "./bchat/_middleware";
import { Middleware } from "@/utils/features/security/middleware";
import { authenticationMiddlewareFn } from "./authentication/_middleware";
import { apiMiddlewareFn } from "./api/_middleware";

const appMiddlewareFn : NextAuthFunction = (req, ctx) => {
    /**
     * Be Aware :- Always return the trigger function if invoking
     */

    const {pathname: givenPath, origin} = req.nextUrl;
    const isAuthenticated = !! req.auth;
    
    if (givenPath === '/' && isAuthenticated){
        return NextResponse.redirect(`${origin}/bchat?status=1`);
    }
    
    /**Client Side Bchat route middleware */
    const bChatMiddleware = new Middleware('/bchat/*', bChatMiddlewareFn);
    if (bChatMiddleware.pathMatches(givenPath)){
        return bChatMiddleware.trigger(req, ctx)
    };
    
    /**Client side Authentication middleware */
    const authenticationMiddleware = new Middleware('/authentication/*', authenticationMiddlewareFn);
    if (authenticationMiddleware.pathMatches(givenPath)){
        return authenticationMiddleware.trigger(req, ctx)
    };

    /** API's middleware */
    const apiMiddleware = new Middleware('/api/*', apiMiddlewareFn);
    if (apiMiddleware.pathMatches(givenPath)){
        return apiMiddleware.trigger(req, ctx)
    }

    return NextResponse.next()
};

export {appMiddlewareFn}