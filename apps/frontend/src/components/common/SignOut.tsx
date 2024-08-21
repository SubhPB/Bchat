/**
 * Byimaan
 */


'use client';

import { signOut } from "next-auth/react";

type Props = {
    children: React.ReactNode;
    className ?: string
}

export function SignOutBtn({children, className=""}: Props){

    const signMeOut = () => {
        signOut({
            redirect: true,
            callbackUrl: '/authentication?action=user_signed_out',
        })
    }

    return (
        <div className={className} onClick={signMeOut}>
            {children}
        </div>
    )
}