// Byimaan

import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    children ?: React.ReactNode;
    className ?: string;
    allowToRender ?: boolean;
    overWriteDefaultClassName ?: boolean;
}


function FieldNotify({children, className, allowToRender, overWriteDefaultClassName=false}: Props) {

    if (!allowToRender || !children){
        return <></>
    };

    let defaultClassName = "text-red-400 text-xs font-semibold rounded-lg ";

    if (overWriteDefaultClassName){
        defaultClassName = ''
    }

    return (
        <div className={cn(defaultClassName, className)}>
            {children}
        </div>
    )
};


export default FieldNotify