// Byimaan

import React from 'react';
import { auth } from '@/lib/auth';

async function BChat() {

    const session = await auth();

    return (
        <></>
    // <main className='min-h-dvh grid place-items-center px-8 '>
    //     <code className='w-full overflow-x-hidden  sm:w-[550px] xl:w-[980px] text-xs font-semibold bg-gray-300 rounded-xl p-5'>
    //         {
    //             JSON.stringify(session)
    //         }
    //     </code>
    // </main>
    )
}

export default BChat