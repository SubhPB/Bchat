/**
 * Byimaan
 */
'use client';

import React from "react";
import { cn } from "@/lib/utils";

import z from "zod";
import {useForm, UseFormReturn} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"

/** For profile image  we may be using AWS S3 logic So we will do that in a seperate form */
const accountFormSchema = z.object({
    firstName: z.string().optional(),
    lastName:z.string().optional() ,
    password: z.string().min(1, "* This field is required").min(6, "* Password is too short").regex(/^(?!\s*$).+$/, {
        message: "* Field cannot be empty or contain only spaces",
      }).optional(),
    rePassword : z.string().regex(/^(?!\s*$).+$/, {
        message: "* Field cannot be empty or contain only spaces",
      }).optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type AccountFormType = UseFormReturn<{
    firstName?: string | undefined;
    lastName?: string | undefined;
    password?: string | undefined;
    rePassword?: string | undefined;
}, any, undefined>

type Props = {
    className: string;
    children: (form: AccountFormType) => React.ReactNode;
}

function AccountForm({className, children}: Props) {

    const form: AccountFormType = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            password: undefined,
            firstName: undefined,
            lastName: undefined,
            rePassword: undefined
        }
    });

    const handleFormSubmit = async (values: AccountFormValues) => {
        /** Submission logic all here */
    }

    return (
        <form className={cn(className)}>
            {children(form)}
        </form>
    )
}

export default AccountForm