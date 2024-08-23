// BYIMAAN

/**
 * GOALS - 
 *      Offers login, register and reset_password forms
 */

import React from 'react';
import { LoginForm } from './_forms/login';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterForm from './_forms/register';

type Props = {
    params: {},
    searchParams: { [key: string]: string | string[] | undefined },
    formType ?: string
}

function AuthenticatePage({params, searchParams, formType="login"}: Props) {

    if (searchParams?.form && searchParams.form === 'register'){
        formType = 'register'
    };

    return (
        <main className="flex min-h-dvh flex-col items-center pt-10 px-2">
                <Tabs defaultValue={formType} className='w-full xs:w-[400px]'>
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='login' className='data-[state=active]:bg-primary-bchat data-[state=active]:text-white'>
                            Login
                        </TabsTrigger>
                        <TabsTrigger value='register' className='data-[state=active]:bg-primary-bchat data-[state=active]:text-white'>
                            Signup
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='login'>
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value='register'>
                        <RegisterForm/>
                    </TabsContent>
                </Tabs>
        </main>    
    )
}

export default AuthenticatePage