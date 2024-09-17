/**
 * Byimaan
 * 
 * Purpose of this component
 *     Most of user sepecfic work like chatting adding contacts or settings etc. will come under this component.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Thumbnail } from "@/components/routes/bchat/layout/workarea/thumbnail";

type Props = {
    children : React.ReactNode;
    className ?: string
};

type WorkAreaTS = {
    main: React.FC<Props>,
    thumbnail: React.FC<Pick<Props, 'className'>>
}

export const Workarea: WorkAreaTS = {
    main: ({children, className}) => (
        <main className={cn("h-full w-full lg:w-[72%] ", className)}>
            {children}
        </main>
    ),
    thumbnail: ({className}) => (
        <Thumbnail className={cn(className)}/>
    )
}