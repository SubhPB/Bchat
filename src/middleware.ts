// BYIMAAN
import { auth } from "./lib/auth";
import { _console } from "./utils/console";
import { NextResponse } from "next/server";

export default auth(
    async function middleware(req){
        _console._log.doMagenta(`Middleware Log : [${req.method}] Url Heading from ${req.headers.get('referer')} to `, req.nextUrl.href);
        
        const isAuthenticated = !!req.auth;
        const url = new URL(req.url);

        if (isAuthenticated && req.nextUrl.pathname.startsWith('/auth')){  
            url.pathname = '/bChat'
            url.searchParams.set('error', 'user_already_authenticated')
            url.searchParams.set('redirect_url', req.url)
            return NextResponse.redirect(url);
        };

        if (!isAuthenticated && req.nextUrl.pathname.startsWith('/bChat')){
            url.pathname = '/auth'
            url.searchParams.set('error', 'access_denied_&_need_authentication');
            return NextResponse.redirect(url);
        };

        // Basically we want restrict user to perform `Read Update Delete` expect `Create` with POST
        if (!isAuthenticated && req.nextUrl.pathname.startsWith('/api')){

            if (req.nextUrl.pathname.startsWith('/api/auth')){
                return NextResponse.next()
            };

            if (req.method === 'POST'){
                return NextResponse.next()
            } else {
                return new NextResponse("Authentication required", {status: 401})
            }
        };

        return NextResponse.next()
    }
)