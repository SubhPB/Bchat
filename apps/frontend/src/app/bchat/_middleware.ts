/**
 * Byimaan
 */

import { NextResponse } from "next/server";
import { NextAuthFunction } from "@/utils/features/security/middleware";

export const bChatMiddlewareFn: NextAuthFunction = (req) => {
    
    /**
     * Only Auhthenticated user are allowed to access after this endpoint
     */
    const isAuthenticated = !! req.auth;
    
    if (!isAuthenticated){
        const {origin} = req.nextUrl;
        return NextResponse.redirect(`${origin}/?error=bchat_access_denied`)
    };

    /** Modifying header so that we can access pathname in server side components for adding functionality */
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}