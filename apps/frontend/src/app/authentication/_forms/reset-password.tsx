/**
 * Byimaan
 * 
 */

'use client';

import React from "react";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod';
import toast from "react-hot-toast";

import { Client as ClientResFeatures } from "@/utils/features/http/feature_type/response/client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BChatText from "@/components/common/AppText.server"
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import FieldNotify from "../../../components/common/field-notify-box";
import { Duration } from "@/utils/features/time/duration";
import { cn } from "@/lib/utils";


const MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD = 6

type Props = {
    email : string,
    resetToken: string,
    className: string
};

const formSchema = z.object({
    password: z.string().min(1, "* This field is required").min(MINIMUM_ACCEPTABLE_LENGTH_OF_PASSWORD, "* Password is too short").regex(/^(?!\s*$).+$/, {
        message: "* Field cannot be empty or contain only spaces",
      }),
    rePassword : z.string().regex(/^(?!\s*$).+$/, {
        message: "* Field cannot be empty or contain only spaces",
      }),
});

type formValues = z.infer<typeof formSchema>

export function ResetPasswordForm({email, resetToken, className}: Props){

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            rePassword: '',
        }
    });

    const handleFormSubmit = async (values: formValues) => {
        try {
            const {password, rePassword} = values;
            if (password !== rePassword){
                form.setError("rePassword", {
                    type: "manual",
                    message: "* Password do not match"
                });
                return
            };

            /**
             * Submission logic
             */

            const res = await fetch('/api/authentication/forgot_password', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    newPassword: values.password,
                    reset_token: resetToken
                }) 
            });

            const jsonData = await res.json();
            const {userFriendlyData: {toast: jsonToast}} = jsonData;

            if (jsonToast){
                const customToast = ClientResFeatures.useToast(jsonToast);
                customToast()
            }

            if (res.ok && typeof jsonData?.access_token === 'string'){
                // let the message to be displayed for atleast 0.8 seconds
                await Duration.holdOn(.8);
                await signIn('credentials', {
                    access_token: jsonData.access_token,
                    redirect: true,
                    callbackUrl: '/bchat'
                });
                return
            }

        } catch (error){
            toast.error("Oops! Something went wrong.")
        }
    };

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <BChatText textSizeInTailwind="text-[2.6rem]"/>
                <CardDescription>
                    Almost there! Let's quickly fill the following form to reset password of your <span className="font-semibold">BCHAT</span> account.
                </CardDescription>
            </CardHeader>

            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <CardContent className="space-y-2">
                <div className="space-y-1">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" value={email} className="focus-visible:ring-primary-bchat" disabled={true}/>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">New Password</Label>
                        <FieldNotify 
                            allowToRender={!!form.formState.errors.password}
                            children={form.formState.errors.password?.message}
                        />
                        <Input id="password" type="password" placeholder="f9!InhVA4v" className="focus-visible:ring-primary-bchat" {...form.register("password")}/>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Re-enter Password</Label>
                        <FieldNotify 
                            allowToRender={!!form.formState.errors.rePassword}
                            children={form.formState.errors.rePassword?.message}
                        />
                        <Input id="confirmPassword" type="password" placeholder="f9!InsSA4v" className="focus-visible:ring-primary-bchat" {...form.register('rePassword')}/>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button type="submit" className="bg-primary-bchat">Update password</Button>
                </CardFooter>
            </form>
            
        </Card>
    )
}