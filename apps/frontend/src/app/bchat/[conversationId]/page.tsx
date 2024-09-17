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
import { ChatOptions, ChatProflile } from "@/components/routes/bchat/conversationId/components/for-header";
import { ChatInput } from "@/components/routes/bchat/conversationId/components/for-footer";

import { ExpectedConversationDataTypeFromAPI } from "@/lib/redux/features/chat/conversations/slice";
import Infobar from "@/components/common/Infobar";
import { useSession } from "next-auth/react";


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

    // it is obvious that conversationId will be a string and must be atleast 5 characters long
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

    const getChatProfileProps = () => {
        return {
            chatName : conversation.type === 'GROUP' ? conversation.name :  conversation.participants.find(p => p.user.id !== myUserId)?.user.name ?? '',
            activityText : 'online',
            chatImgSrc : conversation.image,
        }
    }

    return (
        <Workarea.main className="relative overflow-hidden">

            <Conversation.header className="absolute top-0 left-0 p-2 flex justify-between bg-slate-100 items-center w-full">
                <ChatProflile {...getChatProfileProps()}/>
                <ChatOptions />
            </Conversation.header>

            <Conversation.body className="size-full overflow-y-scroll app-scrollbar pb-12 pt-14 px-2 space-y-2 md:px-14">
                {/* Multiple messages to be shown here */}
                {
                    Array.from('abcdefghijklmnopqrstuvwxyz').map((c, i) => (<Message key={i} message={messsageJson(c, conversation.id)} alignRight={i % 2 === 0}/>))
                }
            </Conversation.body>

            <Conversation.footer className="absolute w-full bottom-0 left-0 pb-2 flex justify-center items-center">
                <ChatInput />
            </Conversation.footer>

        </Workarea.main>
    );
}