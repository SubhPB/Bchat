// BYIMAAN
import { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { _console } from "./utils/console";

export default auth(
    async function middleware(req: NextRequest){
        _console._log.doMagenta('Middleware Log : Url Heading to '+req.nextUrl.href)
    }
)