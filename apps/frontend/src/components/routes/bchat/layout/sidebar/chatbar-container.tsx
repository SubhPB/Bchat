/**
 * Byimaan
 * 
 * Purpose of this component 
 *    Display the recent chats of the user and sort then according to the recent activity
 */

'use client'

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import ChatCardSkeleton from './chat-card-skeleton';
import ChatCard from './chat-card';
import Infobar from '@/components/common/Infobar';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchConversations } from '@/lib/redux/features/chat/conversations/thunk';

import { ConversationSuccessReturnType } from '@/app/api/bchat/conversation/route';



type Props = {
  className: string
}

function ChatbarContainer({className}: Props) {

  const pathname = usePathname();
  let xClassName = 'app-scrollbar overflow-y-scroll pt-3 px-2 space-y-3 ';

  if (pathname !== '/bchat'){
    xClassName += 'hidden lg:block'
  };

  /** Redux<conversations> Init */
  const appDispatch = useAppDispatch();

  const initialized = useRef(false);

  const {data, gotError, isLoading} = useAppSelector(state => state.chat.conversations);

  if (!initialized.current){
    if (!data && !gotError){
      appDispatch(fetchConversations())
    };
    initialized.current = true
  };


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

  if (data) { 
    return (
      <section className={cn(xClassName, className)}>
        {
            (data as NonNullable<ConversationSuccessReturnType['GET']>).map(
              (conversation) => (
                <ChatCard key={conversation.id}
                  chatId={conversation.id}
                  chatImgSrc={conversation.image}
                  chatName={conversation.name}
                  recentMessage={conversation.messages[0]?.text ?? ''}
                  unReadCount={0}
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