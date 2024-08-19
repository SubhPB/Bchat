// Byimaan

'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AppLoading } from '@/components/layout/loading-dialog.server';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Duration } from '@/utils/features/time/duration';
import { Client as ClientResFeatures } from '@/utils/features/http/feature_type/response/client';
/**
 * JOBS of this component
 *  - take jwt_token holding the value of user info. as Prop then handle 
 */

type Props = {
    className: string;
    access_token: string;
    allowLoading: boolean;
    email: string
};

function ForgotPassword({className, access_token, allowLoading, email}: Props) {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/authentication/forgot_password/${access_token}`), jsonData = await res.json();
            const {userFriendlyData : {
                toast: jsonToast
            }} = jsonData;

            if (jsonToast?.message && jsonToast?.type) {
                const customToast = ClientResFeatures.useToast(jsonToast);
                customToast();
            }
            
            if (res.ok){
                // let the message to be displayed for atleast .9 second
                await Duration.holdOn(900);
                router.push("/");
                return
            };

        } catch {
            toast.error("Oops! Something went wrong.")
        } finally {
            setLoading(false)
        };
    };

    if (allowLoading && loading){
        return (
            <AppLoading>
                <p className="text-sm flex"> Please wait while we are processing your request. </p>
            </AppLoading>
        )
    }

    return (
        <div className={cn(className)}>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <p>Forgot password?</p>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-primary-bchat'>
                            Did you really forgot your password?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            If you have forgot your password and want to change it. Then continue and you will receive an email to <span className='font-semibold text-primary-bchat'>{email}</span> and follow the instructions given in email to reset password.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClick} className='bg-primary-bchat'>Send Email</AlertDialogAction>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
};
  

export default ForgotPassword