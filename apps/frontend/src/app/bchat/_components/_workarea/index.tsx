/**
 * Byimaan
 * 
 * Purpose of this component
 *     Most of user sepecfic work like chatting adding contacts or settings etc. will come under this component.
 */

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
    children : React.ReactNode;
    className: string
};

export function WorkArea({children, className}: Props){
    return (
        <section className={cn("user-workbench", className)}>
            {children}
        </section>
    );
}