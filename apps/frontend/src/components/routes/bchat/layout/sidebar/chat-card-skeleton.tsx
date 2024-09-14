/**
 * Byimaan
 */


import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
    className ?: string
}

function ChatCardSkeleton({className=''}: Props) {
  return (
    <div className={cn('w-full flex gap-2', className)}>
        <Skeleton className='h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gray-300'/>
        <div className='space-y-2 flex-grow'>
            <Skeleton className='w-[90%]  h-4 rounded-2xl bg-gray-300'/>
            <Skeleton className='w-[75%] max-w-[300px] h-3 rounded-xl bg-gray-300'/>
        </div>
    </div>
  )
}

export default ChatCardSkeleton