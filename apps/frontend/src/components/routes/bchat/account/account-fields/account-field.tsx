/**
 * Byimaan
 */
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import FieldNotify from '@/components/common/field-notify-box';
import { cn } from '@/lib/utils';


type Props = {
    isLoading: boolean;
    label ?: {
        htmlFor: string;
        value: string
    };
    notification ?: string | undefined;
    children: React.ReactNode
}; 




const AccountField = (props:Props) =>  {

    const{isLoading, label, notification, children} = props;

    if (isLoading){
        return (
            <Skeleton className={'w-full rounded-md bg-gray-300 py-4'} />
        )
    }

    return (
        <div className={cn( (!!label || !!notification) && 'space-y-1')}>
            {
                label && <Label htmlFor={label.htmlFor}> {label.value} </Label>
            }
            {
                notification && (
                    <FieldNotify allowToRender={!!notification}>
                        {notification}
                    </FieldNotify>
                )
            }
            {children}
        </div>
    )
};

interface AccountFieldProps{
    isLoading: boolean;
    children: React.ReactNode
}

export function AccountFieldButton (props: AccountFieldProps) {
    
    const {isLoading, children} = props;

    if (isLoading){
        return <Skeleton className='bg-gray-300 rounded-md py-5 w-full max-w-[200px]'/>
    }

    return <>{children}</>
}

export default AccountField