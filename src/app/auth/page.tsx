// Byimaan
'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SignIn from './_components/SignIn';
import Signup from './_components/Signup';
import { FileContextProvider } from '@/contexts/FileContext';

function AuthPage() {

    const searchParams = useSearchParams();
    const tabValue = searchParams.get('type') === 'signup' ? 'signup' : 'signin'

    return (
    <div className="flex-grow flex justify-center">

        <Tabs defaultValue={tabValue} className="w-[400px] md:w-[620px] mt-20 md:mt-12 ">
            <TabsList className='w-full bg-gray-100'>
                <TabsTrigger className='w-1/2 text-center' value="signin">Sign in</TabsTrigger>
                <TabsTrigger className='w-1/2 text-center' value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent  value="signin" >
                <SignIn />
            </TabsContent>
            <TabsContent value="signup">
                <FileContextProvider>
                    <Signup/>
                </FileContextProvider>
            </TabsContent>
        </Tabs>

    </div>
    )
}

export default AuthPage