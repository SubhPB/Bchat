/**
 * Byimaan
 * 
 * Purpose of this component 
 *    Display the recent chats of the user and sort then according to the recent activity
 */

'use client'

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import ChatCardSkeleton from './chat-card-skeleton';
import ChatCard from './chat-card';
import Infobar from '@/components/common/Infobar';

import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useSocketEvents } from '@/providers/io-socket/SocketProvider';

import { fetchConversations } from '@/lib/redux/features/chat/conversations/thunk';
import { ChatCardProps } from './chat-card';
import { ExpectedConversationDataTypeFromAPI } from '@/lib/redux/features/chat/conversations/slice';

import { selectAllChatUsers } from '@/lib/redux/features/chat/users/selectors';

type Props = {
  className: string
}

const getChatCardPropsOutOfData = (data: ExpectedConversationDataTypeFromAPI[number], myUserId: string): ChatCardProps => {
  
  let notifyTyping = null;
  /** It all about prioritize the typing over recent message if possible */
  if (data.usersWhoAreTyping?.length){
    if (data.type === "ONE_TO_ONE"){
      const personIdWhoIsTyping = data.usersWhoAreTyping[data.usersWhoAreTyping.length - 1];
      const personWhoIsTyping = data.participants.find(p => p.user.id === personIdWhoIsTyping)?.user.name ?? null;

      if (personWhoIsTyping) {
        notifyTyping = `typing...`;
      }
    } else {
      notifyTyping = "someone is typing...";
    }
  }

  return {
    chatId: data.id,
    chatName: (data.type === "GROUP" ? data.name : data.participants.find(p => p.user.id !== myUserId)?.user.name) ?? '',
    unReadCount: data?.unreadMessages ?? 0,
    chatImgSrc: data.image,

    /** Get last message OR last typing */
    recentMessage: notifyTyping ?? (
      data.messages[
        data.messages.length - 1
      ]?.text ?? ''
    ),
  }
}

function ChatbarContainer({className}: Props) {
  
  const pathname = usePathname();
  let xClassName = 'app-scrollbar overflow-y-scroll pt-3 px-2 space-y-3 ';
  
  if (pathname !== '/bchat'){
    /** This will ensure that sidebar is always available on large screens */
    xClassName += 'hidden lg:block'
  };

  const session = useSession();
  const myUserId = session.data?.user?.id ?? session.data?.adapterUser?.id ?? '';

  /** Redux<conversations> Init */
  const appDispatch = useAppDispatch();
  const {dispatchJoinUserRooms} = useSocketEvents();

  const initialized = useRef(false);

  const {data, gotError, isLoading} = useAppSelector(state => state.chat.conversations);
  const usersWhomWeAreAwareOf = useAppSelector(selectAllChatUsers());
  
  if (!initialized.current){
    if (!data && !gotError){
      appDispatch(fetchConversations())
    };
    initialized.current = true
  };

  /** Here we would have all the conversations that user is engaged with
   * There is one functionality that we need to implement
   *  which is to stay update about users who are in the conversations
   *  for which we need to join their personal rooms 
   */


  useEffect(
    () => {
      const myUserId = session.data?.user?.id ?? session.data?.adapterUser?.id;

      if (myUserId && data?.length && session.status === 'authenticated'){

        let userIdsWhomWeConcernAbout : string[] = [];

        /** basically we need to stay update about the users who we are not aware of.
         *  The way to find them is using data and compare the `usersWhoWeAreAwareOf`
         */
        data.forEach(
          conversation => {
            conversation.participants.forEach(
              participant => {
                if (
                  participant.user.id !== myUserId
                   && !usersWhomWeAreAwareOf.find(user => user.userId === participant.user.id
                    && !userIdsWhomWeConcernAbout.includes(participant.user.id)
                   )){
                  /** We are not aware of this user */
                  userIdsWhomWeConcernAbout.push(participant.user.id);
                }
              }
            )
          }
        );


        if (userIdsWhomWeConcernAbout.length){
          dispatchJoinUserRooms({
            userIds: userIdsWhomWeConcernAbout
          })
        }
      }
    }, [data, session.status]
  )

  
  if (isLoading){
    return (
      <section className={cn(xClassName, className)}>
        {
          Array.from('abcdef').map(i => <ChatCardSkeleton key={i}/>)
        }
      </section>
    )
  };
  
  if (gotError){
    return (
      <section className={cn(xClassName, className)}>
        <Infobar error allowDefaultIcons>     
          Oops! Something went wrong while fetching your chat details from the server. We are not able to show you any chat yet. Please try again later. 
        </Infobar>
      </section>
    )
  };
  
  if (!data || !data.length){
    return (
      <section className={cn(xClassName, className)}>
        <Infobar success allowDefaultIcons shutdownInMS={10 * 1000}>
          It looks like you have not started any conversation yet. Please start a new one by adding a new contact.
        </Infobar>
        <p className='text-center font-semibold text-lg text-gray-400 my-2'> No chat found</p>
      </section>
    )
  }

  if (data as NonNullable<ExpectedConversationDataTypeFromAPI>) { 
    
    return (
      <section className={cn(xClassName, className)}>
        {
            data.map(
              (conversation) => (
                <ChatCard key={conversation.id}
                  // myUserId will be helpful to identify the name of chat card in the case of ONE_TO_ONE conversation
                  {...getChatCardPropsOutOfData(conversation, myUserId)}
                />
              )
            )
        }
      </section>
    )
  };

  return (
    <section className={cn(xClassName, className)}>
        <Infobar error allowDefaultIcons>
            Oops! Something went wrong due to an unexpected event. You may try again later.
        </Infobar> 
    </section>
  )
};

export default ChatbarContainer;