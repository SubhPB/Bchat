// Byimaan

import React from 'react';
import { headers } from 'next/headers';

import { Workarea } from '../../components/routes/bchat/layout/workarea';
import { cn } from '@/lib/utils';

async function BChat() {
    const pathname = headers().get('x-pathname');

    let xClassName = "flex justify-center items-center";
    const pathnameMatches = pathname === '/bchat';

    /** According to our prewritten className w-[0px] will only be applied to sm screens because of lg:w-[72%] */
    if (pathnameMatches) xClassName += " w-[0px] hidden lg:flex";

    return (
        <Workarea.main className={cn(xClassName)}>

            <Workarea.thumbnail />

        </Workarea.main>
    )
};

export default BChat