/**
 * Byimaan
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { S3 } from '@/utils/services/S3';

type Props = {
    className: string;
    imgSrc ?: string;
    fallback : string;
    isAwsObject ?: boolean;
}

function CustomImgAvatar({className, imgSrc, fallback, isAwsObject}: Props) {

  if (imgSrc && isAwsObject) {
    imgSrc = S3.getObjectUrl(imgSrc);
  };

  return (
    <Avatar className={cn('relative ', className)}>
        <AvatarImage className="absolute rounded-none inset-0" alt='img-avatar' src={imgSrc}/>
        <AvatarFallback className='absolute inset-0 grid text-xl place-content-center rounded-none bg-zinc-300 text-gray-100'> {fallback} </AvatarFallback>
    </Avatar>
  )
}

export {CustomImgAvatar}