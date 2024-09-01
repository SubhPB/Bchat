/**
 * Byimaan
 * 
 * This middleware is responsible for handling request of /api/bchat/user/*
 */


import { NextResponse } from "next/server";
import { NextAuthFunction } from "@/utils/features/security/middleware";


export const bchatUserMiddlewareFn: NextAuthFunction = (req) => {

    /**
     * According the middleware done i api/bchat/_middleware
     * 
     * In this middleware we are sure about following things:-
     *  [1] User is authenticated
     *  [2] The user who made this request on this api is stored in headers.get('x-userId')
     * 
     * Our responsibilties in this midldeware are following
     *  [1] Allow GET for everybody
     *  [2] Other methods can only be allowed to account owner
     */

    if (req.method === 'GET'){
        return NextResponse.next()
    };

    const requestFromID = req.headers.get('x-userId');

    /**
     * So we need to verify is it account user if not thn rject the request.
       /api/bhat/user/[id] does [id] === requestFromID
     */

    const pathname = req.nextUrl.pathname;

    /** Let review the [id] that is been passed in <url> */
    const index = pathname.indexOf('/user/');
    if (index < 0){
        /** Means no ID has been passed */
        return NextResponse.json("Invalid request. userId is needed to access this endpoint", {status: 400});
    };

    let requestOfID = pathname.substring(index + '/user/'.length);

    /** 
     * It is possible that we have the url like '/api/bchat/user/[id]/review'
     * if yes then value of requestOfId would be [id]/review
     * So we further need to filter out the value to deal with this scenrio
     */
    requestOfID = requestOfID.split('/')[0];

    if (requestFromID !== requestOfID){
        // Unauthorization detected
        return NextResponse.json(
            `Request rejeted, ${requestFromID} account is not authorized to perform operations on the account with ID of ${requestOfID}`,
            {
                status: 401
            }
        )
    };

    // So here we are sure that this is indeed account owner who requested for this api service.
    return NextResponse.next()
}