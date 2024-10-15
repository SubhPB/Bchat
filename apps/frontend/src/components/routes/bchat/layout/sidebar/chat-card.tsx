/**
 * Byimaan
 *
 */

'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

import { useSocketEvents } from '@/providers/io-socket/SocketProvider';

import { CustomImgAvatar } from '@/components/common/custom-img-avatar';
import { useRouter, useParams } from 'next/navigation';
import { captializeText } from '@/utils/features/typing/text';


type Props = {
  chatId : string;
  className ?: string;
  chatName : string;
  unReadCount: number;
  recentMessage: string;
  chatImgSrc: string | null;
};

export type ChatCardProps = Props;

function ChatCard({className, chatImgSrc, chatName, unReadCount, recentMessage, chatId}: Props) {

  const router = useRouter(), params = useParams();

  chatName = captializeText(chatName);

  const {conversationId} = params;
  const isActive = conversationId === chatId;

  const handleClick = () => {
    !isActive && router.push(`/bchat/${chatId}`)
  };

  const {dispatchJoinConversation} = useSocketEvents();

  useEffect(
    () => {
      /** We need to join the conversation room in order to receive messages */
      dispatchJoinConversation({
        conversationId: chatId
      })
    }, [chatId]
  )

  return (
    <div onClick={handleClick} className={cn('w-full flex gap-1 shadow py-3 px-1 cursor-pointer', className, isActive && 'bg-gray-200 cursor-default')}>
        <CustomImgAvatar imgSrc={chatImgSrc ?? undefined} className='h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gray-300' fallback={String(chatName).toUpperCase().slice(0, 2)} isAwsObject/>
        <div className='space-y-1 flex-grow max-w-[75%] px-2'>
            <div className="card-header flex justify-between md:justify-start lg:justify-between">
                <p className='font-bold text-md text-primary-bchat w-[70%] truncate'>{chatName}</p>
                {
                  !!unReadCount
                   && <p className='rounded-full text-xs bg-primary-bchat text-white p-[6px_12px] w-fit max-w-[6ch] truncate'>
                    {unReadCount}
                   </p>
                }
            </div>
            <p className='text-[0.8em] w-[90%] truncate font-[500] relative top-[-0.5rem]'>{recentMessage}</p>
        </div>   
    </div>
  )
}

export default ChatCard;