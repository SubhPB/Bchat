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
    className ?: string
};

type WorkAreaTS = {
    main: React.FC<Props>
}

export const Workarea: WorkAreaTS = {
    main: ({children, className}) => (
        <main className={cn("h-full w-full lg:w-[72%]", className)}>
            {children}
        </main>
    )
}