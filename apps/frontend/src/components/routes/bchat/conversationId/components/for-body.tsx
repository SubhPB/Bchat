/** Byimaan
 * 
 * There would be only messages that will be shown here in conversation body
 * 
 */

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
    className ?: string
};


export function Message({className} : Props){
    return (
        <div className={cn(className)}>
            
        </div>
    )
}