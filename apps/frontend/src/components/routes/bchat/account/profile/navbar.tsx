/**
 * Byimaan
 * 
 * Only 2 functionalities (1) Display username (2) signout button
 */

import { SignOutBtn } from '@/components/common/SignOut';
import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
    className: string;
    username: string;
}

function ProfileNavbar({className, username}:Props) {

    return (
        <div className={cn(className)}>
            <p className='w-[70%] truncate  text-lg font-semibold'>{username}</p>
            <SignOutBtn className='rounded-lg text-white bg-secondary-bchat hover:bg-primary-bchat text-primary text-xs font-normal py-2 px-3 w-fit cursor-pointer'>
                Sign out
            </SignOutBtn>
        </div>
    )
}

export default ProfileNavbar