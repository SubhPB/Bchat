/** Byimaan */


import React from 'react';

import { Workarea } from '@/components/routes/bchat/layout/workarea';

function page() {
  return (
    <Workarea.main
        className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'
    >
        <div className='w-full max-w-[790px]'>
            {
                /**
                 * Components we may need:
                 * [1] Provider
                 * [2] Init wrapper to initialize the contacts
                 * [3] Form
                 * [4] SearchBar to select contacts to be added in group chat
                 */
            }
        </div>
    </Workarea.main>
  )
}

export default page