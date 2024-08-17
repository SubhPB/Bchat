// Byimaan

import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

import { appMiddlewareFn } from "./app/_middleware";
import { Middleware } from "./utils/features/security/middleware";

export default auth(
    async function middleware(request, ctx){
        /**
         * All Middleware logic down here
         */
        const givenPath = request.nextUrl.pathname;

        const appMiddleware = new Middleware('/*', appMiddlewareFn);

        if (appMiddleware.pathMatches(givenPath)){
            /**
             * Be Aware :- Always return the trigger function 
             */
            return appMiddleware.trigger(request, ctx)
        };

        
        return NextResponse.next();
    }
)