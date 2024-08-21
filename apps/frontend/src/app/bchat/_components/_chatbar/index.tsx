/**
 * Byimaan
 * 
 * Purpose of this component 
 *    Display the recent chats of the user and sort then according to the recent activity
 */


import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
  className: string
}

function ChatbarContainer({className}: Props) {
  
  return (
    <section className={cn(className)}>

    </section>
  )
}

export default ChatbarContainer