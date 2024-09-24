/** Byimaan
 * 
 * Chat interface of consversation
 * 
 * 
 */

'use client';

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectConversationById } from "@/lib/redux/features/chat/conversations/selectors";
import { useParams } from "next/navigation";

import { Workarea } from "@/components/routes/bchat/layout/workarea";
import { Conversation } from "@/components/routes/bchat/conversationId";
import { Message } from "@/components/routes/bchat/conversationId/components/for-body";
import { ChatOptions, ChatProfile } from "@/components/routes/bchat/conversationId/components/for-header";
import { ChatInput } from "@/components/routes/bchat/conversationId/components/for-footer";

import { ExpectedConversationDataTypeFromAPI } from "@/lib/redux/features/chat/conversations/slice";
import Infobar from "@/components/common/Infobar";
import { useSession } from "next-auth/react";
import { selectChatUserByID } from "@/lib/redux/features/chat/users/selectors";


type Conversation = ExpectedConversationDataTypeFromAPI[number];

const messsageJson = (id: string, conId: string) : Conversation['messages'][number] =>({
    id,
    text: 'hello',
    conversationId: conId,
    createdAt: new Date(Date.now() - 10000),
    deletedBy: [],
    url:null,
    contentType: 'text',
    senderUserId: 'user-id',
    participantId: 'user-id',
})
    

export default function page(){

    const {conversationId} = useParams();
    let conversation : Conversation | undefined;
    const session = useSession();

    const myUserId = session.data?.user?.id ?? session.data?.adapterUser?.id ?? '';

    // it is obvious that conversationId will be a string and must be at least 5 characters long
    if (typeof conversationId === 'string' && conversationId.length > 5){
        conversation = useAppSelector(selectConversationById(conversationId));
    };

    if (!conversation){
        return (
            <Workarea.main className="flex justify-center md:items-center md:pt-0 items-start pt-5">
                <div>
                  <Infobar error allowDefaultIcons>No conversation found</Infobar>
                  <Workarea.thumbnail />
                </div>
            </Workarea.main>
        )
    };

    const determineWriterName = (senderUserId: string) => {
        const senderName = conversation.participants.find(participant => participant.user.id === senderUserId)?.user?.name;
        return senderName
    }

    return (
        <Workarea.main className="relative overflow-hidden">

            <Conversation.header className="absolute top-0 left-0 p-2 flex justify-between bg-slate-100 items-center w-full" validConversationId={conversation.id}>
                {
                    (headerProps) => (
                        <>
                            <ChatProfile {...headerProps}/>
                            <ChatOptions />
                        </>
                    )
                }
            </Conversation.header>

            <Conversation.body className="size-full overflow-y-scroll app-scrollbar pb-12 pt-14 px-2 space-y-2 md:px-14" validConversationId={conversation.id}>
                {
                    (messages) => (
                        messages.map(
                            message => (
                                <Message 
                                    key={message.id} 
                                    message={message}
                                    alignRight={message.senderUserId === myUserId}
                                    writerName={determineWriterName(message.senderUserId)}
                                />
                            )
                        )
                    )
                }
            </Conversation.body>

            <Conversation.footer className="absolute w-full bottom-0 left-0 pb-2 flex justify-center items-center" validConversationId={conversation.id}>
                {
                    (footerProps) => (
                        <>
                            <div className="w-full max-w-[790px] flex justify-center">
                                <ChatInput 
                                    {...footerProps}
                                />
                            </div>
                        </>
                    )
                }
            </Conversation.footer>

        </Workarea.main>
    );
}