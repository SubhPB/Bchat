/**
 * Byimaan
 */

import { NextAuthFunction } from "@/utils/features/security/middleware";
import { NextResponse } from "next/server";

export const authenticationMiddlewareFn: NextAuthFunction = (req) => {

    /**
     * Already authenticated users are not allowed here
     */

    const {origin} = req.nextUrl

    const isAuthenticated = !! req.auth;

    if (isAuthenticated){
        /**
         * Be Aware :- Always return the trigger function 
         */
        return NextResponse.redirect(`${origin}/bchat?error=authentication_access_denied`);
    };
    return NextResponse.next();
}