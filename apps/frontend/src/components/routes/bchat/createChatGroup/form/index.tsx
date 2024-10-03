/**
 * Byimaan
 */


'use client';

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { Card, CardContent, CardHeader,CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

import { CreateChatGroupButtons } from './buttons';

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
        <Card className={className}>
            <CardHeader>
                <CardTitle>Create Chat Group</CardTitle>
            </CardHeader>
                <form 
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    >

                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                {children(form)}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <CreateChatGroupButtons.Cancel 
                            type='reset'
                        />
                        <CreateChatGroupButtons.Create
                            type="submit" 
                        />
                    </CardFooter>
                </form>
        </Card>

    )
}

export default ChatGroupForm