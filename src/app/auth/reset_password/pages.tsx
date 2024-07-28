// Byimaan

import React from 'react';
import { db } from '@/lib/db';

import ResetForm from '../_components/resetPassword/ResetForm';
import TokenForm from '../_components/resetPassword/TokenForm';
import { User } from '@prisma/client';

/**
 * GOALS :-
 *  first check if token exists in searchparams
 *      1. If not token 
 *          then pop up dialog box which asks for an token using <input/> 
 *      2. If token exists 
 *          -> make database query to determine whether token is valid or not?
 *          [a] If it is indeed valid
 *              then continue the process of password reseting and offers the input tags to enter new password.
*           [b] If it is not valid
*               then pop up the dialog box to either go to '/signin' page or to the '/'
 */

type Props = {
    searchParams : {
        token ?: string
    }
}

async function ResetPasswordWithToken({searchParams}: Props) {

    let token = searchParams.token;

    if (!token || token.length < 8){
        // now pop up dialog box which asks for an token using <input/> 
        return <TokenForm />
    };

    // token verification
    let response = null;
    try {
        response = await db.resetPasswordToken.findUnique({
            where: {
                token,
            },
        });
    } catch {
        // just continue...
    }

    if (!response || (response && response.expiresAt.getTime() < Date.now())){
        return <TokenForm />
    };

    return <ResetForm tokenDetails={response}/>
}

export default ResetPasswordWithToken