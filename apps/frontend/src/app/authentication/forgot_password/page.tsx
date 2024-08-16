/**
 * BYIMAAN
 */

/**
 * Jobs of this component 
 *  it will only work with the valid reset token which will be received by searchParams. 
 */

import React from 'react';
import { ResetPasswordForm } from '../_forms/reset-password';
import { redirect } from 'next/navigation';

import { JWT } from '@/utils/features/security/jwt';
import { JwtPayload } from 'jsonwebtoken';

const WHERE_IAM = "src/app/authentication/forgot_password"

type Props = {
  params: {},
  searchParams: { [key: string]: string | string[] | undefined }
}
const GENERAL_SECRET_KEY = process.env.GENERAL_SECRET_KEY!

async function forgotPassword({params, searchParams}: Props) {

  const reset_token = searchParams?.reset_token;

  // Lets see if reset_token pass the very basic security check.
  const tokenSeemsOKAY = reset_token && typeof reset_token === 'string' && reset_token.length > 8
  if (!tokenSeemsOKAY){
    /**
     * These searchParams `error` are not for any specific purpose but just for developer's readability
     */
    redirect("/?error=forgot_password_access_denied")
  };

  const payload = JWT.verifyJWTToken(reset_token) as JwtPayload | null;

  if (!payload){
    redirect("/?error=forgot_password_access_denied&token=invalid_or_expired");
  };

  // Security check payload must have these values
  if (!payload?.recipient?.includes(WHERE_IAM) || !payload?.user?.email || !payload?.reset_key){
    redirect("/?error=forgot_password_access_denied&token=invalid_or_unauthorized");
  };

  const email = payload.user.email;

  /**
   * There is only one security check that has been left to implement which is to check whether this reset_token is already been used or not. But for that we have to make a database query which i do not make 
   * For this security check has been done in 'api/authentication/forgot_password/route.ts' where the user will submit his form with newPassword and will be informed that this reset_token is already been used and no longer valid to change password.
   */

  return (
    <main className="flex min-h-dvh flex-col items-center pt-10">
      <ResetPasswordForm 
        email={email}
        resetToken={reset_token}
        className="w-[400px]"
      />
    </main>
  )
}

export default forgotPassword