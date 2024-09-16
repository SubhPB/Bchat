/**
 * Byimaan
 */

'use client';

import React from 'react';
import z from "zod";
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import FieldNotify from '@/components/common/field-notify-box';
import { Client as ClientComponentFeature } from '@/utils/features/http/feature_type/response/client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { upsertContact } from '@/lib/redux/features/contacts/slice';

import { upsertConversation } from '@/lib/redux/features/chat/conversations/slice';

import { createConversationAmongTwoUsers } from '@/actions/conversation';

const formSchema = z.object({
    email: z.string().min(1, "* This field is required").email("* Incorrect email"),
    name: z.string().min(1, '* This field is required').min(4, "* Name is too short").optional()
});

type formValues = z.infer<typeof formSchema>
  
type Props = {
    className ?: string,
};

/** api address where to submit form */
const ADD_CONTACT_API_ENDPOINT = '/api/bchat/contact';

function AddForm({className=''}: Props) {

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    const {data: session} = useSession();
    const appDispatch = useAppDispatch();

    const createConversationAndUpdateRedux = async (userId: string, contactId: string, contactName: string) => {
        try {
            const conversation = await createConversationAmongTwoUsers({user1Id: userId, user2Id: contactId});

            console.log(" DEBUG<ResponseFromServerAction>: conversation", conversation);

            /** If conversation is created, add it to redux store */
            if (conversation){

                appDispatch(upsertConversation(conversation));
            } else {
                throw new Error("Failed to create conversation");
            }
        } catch {
            toast.error(`Oops! Failed to create your conversation with ${contactName}`);
        }
    }

    const handleForm = async (values: formValues) => {
        const userSOwnEmail = session?.user?.email ?? session?.adapterUser?.email;
        if (typeof userSOwnEmail !== 'string'){
            toast.error("Oops! Something went wrong!")
            return
        }
        if (values.email.trim() === userSOwnEmail){
            toast.error("You can't put your own email")
            return
        }
        
        const toastRef = toast.loading("Processing request...");

        const response = await fetch(ADD_CONTACT_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        const payload = await response.json();
        toast.dismiss(toastRef);

        if (response.ok){
            toast.success("Successfully added a new contact");
            const actionPayload = payload.data;
            appDispatch(upsertContact(actionPayload))

            /** After contact is created, create a conversation between the two */
            const toastRef2 = toast.loading("Initializing conversation...");
            await createConversationAndUpdateRedux(session?.user?.id ?? session?.adapterUser?.id, actionPayload.contact.id, actionPayload.contact.name);
            toast.dismiss(toastRef2)
            
        } else {
            /** If it is not successful then there must be a toast message from server-api */
            const toastObj = payload?.userFriendlyData?.toast;
            if (toastObj){
                const buildInToast = ClientComponentFeature.useToast(toastObj);
                buildInToast()
            }
        };

        form.reset()
    };

    const loading = form.formState.isSubmitting;

    return (
    <Card className={cn(className)}>
        <CardHeader>
            <CardTitle>Add Contact</CardTitle>
            <CardDescription>Discover and chat with new people.</CardDescription>
        </CardHeader>
            <form onSubmit={form.handleSubmit(handleForm)} >
                <CardContent>
                        <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className='space-y-2'>
                                <Label htmlFor="add-contact">Email</Label>
                                <FieldNotify 
                                    allowToRender={!!form.formState.errors.email}
                                    children={form.formState.errors.email?.message}
                                />
                                <Input placeholder="User Email"  id="add-contact" {...form.register('email')}/>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="name">Name (optional)</Label>
                                <FieldNotify 
                                    allowToRender={!!form.formState.errors.email}
                                    children={form.formState.errors.name?.message}
                                />
                                <Input placeholder="Contact name"  id="name" {...form.register('name')}/>
                            </div>

                        </div>

                        </div>
                </CardContent>
                <CardFooter className="flex-row-reverse">
                    <Button type='submit' className='bg-primary-bchat' disabled={loading}>Save</Button>
                </CardFooter>
            </form>
    </Card>
    )
}

export default AddForm