// Byimaan

import React from 'react';
import { headers } from 'next/headers';

import { Workarea } from '../../components/routes/bchat/layout/workarea';
import BChatText from '@/components/common/AppText.server';
import { TechStack } from '@/components/common/TechStack.server';

async function BChat() {
    const pathname = headers().get('x-pathname');

    let xClassName = "flex justify-center items-center";
    const pathnameMatches = pathname === '/bchat';

    /** According to our prewritten className w-[0px] will only be applied to sm screens because of lg:w-[72%] */
    if (pathnameMatches) xClassName += " w-[0px] hidden lg:flex";

    return (
        <Workarea.main className={xClassName}>

            <div>
                <BChatText textSizeInTailwind="text-[8rem]" className='text-gray-300'
                    spanChildOf_B_letter={
                    <span className='absolute left-full top-5 text-[0.3em] tracking-wider'>YIਮਾਨ</span>
                    }
                />
                {
                TechStack.render["*"]({
                    size: 24,
                    className:"w-full flex justify-center items-center gap-3 sm:gap-5",
                    iconClassName: "flex gap-3 sm:gap-5 text-bold text-gray-400"
                })
                }
            </div>

        </Workarea.main>
    )
}

export default BChat