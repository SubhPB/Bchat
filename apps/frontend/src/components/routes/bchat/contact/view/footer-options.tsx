/**
 * Byimaan
 */

'use client';

import React, { useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { deleteContact, upsertContact } from "@/lib/redux/features/contacts/slice";

import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

import toast from "react-hot-toast";

import { Client as ClientComponentFeature } from '@/utils/features/http/feature_type/response/client';
import { ContactIDSuccessReturnType } from "@/app/api/bchat/contact/[contactId]/route";

import { MdDeleteOutline, MdBlock, MdTextsms } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { Duration } from "@/utils/features/time/duration";

type OptionsProps = {
    className ?: string;
    onClick: () => void;
    tipContent: string;
    children: React.ReactNode;
};
const Option = ({className='hover:scale-110 transition-all', onClick, tipContent, children}: OptionsProps) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className={cn(className)} onClick={onClick}>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tipContent}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

/** If <Option/> will be needed outside of this file then its name would make sense in terms of readablity.
 *  instead GiveTipOfComponent gives a more sense about its core functinality in other files. 
 */
export const GiveTipOfComponent = Option;

const rootApiEndpoint = "/api/bchat/contact";

type DeletedContact = ContactIDSuccessReturnType['DELETE'];
type UpdatedContact = ContactIDSuccessReturnType['PATCH'];

/** DeleteOption is tetsed and fully working as expected */
type DeleteOption = { contactId: string };
export const DeleteOption = ({contactId}: DeleteOption) => {

    const appDispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const toastRef = toast.loading("Processing request ...");

        const response = await fetch(`${rootApiEndpoint}/${contactId}`, {
            method: 'DELETE'
        });

        const payload = await response.json();
        toast.dismiss(toastRef);
        setLoading(false);

        if (response.ok){
            const deletedContact = payload.data as DeletedContact, actionPayload = {
                id: deletedContact.id
            };

            appDispatch(deleteContact( actionPayload ))
        };

        const toastObj = payload?.userFriendlyData?.toast;
        if (toastObj){
            const buildInToast = ClientComponentFeature.useToast(toastObj);
            buildInToast()
        }

    };

    return (
        <Option onClick={loading ? () => {} : handleDelete} tipContent="Delete contact">
            <MdDeleteOutline className={cn("text-red-500", loading && "text-gray-400 cursor-not-allowed")}/>
        </Option>
    )
};

type BlockOption = { contactId: string, isBlocked:boolean }
export const BlockOption = ({contactId, isBlocked}: BlockOption) => {

    const [loading, setLoading] = useState(false);
    const appDispatch = useAppDispatch();

    let tipContent = isBlocked ? "The user is been blocked. Tap to unblock" : "Tap to block this user";
    const Icon = ({className}: Pick<OptionsProps, 'className'>) => isBlocked ? <CgUnblock  className={cn("hover:text-green-500", className)}/> : <MdBlock className={cn("hover:text-red-500", className)}/>

    const handleBlock = async () => {
        const toastRef = toast.loading("Processing request ...")
        setLoading(true)
        
        const response = await fetch(`${rootApiEndpoint}/${contactId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                block: !isBlocked
            })
        });

        const payload = await response.json();
        toast.dismiss(toastRef);
        setLoading(false);

        if (response.ok){
            const updatedContact = payload.data as UpdatedContact, actionPayload = updatedContact;
            appDispatch(upsertContact(actionPayload));
            toast.success(`Contact is now ${isBlocked ? 'unblocked' : 'blocked'}`)
        };


        const toastObj = payload?.userFriendlyData?.toast;
        if (toastObj){
            const buildInToast = ClientComponentFeature.useToast(toastObj);
            buildInToast()
        };
    };

    return (
        <Option onClick={loading ? () => {} : handleBlock} tipContent={tipContent}>
            <Icon className={cn(loading && 'hover:text-gray-400 cursor-not-allowed')}/>
        </Option>
    )
};

export const TextOption = () => {

    const letsChat = async () => {
        const toastRef = toast.loading("Processing request ...")
        await Duration.holdOn(4000);
        toast.dismiss(toastRef);
        toast.error("Service unreachable. Developer is been working on this feature")
    };

    return (
        <Option onClick={letsChat} tipContent="Chat with this user">
            <MdTextsms className="scale-110 text-primary-bchat"/>
        </Option>
    )
}

export const ViewCardFooter = ({className='', children}: Pick<OptionsProps, 'className' | 'children'>) => {
    return (
        <div className={cn("view-card-footer", className)}>
            {children}
        </div>
    )
}

