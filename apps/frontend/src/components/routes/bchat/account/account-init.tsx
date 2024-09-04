/**
 * Byimaan
 * 
 * Purpose of this component:-
 * 1) it will the fetch user data using the slice action just to initialize account page
 * 
 * [*] we could do it inside the components but i thought i should seperate this logic
 */

'use client';

import React, {useRef} from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUserData } from '@/lib/redux/features/user/actions';
import { cn } from '@/lib/utils';
import { selectUserSlice } from '@/lib/redux/features/user/selectors';

type Props = {
    className: string;
    children: React.ReactNode;
    userId: string;
}

function AccountInit({className, children, userId}:Props) {

    const appDispatch = useAppDispatch();
    const initialized = useRef(false);

    const {data, gotError} = useAppSelector(selectUserSlice)

    if (!initialized.current){
        if(!data && !gotError){
            appDispatch(fetchUserData(userId));
            initialized.current = true
        }
    };

    return (
        <div className={cn('account-page-init', className)}>
            {children}
        </div>
    )
}

export default AccountInit