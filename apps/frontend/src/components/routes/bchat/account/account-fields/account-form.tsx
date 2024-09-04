/**
 * Byimaan
 */
'use client';

import React from "react";
import { cn } from "@/lib/utils";

import z from "zod";
import {useForm, UseFormReturn} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import { MINIMUM_LENGTH_OF_PASSWORD } from "@/app/api/consts";
import toast from "react-hot-toast";

import { Client as ClientComponentFeature } from "@/utils/features/http/feature_type/response/client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserData, UserSliceState } from "@/lib/redux/features/user/slice";

/** For profile image  we may be using AWS S3 logic So we will do that in a seperate form */
const accountFormSchema = z.object({
    firstName: z.string().optional(),
    lastName:z.string().optional() ,
    password: z.string().optional(),
    rePassword : z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type AccountFormType = UseFormReturn<{
    firstName?: string | undefined;
    lastName?: string | undefined;
    password?: string | undefined;
    rePassword?: string | undefined;
}, any, undefined>


type ChildrenArgs = {
    form: AccountFormType;
    isSubmitting:boolean;
}

type Props = {
    className: string;
    defaultValues ?: AccountFormValues
    children: (args: ChildrenArgs) => React.ReactNode;
    submitAtAPIEndpoint: string
}

function AccountForm({className, children, defaultValues, submitAtAPIEndpoint}: Props) {

    const appDispatch = useAppDispatch()

    const form: AccountFormType = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: defaultValues || {
            password: undefined,
            firstName: undefined,
            lastName: undefined,
            rePassword: undefined
        }
    });

    const requestAPI = async (values: AccountFormValues) => { 
        if (defaultValues){
            if (defaultValues.firstName === values.firstName) values.firstName = undefined;
            if(defaultValues.lastName === values.lastName) values.lastName = undefined
        }
        
        if (Object.values(values).every( v => !v)){
            toast.error("No changes found!")
            return 
        };
        const toastRef = toast.loading("Processing request...")
        const response = await fetch(submitAtAPIEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        const payload = await response.json();
        toast.dismiss(toastRef);

        if (response.ok){
            /** here we would receive the updated user data and we will have to change the slice state */
            const actionPayload = payload.data as NonNullable<UserSliceState['data']>;
            toast.success("Successfully updated your account information")
            appDispatch(setUserData(actionPayload));
        } else {
            const toastObj = payload?.userFriendlyData?.toast;
            if (toastObj){
                const buildInToast = ClientComponentFeature.useToast(toastObj);
                buildInToast()
            }
        }
    }

    const handleFormSubmit = async (values: AccountFormValues) => {
     let {firstName, lastName, password, rePassword } = values;

     if ((rePassword && !password) || (password && !rePassword)){
        form.setError('rePassword', {
            message: `* Password does not match`
       });
       return
     }

     if (password){
         if (password.includes(' ')){
             form.setError('password', {
                 message: `* Password should not contain whitespace`
            });
            return
        }
        password = password.trim();
        if (password.length < MINIMUM_LENGTH_OF_PASSWORD){
            form.setError('password', {
                message: `* Your new password should be of atleast ${MINIMUM_LENGTH_OF_PASSWORD} characters`
            });
            return
        };
        if (rePassword !== password){
            form.setError('rePassword', {
                message: "* Password does not match"
            });
            return
        }
     };

     firstName = firstName?.trim() ? firstName.trim() : undefined;
     lastName = lastName?.trim() ? lastName.trim() : undefined;
     password = password?.length ? password : undefined;
     
     await requestAPI({firstName, lastName, password})
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <form className={cn(className)} onSubmit={form.handleSubmit(handleFormSubmit)}>
            {children({form, isSubmitting})}
        </form>
    )
}

export default AccountForm