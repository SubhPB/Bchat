/**
 * Byimaan
 * 
 * some thoughts for this page
 *      [1] CRUD on the user's account (profile info)
 *      [2] SignOut or other Auth related feature
 *      [3] Would split the page design into 2 parts 
 *          (3.1) one for userimage, username signout
 *          (3.2) second for remaining field of user model  
 */


import React from 'react';

import { Workarea } from '@/components/routes/bchat/layout/workarea';
import Profile from '@/components/routes/bchat/account/profile/index';
import AccountFieldsSection from '@/components/routes/bchat/account/account-fields/account-fields-section';
import AccountInit from '@/components/routes/bchat/account/account-init';
import { auth } from '@/lib/auth';
import Infobar from '@/components/common/Infobar';

async function page() {

  const session = await auth();
  const userId = session?.adapterUser?.id ?? session?.user?.id;

  if (!userId){
    return (
      <Workarea.main className='max-w-[790px] p-2'>
        <Infobar error allowDefaultIcons>
          Oops! Something unexpected happended while fetching your account information. You may try again later
        </Infobar>
      </Workarea.main>
    )
  }

  return (
    <Workarea.main className='p-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'>
        <AccountInit className="w-full max-w-[790px] md:flex md:justify-between pb-2 space-y-6 md:space-y-2" userId={userId}>
          <Profile className='md:w-[42%]'/>
          <AccountFieldsSection className='md:w-[57%] ' userId={userId} />
        </AccountInit>
    </Workarea.main>
  )
}

export default page