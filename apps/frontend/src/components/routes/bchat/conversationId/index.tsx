/** Byimaan */

'use client';

import React,{useRef, useEffect, use} from "react";
import { cn } from "@/lib/utils";

import { useAppSelector } from "@/lib/redux/hooks";
import { ChatProfileProps } from "./components/for-header";
import { selectConversationById } from "@/lib/redux/features/chat/conversations/selectors";
import { MessageProps } from "./components/for-body";
import { ChatInputProps } from "./components/for-footer";

import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { selectAllChatUsers } from "@/lib/redux/features/chat/users/selectors";

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

const SCROLL_BOTTOM_THRESHOLD_IN_PX = 300;

/**
 * Will use Render Prop pattern to provide the prop values to the children
 * [1] Header--> return Header Prop values
 * [2] Body --> return messages as list
 * [3] Footer --> return Footer Prop values which are required to dispatch message
 */

export const Conversation : Conversation = {
    header: ({children, className, validConversationId }) => {

        const conversation = useAppSelector(selectConversationById(validConversationId));
        const chatUsers = useAppSelector(selectAllChatUsers());

        const session = useSession();

        
        if (!conversation) {
            toast.error('Oops! Conversation not found');
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

        /**
         * Summary of what has been done in this if-else statement,
         * Assign a value to chatName, chatImgSrc and activityText based on the conversation type
         * activityText give priority to typing over recent message if possible
         * 
         */
        if (conversation.type === 'ONE_TO_ONE') {
            const otherUser = conversation.participants.find(participant => participant.id !== meAsParticipant?.id);
            chatName = otherUser?.user.name ?? chatName;
            chatImgSrc = otherUser?.user.image ?? chatImgSrc;
            if (folksWhoAreTyping?.length && folksWhoAreTyping?.includes(
                otherUser?.id ?? 'N/A'
            )){
                activityText = 'typing...';
            };

            if (!activityText){
                /** let's see if other person is online */
                const isOtherUserOnline = chatUsers.some(user => user.userId === otherUser?.user?.id);
                if (isOtherUserOnline){
                    activityText = 'online';
                }
            }
        } else {
            if (folksWhoAreTyping?.length) {
                activityText = 'Someone is typing...';
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
        const scrollableRef = React.useRef<HTMLDivElement>(null);
        /** 
         * Scrolling behavior we need for this component:-
         *  [1] Keep it at the bottom so tht user can always see the latest message
         *  [2] If user manually is in the middle of scroll then do not go to the bottom
         */
        const isUserAtBottom = () => {
            if (scrollableRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current,
                    scrollBottom = scrollHeight - scrollTop - clientHeight;
                return scrollBottom < SCROLL_BOTTOM_THRESHOLD_IN_PX;
            }
            return false;
        };

        useEffect(
            () => {
                /* By default scrolling stay at bottom */
                if (scrollableRef.current) {
                    const { scrollHeight, clientHeight } = scrollableRef.current;
                    scrollableRef.current.scrollTop = scrollHeight - clientHeight;
                }
            }, []
        );

        useEffect(
            () => {
                /** We need to take scroll to bottom if user did not manually scrolled to the top  */
                if (scrollableRef.current && isUserAtBottom()) {
                    const { scrollHeight, clientHeight } = scrollableRef.current;
                    scrollableRef.current.scrollTop = scrollHeight - clientHeight;
                }
            }, [messages.length]
        );

        return (
            <div ref={scrollableRef} className={cn(className)}>
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