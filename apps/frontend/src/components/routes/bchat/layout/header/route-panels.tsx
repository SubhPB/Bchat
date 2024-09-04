/**
 * Byimaan
 */

'use client'

import React from "react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Panel = {
    name: string;
    href: string;
    className ?: string
}

const panels = [
    {
        name: 'Home',
        href: '/bchat',
    },
    {
        name: 'Contact',
        href: '/bchat/contact',
    },
    {
        name: 'Account',
        href: '/bchat/account'
    }
] as Panel[];

type PanelProp = {
    panel: typeof panels[number],
    isActive: boolean,
    onClick: (href: string) => void,
    className ?: string
}

function RoutePanel({panel, isActive, onClick, className=""}: PanelProp){

    const handleClick = () => {
        if (!isActive){
            onClick(panel.href)
        }
    }

    return (
        <div className={cn("font-semibold text-zinc-300 border-gray-100 border-0 py-2 cursor-pointer ", isActive && "text-gray-100 border-b-[6px] scale-110 cursor-default", className)} onClick={handleClick}>
            {panel.name}
        </div>
    )
}


export function RoutePanels(){

    const router = useRouter(), pathname = usePathname();

    const handleClick = (href: string) => {
        router.push(href)
    };

    return (
        <div className="route-panels flex gap-3">
            {
                panels.map(
                    panel => <RoutePanel
                    key={panel.href}
                    panel={panel}
                    isActive={panel.href === pathname}
                    onClick={handleClick}
                    className={panel?.className}/>
                )
            }
        </div>
    )
}