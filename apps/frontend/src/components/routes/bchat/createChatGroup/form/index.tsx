/**
 * Byimaan
 */


'use client';

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

export type ChatGroupForm = UseFormReturn<ChatGroupFormValues>;

type Props = {
    children: (form: ChatGroupForm) => React.ReactNode;
    className ?: string;
    defaultValues ?: ChatGroupFormValues;
    submitAtAPIEndpoint : string
};


const chatGroupSchema = z.object({
    name: z.string().min(4, "*Minimum 4 characters").max(20, "*Maximum 20 characters"),
    image: z.string().optional(),
    userIdOfParticipants: z.array(z.string()).min(2, "*Minimum 2 participants are needed"),
})

type ChatGroupFormValues = z.infer<typeof chatGroupSchema>

function ChatGroupForm({className, children, defaultValues, submitAtAPIEndpoint}:Props) {
  
  
    const form = useForm<ChatGroupFormValues>({
        resolver: zodResolver(chatGroupSchema),
        defaultValues: defaultValues,
    });

    const handleFormSubmit = async (values: ChatGroupFormValues) => {
        toast.loading("Processing request ...",{duration: 4000});
    }

    return (
        <form 
            className={className} 
            onSubmit={form.handleSubmit(handleFormSubmit)}
        >
            {children(form)}
        </form>
    )
}

export default ChatGroupForm