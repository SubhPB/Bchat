// Byimaan

import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { VscGithubInverted } from 'react-icons/vsc';
import { signIn } from 'next-auth/react';

type signInOpt = 'google' | 'github'

function OAuth() {

  const doSignIn = (provider: signInOpt) => {
    signIn(provider, {
      callbackUrl: '/'
    })
  };
  
  return (
    <div className="oauth flex w-full justify-around my-4">
        <div className="w-1/2 py-2 cursor-pointer rounded-lg hover:bg-gray-200 flex justify-center" onClick={() => doSignIn('github')}>
            <VscGithubInverted size={20} />
        </div>
        <div className="w-1/2 py-2 cursor-pointer rounded-lg hover:bg-gray-200 flex justify-center">
            <FcGoogle size={20} />
        </div>
    </div>
  )
}

export default OAuth