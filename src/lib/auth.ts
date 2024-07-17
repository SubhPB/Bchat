// BYIMAAN

import NextAuth from 'next-auth'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import {PrismaAdapter} from '@auth/prisma-adapter'
import { db } from './db'

import { _console } from '@/utils/console'
import { comparePassword } from '@/utils/bcrypt'

import { User } from '@prisma/client';
import { generatePreSignedUrlInstance } from '../../aws/S3/pre_signed_url/generate';
import { MilliSeconds } from '@/utils/time';
import { GeneratePreSignedUrlForProfileImageAndReturnSession } from '../../aws/S3/pre_signed_url/models/user'

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email', type: 'email'
                },
                password: {
                    label: 'Password', type: 'password'
                }
            },
            async authorize(credentials){
                const {email, password} = credentials;


                try {
                    if (!email || !password){
                        throw new Error("Please enter an email and password");
                    };
    
                    const user = await db.user.findUnique({
                        where: {
                            email: email as string
                        }
                    });
    
                    if (!user || !user?.password){
                        throw new Error("no user found")
                    };
    
                    const passwordMatch = await comparePassword({
                        password: password as string, 
                        hashedPassword: user.password
                    });
    
                    if (!passwordMatch){
                        throw new Error('Password is not correct')
                    }
                    const {password : _password, ..._user} = user
                    return _user

                } catch (error) {
                    // start from here...
                    _console._log.doRed(`Error occured  { \n Authorize: '${email}', \n reference: '/auth.ts_66' \n}`)
                    _console._log.doYellow(error)
                };
                return null
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth?type=signin&reference=next-auth',
        error: '/auth?error=1&ref=next-auth/pages'
    },
    adapter: PrismaAdapter(db),
    secret: process.env.AUTH_SECRET!,
    callbacks: {
        // at the moment we do not need signIn callback

        async jwt(args){
            _console._log.doBlue('Exec:- Callbacks/JWT')
            if (args.user){
               args.token._user = args.user
            }
            return args.token
        },

        async session({token, user, session}){
            _console._log.doBlue("Exec :- Callbacks/Session");
            if (token?._user){
                session._user = token._user as Omit<User, 'password'>
            }
            return session
        }

        // async session({token, user, session}){
        //     _console._log.doBlue("Exec :- Callbacks/Session");
        //     _console._log.doRed(session.preSignedURL)
        //     session._user = null;

        //     let _sessionToReturn = session;

        //     if (token?._user){
        //         session._user = token._user as Omit<User, 'password'>
        //     };


        //     if (session?._user && session?._user?.image){

        //         if (session?.preSignedURL){
        //             const {healthStatus, expiresAt, imageUrl} = session.preSignedURL;
        //             if (session.preSignedURL.healthStatus){
        //                 // healthStatus -> if true means that signed-url is not corrupted & all okay else means it is corrupted. 
        //                 const MS = new MilliSeconds(expiresAt);
        //                 // check if has expired
        //                 if (MS.isOlderThan(Date.now())){
        //                     // now this is time to create a new pre-signed url
        //                     //@ts-ignore
        //                     _sessionToReturn = await GeneratePreSignedUrlForProfileImageAndReturnSession(session)
        //                 }
        //             }

        //         } else {
        //             // we have to generate a pre signed url.
        //             //@ts-ignore
        //             _sessionToReturn = await GeneratePreSignedUrlForProfileImageAndReturnSession(session)
        //         }
        //     };
        //     return _sessionToReturn
        // },

        
    },
    debug: process.env.NODE_ENV === "development",
})