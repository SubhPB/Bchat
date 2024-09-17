/** Byimaan */

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
    children : React.ReactNode;
    className ?: string
};

type Conversation = {
    [ctype : string]: React.FC<Props>
};

export const Conversation : Conversation = {
    header: ({children, className}) => (
        <div className={cn(className)}>
            {children}
        </div>
    ),
    body: ({children, className}) => (
        <div className={cn(className)}>
            {children}
        </div>
    ),
    footer: ({children, className}) => (
        <div className={cn(className)}> 
            {children}
        </div>
    )
}    