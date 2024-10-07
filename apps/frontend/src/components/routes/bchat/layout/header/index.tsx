/**
 * Byimaan
 */

import React from 'react';
import Link from 'next/link';

import BChatText from '@/components/common/AppText.server';
import UserAvatar from './user-avatar';
import { RoutePanels } from './route-panels';

function BChatHeader() {

  return (
    <header className='p-3 pb-0 bg-primary-bchat '>
      <div className="top-part flex gap-2 items-center">
        <Link href='/bchat'>
          <BChatText textSizeInTailwind='text-[2.5rem]'  className='!text-gray-100'/>
        </Link>
        <div className='seperator h-[2.5rem] w-[1.2px] !bg-gray-100'> </div>
        <UserAvatar />
      </div>
      <RoutePanels />
    </header>
  )
}

export default BChatHeader