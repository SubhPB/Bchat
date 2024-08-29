/**
 * Byimaan
 * 
 * Requirements :-
 *   1. Display proile image of user
 *   2. shows the name and email of the user and also give edit icon beside that info.
 *   3. Three option at the bottom.
 *      (3.1) Delete contact
 *      (3.2) Block contact
 *      (3.3) Chat with contact  
 */

import React from 'react';
import { ContactSucceesReturnType } from '@/app/api/bchat/contact/route';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

import { ViewCardFooter } from './footer-options';
import { DeleteOption, BlockOption, TextOption } from './footer-options';
import { EditContactField } from './edit-field';

import { captializeText } from '@/utils/features/typing/text';

type Props = {
  contact: ContactSucceesReturnType['GET'][0],
  className ?: string
};

function ViewCard({contact, className=''}: Props) {

  const contactUser = contact['contact'] /** contact.contact refers to User model */
  const imgFallback = String(contact?.name ?? contactUser.name).toUpperCase().slice(0, 2)

  return (
    <Card className={cn('w-full sm:w-[330px] lg:w-[390px] flex-shrink-0 p-4 shadow-slate-400 shadow-sm', className)}>

      <CardContent className='flex gap-2 p-0'>
        <Avatar className='relative block size-[90px] sm:size-[120px] bg-teal-200 rounded-2xl overflow-hidden flex-shrink-0'>
          <AvatarImage className=' absolute inset-0 size-full' src={contactUser.image ?? undefined} alt={`@${contact.name}-contact-img`}/>
          <AvatarFallback className='absolute bg-zinc-300 text-gray-100  inset-0 grid place-content-center text-2xl'>{imgFallback}</AvatarFallback>
        </Avatar>

        <div className="card-crud w-[180px] lg:w-[220px] flex-shrink-0 font-semibold space-y-3 text-[1rem] px-1">
          <div className="contact-info">
            <p className='font-bold text-primary-bchat w-[80%] truncate'>{captializeText(contact?.name ?? contactUser.name)}</p>
            <p className='font-semibold text-secondary-bchat w-[80%] truncate text-xs pb-3'>{contactUser.email}</p>

            <EditContactField contactId={contact.id} key={'name'} value={contact.name}/>
          </div>

          <ViewCardFooter className='flex gap-3 text-[1.2em]'>
            <DeleteOption contactId={contact.id}/>
            <BlockOption contactId={contact.id} isBlocked={contact.isBlocked}/>
            <TextOption/>
          </ViewCardFooter>
        </div>
      </CardContent>

    </Card>
  )
}

export default ViewCard