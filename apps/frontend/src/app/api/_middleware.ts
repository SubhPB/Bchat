/**
 * Byimaan
 */

import { NextResponse } from "next/server";
import { Middleware, NextAuthFunction } from "@/utils/features/security/middleware";
import { apiBchatMiddlewareFn } from "./bchat/_middleware";

export const apiMiddlewareFn: NextAuthFunction = (req, ctx) => {

    const givenPath = req.nextUrl.pathname;

    /** Remember only auth user can access this endpoint */
    const apiBchatMiddleware = new Middleware('/api/bchat/*', apiBchatMiddlewareFn);
    if (apiBchatMiddleware.pathMatches(givenPath)){
        return apiBchatMiddleware.trigger(req, ctx)
    };

    return NextResponse.next()
};