/**
 * Byimaan
 */


import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';

type Props = {
    className: string;
    imgSrc ?: string
}

function ProfileImage({className, imgSrc}:Props) {


  return (
    <div className={cn(className)}>
        <Avatar className='relative rounded-lg w-full h-[340px]'>
            <AvatarImage className="absolute rounded-none inset-0" alt='profile-img' src={imgSrc}/>
            <AvatarFallback className='absolute inset-0 grid text-xl place-content-center rounded-none bg-zinc-300 text-gray-100'> BY </AvatarFallback>
        </Avatar>

        <Button variant={'ghost'} className='flex items-center justify-center gap-2 w-full text-white bg-primary-bchat md:bg-gray-200 md:text-primary hover:bg-primary-bchat hover:text-white'>
            <EditIcon size={14}/>
            <p>Edit profile</p>
        </Button>
    </div>
  )
};

export default ProfileImage