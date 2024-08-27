/**
 * Byimaan
 */

'use client';

import React from "react";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

import toast from "react-hot-toast";

import { MdDeleteOutline, MdBlock, MdTextsms } from "react-icons/md";
import { Duration } from "@/utils/features/time/duration";

type OptionsProps = {
    className ?: string;
    onClick: () => void;
    tipContent: string;
    children: React.ReactNode
}

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

export const DeleteOption = () => {

    const handleDelete = async () => {
        const toastRef = toast.loading("Processing request ...")
        await Duration.holdOn(4000);
        toast.dismiss(toastRef)
    };

    return (
        <Option onClick={handleDelete} tipContent="Delete contact">
            <MdDeleteOutline className="text-red-500"/>
        </Option>
    )
};

export const BlockOption = () => {

    const handleBlock = async () => {
        const toastRef = toast.loading("Processing request ...")
        await Duration.holdOn(4000);
        toast.dismiss(toastRef)
    };

    return (
        <Option onClick={handleBlock} tipContent="Block this user">
            <MdBlock className="hover:text-red-500"/>
        </Option>
    )
};

export const TextOption = () => {

    const letsChat = async () => {
        const toastRef = toast.loading("Processing request ...")
        await Duration.holdOn(4000);
        toast.dismiss(toastRef)
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

