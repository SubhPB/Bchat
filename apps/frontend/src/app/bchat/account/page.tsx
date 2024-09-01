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

function page() {
  return (
    <Workarea.main className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'>
        <p> Account Page</p>
    </Workarea.main>
  )
}

export default page