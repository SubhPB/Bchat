/** Byimaan */

'use client';

import { cn } from '@/lib/utils';
import React, {useEffect, useState} from 'react';

import { MdClose } from "react-icons/md";
import { MdWarning } from "react-icons/md";
import { MdError } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";


type Props = {
    warning ?: boolean;
    success ?: boolean;
    error ?: boolean;
    className ?: string;
    children: React.ReactNode;
    
    shutdownInMS ?: number;
    renderCloseButton ?: boolean;
    shouldRender ?: boolean;

    allowDefaultIcons ?: boolean
};

const bg = {
    success : 'bg-[#88f1a1]',
    error: 'bg-[#f19888]',
    warning: 'bg-[#f1d788]'
} as const;

function Infobar({success, warning, error, className='', children, shutdownInMS, renderCloseButton, shouldRender=true, allowDefaultIcons}:Props) {

    const [render, setRender] = useState(shouldRender);

    const closeInfobar = () => setRender(false);

    /** for the timer functionality */
    useEffect(
        () => {
            let fn : undefined | ReturnType<typeof setTimeout>;
            if (shutdownInMS && shutdownInMS > 0){
                fn = setTimeout(closeInfobar, shutdownInMS)
            };
            return () => fn && clearTimeout(fn)
        }, []
    )


    if (!render){
        return <></>
    };

    let Icon = () => <></>;

    if (allowDefaultIcons){
        if (success){
            Icon = () => <FaThumbsUp/>
        } else if (warning){
            Icon = () => <MdWarning className="text-lg"/>
        } else if (error){
            Icon = () => <MdError className='text-lg'/>
        };
    }

    return (
        <div className={
            cn(
                // user can easily put in the icon + message without adjusting css if user have more complex logic he could overwrite the exuisting className
                "info-bar w-full text-sm text-white px-2 py-4 flex gap-2 hover:scale-[1.01] transition-all my-1",
                renderCloseButton && 'relative',
                success && bg.success,
                warning && bg.warning,
                error && bg.error,
                className
            )}>
                {renderCloseButton && <MdClose className='absolute text-lg font-semibold cursor-pointer right-2 top-1' onClick={closeInfobar}/>}
                { allowDefaultIcons && <Icon /> }
                {children}
        </div>
    )
}

export default Infobar