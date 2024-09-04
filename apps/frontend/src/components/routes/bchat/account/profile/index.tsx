/**
 * Byimaan
 * 
 * Goals of this component :-
 * 
 *  1) Represent username and sign out button
 *  2) Profile picture wit a option to change it
 */

'use client'

import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import React from 'react';

import ProfileNavbar from './navbar';
import ProfileImage from './image';
import { captializeText } from '@/utils/features/typing/text';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectUserSlice } from '@/lib/redux/features/user/selectors';

import { Skeleton } from '@/components/ui/skeleton';



type Props = {
    className: string
}

function Profile({className}:Props) {

  const {data, gotError, isLoading} = useAppSelector(selectUserSlice);

  if (!data){

    if (gotError){
      toast.error("Oops! Failed to fetch profile details")
    }

    const MySkeleton = ({className=''}: Partial<Props>) => <Skeleton className={cn('bg-gray-300 rounded-md h-8', className)}/>

    return (
      <div className={cn(className, 'space-y-3')}>
        <div className="nav-skelton flex justify-between items-center py-1">
          <MySkeleton className='w-[60%]'/>
          <MySkeleton className='w-[30%]'/>
        </div>
        <div className='space-y-2'>
          <MySkeleton className='w-full h-[340px]'/>
          <MySkeleton />
        </div>
      </div>
    )
  };


  return (
    <div className={cn(className)}>
      <ProfileNavbar className='flex justify-between items-center border-b-[.8px] py-2 border-zinc-600' username={captializeText(data.name)}/>
      <ProfileImage className='my-2 space-y-2' imgSrc={data.image || undefined}/>
    </div>
  )
}

export default Profile