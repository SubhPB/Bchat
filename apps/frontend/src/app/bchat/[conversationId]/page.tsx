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

            <Conversation.header className="p-2 flex justify-between items-center w-full">
                <ChatProflile {...getChatProfileProps()}/>
                <ChatOptions />
            </Conversation.header>

            <Conversation.body>
                {/* Multiple messages to be shown here */}
                <Message />
            </Conversation.body>

            <Conversation.footer>
                <ChatInput />
            </Conversation.footer>

        </Workarea.main>
    );
}