/**
 * Where I AM
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
    }

    return NextResponse.next()
}