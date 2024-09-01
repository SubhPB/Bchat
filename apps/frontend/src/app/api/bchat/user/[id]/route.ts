/**
 * Byimaan
 * 
 * Any authenticated user can acccess GET method in order to get the info about any user.
 *  But for the remaining method lke PATCH only the account owner could access it.
 * 
 *  All the logic of identifying user will be done in the middleware
 * 
 */

import { NextResponse } from "next/server";

export async function GET(request: Request){
    return NextResponse.json('Our develope byimaan is been working on this endpoint')
}

export async function PATCH(request: Request){
    return NextResponse.json('Our developer byimaan is been working on this endpoint')
}