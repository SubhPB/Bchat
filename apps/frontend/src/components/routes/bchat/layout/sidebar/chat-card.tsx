/**
 * Byimaan
 *
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { CustomImgAvatar } from '@/components/common/custom-img-avatar';

type Props = {
  className ?: string;
  chatName : string;
  unReadCount: number;
  recentMessage: string;
  chatImgSrc: string | null;
}

function ChatCard({className, chatImgSrc, chatName, unReadCount, recentMessage}: Props) {
  return (
    <div className={cn('w-full flex gap-2', className)}>
        <CustomImgAvatar imgSrc={chatImgSrc ?? undefined} className='h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gray-300' fallback={String(chatName).toUpperCase().slice(0, 2)} isAwsObject/>
        <div className='space-y-2 flex-grow px-2'>
            <div className="card-header flex justify-between">
                <p className='font-bold text-lg text-primary-bchat w-[85%] truncate'>{chatName}</p>
                {unReadCount && <p className='rounded-full bg-primary-bchat text-white px-2 max-w-[10%] truncate'>{unReadCount}</p>}
            </div>
            <p className='text-sm w-[90%] truncate'>{recentMessage}</p>
        </div>   
    </div>
  )
}

export default ChatCard