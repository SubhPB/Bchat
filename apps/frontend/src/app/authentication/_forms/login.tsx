// BYIMAAN

/**
 * 
 */

"use client";

import toast from "react-hot-toast";
import { useState } from "react";

import { signIn } from "next-auth/react";

import {useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import { FaLock } from "react-icons/fa";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import FieldNotify from "./field-notify-box";
import BChatText from "@/components/common/AppText.server";
import { AppLoading } from "@/components/layout/loading-dialog.server";
import ForgotPassword from "./forgot-password-btn";

const WHERE_IAM = "src/app/authentication/_forms/login";

const loginFormSchema = z.object({
    email: z.string().email("* Incorrect email."),
    password: z.string().min(1, "* This field is required.")
});

type loginFormValues= z.infer<typeof loginFormSchema>


type ForgotPasswordPayload = {
    access_token: string;
    metadata: {
        recipient: string[],
        token: {
            email: string,
            expiresInTimestamp: number
        }
    }
}

export function LoginForm(){

    const [forgotPasswordPayload, setForgotPasswordPayload] = useState<ForgotPasswordPayload | null>(null)

    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });


    const handleFormSubmitTryCatch = async (values: loginFormValues) => {
        
        const handleFormSubmit  = async () => {
    
            const response = await fetch("/api/authentication/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            });
            const payload = await response.json();

            const renderUserFriendlyToastData = () => {
                if (payload?.userFriendlyData && payload.userFriendlyData?.toast){
                    const {message, type, position} = payload.userFriendlyData.toast;''
                    if (message && type && position){
                        const cstmToast = type === 'ERROR' ? toast.error: toast.success;
                        cstmToast(message);
                    }
                }
            }
    
            if (response.ok){
                const {access_token} = payload;
                if (access_token){
                    // render toast message if got from response
                    renderUserFriendlyToastData();
                    await signIn('credentials', {
                        access_token,
                        redirect: true,
                        callbackUrl: '/bchat'
                    });
                    return;
                } else {
                    // even though this condition is very rare but still useful to handle it.
                    toast.error("Oops! Somthing unexpected happened");
                }
            } else {
                // 406 staus code means activate forgot_password
                if (response.status === 406){
                    const forgotPasswordPayload: ForgotPasswordPayload = payload;
                    toast.error("Invalid credentials!. Did you forgot your password?");
                    setForgotPasswordPayload(forgotPasswordPayload);
                };
            };
    
            // if any toast needed to display
            renderUserFriendlyToastData()
    
        };
        try {
            await handleFormSubmit();
        } catch {
            toast.error("Opps! Something unexpected happened")
        }

    };

    const loading = form.formState.isSubmitting;

    const renderForgotPassword = (
        forgotPasswordPayload
         && forgotPasswordPayload.metadata.recipient.includes(WHERE_IAM)
          && forgotPasswordPayload.metadata.token.email === form.getValues('email').trim()
           && forgotPasswordPayload.metadata.token.expiresInTimestamp > Date.now()
    );

    return (

        <Card>
            {
                loading && (
                    <AppLoading>
                        <p className="text-sm flex"><FaLock size={20} className="mr-2"></FaLock> BChat offfers secure authentication powered with next-auth</p>
                    </AppLoading>
                )
            }
            <CardHeader>
                <BChatText textSizeInTailwind="text-[2.6rem]"/>
                <CardDescription>
                    Please put in your credentials to access your <span className="font-semibold">BCHAT</span> account.
                </CardDescription>
            </CardHeader>

            <form onSubmit={form.handleSubmit(handleFormSubmitTryCatch)}>

                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>

                        <FieldNotify 
                            allowToRender={!!form.formState.errors.email}
                            children={form.formState.errors.email?.message}
                        />
                        <Input id="email" type="email" placeholder="john@example.com" className="focus-visible:ring-primary-bchat" {...form.register('email')}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <FieldNotify 
                            allowToRender={!!form.formState.errors.password}
                            children={form.formState.errors.password?.message}
                        />
                        <Input id="password" type="password" placeholder="f9!InhVA4v" className="focus-visible:ring-primary-bchat" {...form.register('password')}/>
                    </div>
                </CardContent>

                {
                    renderForgotPassword && (
                        <ForgotPassword
                        className="text-xs text-cyan-600 font-semibold text-center cursor-pointer hover:text-primary-bchat"
                        access_token={forgotPasswordPayload.access_token}>
                            Forgot password?
                        </ForgotPassword>
                    )
                }

                <CardFooter>
                    <Button type="submit" className="bg-primary-bchat">Submit </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
