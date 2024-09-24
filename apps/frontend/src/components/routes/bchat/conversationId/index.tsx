/** Byimaan */

'use client';

import React from "react";
import { cn } from "@/lib/utils";

import { useAppSelector } from "@/lib/redux/hooks";
import { ChatProfileProps } from "./components/for-header";
import { selectConversationById } from "@/lib/redux/features/chat/conversations/selectors";
import { MessageProps } from "./components/for-body";
import { ChatInputProps } from "./components/for-footer";

import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type Props<ChildrenProps> = {
    children : (props: ChildrenProps) => React.ReactNode;
    className ?: string;
    validConversationId: string;
};

type Conversation = {
    // [ctype : string]: React.FC<Props>;
    header: React.FC<Props<Omit<ChatProfileProps, 'className'>>>;
    body: React.FC<Props<MessageProps['message'][]>>;
    footer: React.FC<Props<(Omit<ChatInputProps, 'className'>)>>
};

/**
 * Will use Render Prop pattern to provide the prop values to the children
 * [1] Header--> return Header Prop values
 * [2] Body --> return messages as list
 * [3] Footer --> return Footer Prop values which are required to dispatch message
 */

export const Conversation : Conversation = {
    header: ({children, className, validConversationId }) => {

        const conversation = useAppSelector(selectConversationById(validConversationId));
        const session = useSession();

        
        if (!conversation) {
            toast.error('Oops!Conversation not found');
            return (
                <div className={cn(className)}>
                    {/* {children({})} */}
                </div>
            )
        };
        const myUserId = session.data?.user?.id ?? session.data?.adapterUser?.id ?? '';

        const meAsParticipant = conversation?.participants.find(participant => participant.userId === myUserId);

        const folksWhoAreTyping = conversation?.usersWhoAreTyping;

        let chatName = conversation?.name ?? "N/A", activityText = "", chatImgSrc = conversation?.image ?? null;

        if (conversation.type === 'ONE_TO_ONE') {
            const otherUser = conversation.participants.find(participant => participant.id !== meAsParticipant?.id);
            chatName = otherUser?.user.name ?? chatName;
            chatImgSrc = otherUser?.user.image ?? chatImgSrc;
            if (folksWhoAreTyping?.length && folksWhoAreTyping?.includes(
                otherUser?.id ?? 'N/A'
            )){
                activityText = 'typing...';
            }
        } else {
            if (folksWhoAreTyping?.length) {
                activityText = 'some one is typing...';
            }
        } 

        return (
            <div className={cn(className)}>
                {children({chatName, activityText, chatImgSrc})}
            </div>
        )
    },
    body: ({children, className, validConversationId}) => {
        
        const messages = useAppSelector(selectConversationById(validConversationId))?.messages ?? [];

        return (
            <div className={cn(className)}>
                {
                    children(messages)
                }
            </div>
        )
    },
    footer: ({children, className, validConversationId}) => {

        const session = useSession();
        const myUserId = session.data?.user?.id ?? session.data?.adapterUser?.id ?? '';

        const conversation = useAppSelector(selectConversationById(validConversationId));

        if (!conversation){
             return (
                 <div className={cn(className)}>
                 </div>
             )
        };

        const meAsParticipant = conversation?.participants.find(participant => participant.userId === myUserId);


        return (
            <div className={cn(className)}>
                {
                    children({
                        myParticipantId: meAsParticipant?.id ?? '',
                        myUserId,
                        conversationId: validConversationId
                    })
                }
            </div>
        )
    }
}    