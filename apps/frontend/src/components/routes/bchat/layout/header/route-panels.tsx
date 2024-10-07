/**
 * Byimaan
 */

'use client'

import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

import { useRouter, usePathname } from "next/navigation";

import { FaHome } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserPen } from "react-icons/fa6";

type Panel = {
    name: string;
    href: string;
    className ?: string;
    Icon ?: ElementType
}

const panels = [
    {
        name: 'Home',
        href: '/bchat',
        Icon: FaHome
    },
    {
        name: 'Contact',
        href: '/bchat/contact',
        Icon: FaAddressBook
    },
    {
        name: 'Add Group',
        href: "/bchat/createChatGroup",
        Icon: FaUserGroup
    },
    {
        name: 'Account',
        href: '/bchat/account',
        Icon: FaUserPen
    }, 
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

    const Icon = panel.Icon;

    return (
        <div className={cn("font-semibold flex gap-1 pl-2 items-center justify-center text-zinc-300 border-gray-100 border-0 py-2 cursor-pointer whitespace-nowrap", isActive && "text-gray-100 border-b-[6px] scale-110 cursor-default", className)} onClick={handleClick}>
            {
                Icon && <Icon/>
            }
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
        <div className="route-panels flex gap-4 overflow-x-scroll scrollbar-none">
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