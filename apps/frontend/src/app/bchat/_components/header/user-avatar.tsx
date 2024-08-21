/**
 * Byimaan
 */

import React from 'react';
import { auth } from '@/lib/auth';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SignOutBtn } from '@/components/common/SignOut';

export async function UserAvatar() {

    const session = await auth();

    if (!session){
        return <></>
    };

    const {user, adapterUser} = session;
    const currUser = user ?? adapterUser;

    let imgFallback = String(currUser?.name ?? '').toUpperCase().slice(0, 2);

    return (
    <div className='flex gap-1'>
        <Avatar>
            <AvatarImage src={currUser?.image ?? undefined} alt="@user-profile-img" />
            <AvatarFallback className='bg-zinc-400 text-gray-100'>{imgFallback}</AvatarFallback>
        </Avatar>

        <DropdownMenu >
            <DropdownMenuTrigger asChild className='text-gray-100'>
                <Button className=' p-0 text-sm !bg-transparent outline-none hover:text-secondary-bchat rounded-lg focus-visible:ring-0 ring-offset-transparent ring-offset-0 focus-visible:ring-offset-0' type='button'>{currUser?.email ?? currUser?.name} </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='font-light'>
                <DropdownMenuItem>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SignOutBtn>
                        Sign out
                    </SignOutBtn>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    </div>
    )
}

export default UserAvatar