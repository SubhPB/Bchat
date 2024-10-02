/** Byimaan */

'use client';

import React, {useRef} from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectContactsSlice } from '@/lib/redux/features/contacts/selectors';
import { fetchContacts } from '@/lib/redux/features/contacts/actions';

import { SelectCardSkeleton } from './card';
import { ExpectedContactsDataTypeFromAPI } from '@/lib/redux/features/contacts/slice';
import Infobar from '@/components/common/Infobar';

type Props = {
  className ?: string;
  children : (data: ExpectedContactsDataTypeFromAPI) => React.ReactNode;
}

function InitData({className, children}: Props) {

  const appDispatch = useAppDispatch();
  const initialized = useRef(false);

  const {data, gotError, isLoading} = useAppSelector(selectContactsSlice) ;

  if (!initialized.current) {
    if (!data && !gotError){
      appDispatch(fetchContacts())
    }
    initialized.current = true;
  }

  if (isLoading){
    return (
      <div className={cn(className)}>
        <Skeleton className='w-full my-2 rounded-sm bg-gray-300'/>
        {
          Array.from('abcdef').map( i => <SelectCardSkeleton key={i}/>)
        }
      </div>
    )
  };

  if (!gotError){
    return (
        <Infobar error allowDefaultIcons>
            Oops! Something went wrong while fetching your contact details. You could try again later
        </Infobar>
      )
  };

  if (data){

    if (data.length === 0){
      return (
        <Infobar success renderCloseButton>
            It look like you have not saved any contacts yet. We recommend you to add contacts <span><Link className='underline text-blue-400' href="/bchat/contacts">Add Contact</Link></span>.
        </Infobar>
      )
    }

    return (
      <div className={cn(className)}>
        {children(data)}
      </div>
    );
  }



  return (
    <Infobar error allowDefaultIcons>
        Oops! Something went wrong due to an unexpected event. You may try again later.
    </Infobar> 
  );
}

export default InitData