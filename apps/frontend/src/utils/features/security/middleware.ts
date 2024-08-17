/**
 * Byimaan
 */

import { NextAuthResult } from "next-auth";

export type NextAuthFunction = Parameters<NextAuthResult['auth']>[0];
export type NextAuthRequest = Parameters<NextAuthFunction>[0];
export type CTX = Parameters<NextAuthFunction>[1];


export class Middleware {
    constructor(private path: string, private fn: NextAuthFunction){
        this.path = path
        this.fn = fn;
    };

    pathMatches(givenPath : string){
        if (this.path[0] !== '/'){   
            console.log(`[Middleware Warning] Be carefully when defining paths for middleware e.g '${this.path}' is not appropriate.`);
            this.path = '/' + this.path
        };

        if (this.path[this.path.length - 1] === '/'){
            console.log(`[Middleware Warning] Be carefully when defining paths for middleware e.g '${this.path}' is not appropriate.`);
            this.path = this.path.slice(this.path.length - 1)
        }
        if (this.path.includes('*') && !this.path.includes('/*')){
            /**
             * To catch developer's mistake
             */
            throw new Error(`[Syntax Error]: Middleware path is invalid where expected ${this.path.slice(this.path.length -1) + '/*'} but got ${this.path}`)
        };

        if (this.path.includes('/*')){
            return givenPath.startsWith(this.path.slice(0, this.path.length - 2))
        };

        return this.path === givenPath
    };

    trigger(req: NextAuthRequest, ctx: CTX){
        return this.fn(req, ctx)
    }
}