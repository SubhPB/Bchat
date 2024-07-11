// BYIMAAN

import NextAuth from 'next-auth'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import {PrismaAdapter} from '@auth/prisma-adapter'
import { db } from './db'

import { _console } from '@/utils/console'
import { comparePassword } from '@/utils/bcrypt'

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
            return session
        },

        
    },
    debug: process.env.NODE_ENV === "development",
})