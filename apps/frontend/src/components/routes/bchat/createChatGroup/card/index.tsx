/** Byimaan */

import React from 'react';
import { ContactSucceesReturnType } from '@/app/api/bchat/contact/route';
import {CustomImgAvatar} from '@/components/common/custom-img-avatar';

import { Skeleton as ShadCnSkeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { captializeText } from '@/utils/features/typing/text';

type Props = {
    contact: ContactSucceesReturnType['GET'][0];
    className ?: string;
    isSelected: boolean;
    onSelect: (userId: string) => void
  };

function SelectCard({contact, className, isSelected, onSelect}: Props) {

    const contactUser = contact['contact'];
    const imgFallback = String(contact?.name ?? contactUser.name).toUpperCase().slice(0, 2);

    const contactNameEqualsUserName = contact?.name === contactUser.name;

    return (
        <Card 
            className={
                cn("w-full p-2 rounded-sm cursor-pointer ", className, isSelected && "cursor-default bg-green-200")
            } 
            onClick={() => onSelect(contactUser.id)}
            >
            <CardContent>
                <CustomImgAvatar
                    imgSrc={contactUser.image ?? undefined}
                    fallback={imgFallback}
                    className="mb-1 h-[unset] w-full aspect-[2] rounded-sm self-center "
                    isAwsObject
                />
                <div className='space-y-2 text-xs'>
                    <p className="font-bold text-primary-bchat w-[90%] text-sm truncate ">
                        {captializeText(contact.name ?? contactUser.name)}
                    </p>
                    {
                        !contactNameEqualsUserName && (
                            <p className='text-secondary-bchat
                            w-[90%] truncate '>
                                {captializeText(contactUser.name)}
                            </p>
                        )
                    }
                    <p className='text-secondary-bchat
                        w-[90%] truncate '>{contactUser.email}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
};

export function SelectCardSkeleton(){
    const Skeleton = ({className}: Pick<Props, "className">) => <ShadCnSkeleton className={cn("bg-gray-300", className)}/>
    return (
      <Card className="w-full inline-block mr-1 mb-1 p-2 max-w-[220px]">
        {/* Will adjust later on... */}
        <CardContent className="gap-2 p-0">
          <Skeleton className="w-full aspect-[1.3] p-2 rounded-sm mb-1"></Skeleton>
          <div className=" space-y-3 text-[1rem]">
            <Skeleton className="w-[80%] h-6 rounded-lg"/>
            <Skeleton className="w-[65%] h-4 rounded-lg"/>
          </div>
        </CardContent>
  
      </Card>
    )
}

export default SelectCard