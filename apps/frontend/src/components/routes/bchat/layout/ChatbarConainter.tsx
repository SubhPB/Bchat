/**
 * Byimaan
 * 
 * Purpose of this component 
 *    Display the recent chats of the user and sort then according to the recent activity
 */

'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  className: string
}

function ChatbarContainer({className}: Props) {

  const pathname = usePathname();
  let xClassName = 'app-scrollbar overflow-y-scroll pt-3 px-2 space-y-3 ';

  if (pathname !== '/bchat'){
    xClassName += 'hidden lg:block'
  }
  
  return (
    <section className={cn(xClassName, className)}>
      {
        Array.from('ABCDEFGHIJKLMNOPQRS').map(
          (l) => (
            <div key={l} className='w-full flex gap-2'>
              <Skeleton className='h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gray-300'/>
              <div className='space-y-2 flex-grow'>
                <Skeleton className='w-[90%]  h-4 rounded-2xl bg-gray-300'/>
                <Skeleton className='w-[75%] max-w-[300px] h-3 rounded-xl bg-gray-300'/>
              </div>
            </div>
          )
        )
      }
    </section>
  )
}

export default ChatbarContainer