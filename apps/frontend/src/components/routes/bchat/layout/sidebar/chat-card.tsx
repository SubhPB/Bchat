/**
 * Byimaan
 *
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CustomImgAvatar } from '@/components/common/custom-img-avatar';
import { useRouter, useParams } from 'next/navigation';
type Props = {
  chatId : string;
  className ?: string;
  chatName : string;
  unReadCount: number;
  recentMessage: string;
  chatImgSrc: string | null;
}

function ChatCard({className, chatImgSrc, chatName, unReadCount, recentMessage, chatId}: Props) {

  const router = useRouter(), params = useParams();

  const {conversationId} = params;
  const isActive = conversationId === chatId;

  const handleClick = () => {
    !isActive && router.push(`/bchat/${chatId}`)
  }

  return (
    <div onClick={handleClick} className={cn('w-full flex gap-1 shadow py-3 px-1 cursor-pointer', className, isActive && 'bg-gray-200 cursor-default')}>
        <CustomImgAvatar imgSrc={chatImgSrc ?? undefined} className='h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gray-300' fallback={String(chatName).toUpperCase().slice(0, 2)} isAwsObject/>
        <div className='space-y-1 flex-grow max-w-[75%] px-2'>
            <div className="card-header flex justify-between md:justify-start lg:justify-between">
                <p className='font-bold text-md text-primary-bchat w-[70%] truncate'>{chatName}</p>
                {unReadCount && <p className='rounded-full text-xs bg-primary-bchat text-white p-1 w-[6ch] truncate'>{unReadCount}</p>}
            </div>
            <p className='text-sm w-[90%] truncate '>{recentMessage}</p>
        </div>   
    </div>
  )
}

export default ChatCard;