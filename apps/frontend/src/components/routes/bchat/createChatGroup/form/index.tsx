/**
 * Byimaan
 */


'use client';

import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { Card, CardContent, CardHeader,CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

import { SelectedContacts } from '@/app/bchat/createChatGroup/page';
import { CreateChatGroupButtons } from './buttons';

export type ChatGroupForm = UseFormReturn<ChatGroupFormValues>;

type Props = {
    children: (form: ChatGroupForm) => React.ReactNode;
    className ?: string;
    defaultValues ?: ChatGroupFormValues;
    submitAtAPIEndpoint : string;
    selectedContacts: SelectedContacts;
};


const chatGroupSchema = z.object({
    name: z.string().min(4, "*Minimum 4 characters").max(20, "*Maximum 20 characters"),
    image: z.string().optional(),
    userIdOfParticipants: z.array(z.string()).min(1, "*Minimum 1 participant is needed"),
})

type ChatGroupFormValues = z.infer<typeof chatGroupSchema>

function ChatGroupForm({className, children, defaultValues, submitAtAPIEndpoint, selectedContacts}:Props) {
  
  
    const form = useForm<ChatGroupFormValues>({
        resolver: zodResolver(chatGroupSchema),
        defaultValues: defaultValues,
    });

    const handleFormSubmit = async (values: ChatGroupFormValues) => {
        toast.loading("Processing request ...",{duration: 4000});
    };

    useEffect(
        /** Whenever the user is selected or unselected we manually need to update the form state  */
        () => {
            form.setValue(
                'userIdOfParticipants', selectedContacts.map(
                    selectedContact => selectedContact.contact.id
                )
            )
        }, [selectedContacts]
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className='text-primary-bchat'>Create Chat Group</CardTitle>
            </CardHeader>
                <form 
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    >

                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col gap-3">
                                {children(form)}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className='w-full justify-end gap-2'>
                        <CreateChatGroupButtons.Cancel 
                            type='reset'
                        />
                        <CreateChatGroupButtons.Create
                            className='bg-primary-bchat '
                            type="submit" 
                            disable={form.formState.isSubmitting}
                        />
                    </CardFooter>
                </form>
        </Card>

    )
}

export default ChatGroupForm