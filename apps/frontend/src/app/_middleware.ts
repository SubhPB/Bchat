/**
 * Byimaan
 */

import { NextAuthFunction } from "@/utils/features/security/middleware";
import { NextResponse } from "next/server";
import { bChatMiddlewareFn } from "./bchat/_middleware";
import { Middleware } from "@/utils/features/security/middleware";
import { authenticationMiddlewareFn } from "./authentication/_middleware";


const appMiddlewareFn : NextAuthFunction = (req, ctx) => {

    const {pathname: givenPath, origin} = req.nextUrl;
    const isAuthenticated = !! req.auth;
    
    if (givenPath === '/' && isAuthenticated){
        return NextResponse.redirect(`${origin}/bchat?status=1`);
    }
    
    const bChatMiddleware = new Middleware('/bchat/*', bChatMiddlewareFn);
    
    if (bChatMiddleware.pathMatches(givenPath)){
        return bChatMiddleware.trigger(req, ctx)
    };
    
    const authenticationMiddleware = new Middleware('/authentication/*', authenticationMiddlewareFn);
    if (authenticationMiddleware.pathMatches(givenPath)){
        /**
         * Be Aware :- Always return the trigger function 
         */
        return authenticationMiddleware.trigger(req, ctx)
    };

    return NextResponse.next()
};

export {appMiddlewareFn}