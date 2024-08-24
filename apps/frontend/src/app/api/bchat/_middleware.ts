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
    }

    return NextResponse.next();
}