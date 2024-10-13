/**
 * Byimaan
 */


'use client';

import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { upsertConversation } from '@/lib/redux/features/chat/conversations/slice';
import { createGroupConversation } from '@/actions/conversation';
import { Card, CardContent, CardHeader,CardTitle, CardFooter } from '@/components/ui/card';

import { SelectedContacts } from '@/app/bchat/createChatGroup/page';
import { CreateChatGroupButtons } from './buttons';
import { useFiles } from '@/providers/file';
import { useAppDispatch } from '@/lib/redux/hooks';

export type ChatGroupForm = UseFormReturn<ChatGroupFormValues>;

type Props = {
    children: (form: ChatGroupForm) => React.ReactNode;
    className ?: string;
    defaultValues ?: ChatGroupFormValues;
    selectedContacts: SelectedContacts;
    setSelectedContacts: React.Dispatch<React.SetStateAction<SelectedContacts>>
};


const chatGroupSchema = z.object({
    name: z.string().min(4, "*Minimum 4 characters").max(20, "*Maximum 20 characters"),
    image: z.boolean(),
    userIdOfParticipants: z.array(z.string()).min(1, "*Minimum 1 participant is needed"),
})

type ChatGroupFormValues = z.infer<typeof chatGroupSchema>;

/**
 * This form will be used to create a new chat group
 * If created then it will be added to redux
 */
function ChatGroupForm({className, children, defaultValues, selectedContacts, setSelectedContacts}:Props) {
  
    const {data} = useSession();
    const appDispatch = useAppDispatch();
  
    const form = useForm<ChatGroupFormValues>({
        resolver: zodResolver(chatGroupSchema),
        defaultValues: defaultValues,
    });

    const {files, setFiles} = useFiles();

    /** Continue from here */
    const handleFormSubmit = async (values: ChatGroupFormValues) => {
        toast.loading("Processing request ...",{duration: 4000});

        const myId = data?.user?.id || data?.adapterUser?.id;
        let imageContentType : undefined | string = undefined;

        if (!myId){
            /** This should never happen but still reverify */
            toast.error("Oops! Something went wrong. Not able to fetch your user id");
            return
        };

        if (values.image && files[0]){
            imageContentType = files[0].type;
        }

        const res = await createGroupConversation({
            groupName: values.name,
            memberUserIds: values.userIdOfParticipants,
            leaderUserId: myId,
            imageContentType
        });

        /** Two jobs: (1) Upload image to S3 (If needed) (2) Update redux state*/
        const {conversation, pre_signed_url} = res;

        const onImageFailure = () => toast.error("Oops! failed to upload image.");

        // <-- Task 1 -->
        if (!pre_signed_url && imageContentType){
            /** Image was given but server didn't gave pre_signed_url */
            onImageFailure();
        };

        if (pre_signed_url && imageContentType){
            const s3Res = await fetch(pre_signed_url, {
                method: 'PUT',
                body: files[0],
                headers: {
                    'Content-Type': imageContentType
                }
            });

            if (!s3Res.ok){
                onImageFailure();
            }
        };
        // <-- End of Task 1 -->

        // <-- Task 2 -->
        if (conversation){
            appDispatch(upsertConversation(conversation));
            toast.success("Successfully created a chat group.")
        } else {
            toast.error("Oops! Something went wrong. Failed to create chat group.")
        }

        form.reset();
        setFiles([]);
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
                            setSelection={setSelectedContacts}
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