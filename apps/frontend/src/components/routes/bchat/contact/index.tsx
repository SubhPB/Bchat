/**
 * Byimaan
 * 
 * This component holds the records of all contacts 
 */
'use client';

import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";

import { MdErrorOutline } from "react-icons/md";

import { fetchContacts } from "@/lib/redux/features/contacts/actions";
import { selectContactsSlice } from "@/lib/redux/features/contacts/selectors";

import ContactCardSkeleton from "./view/skeleton";
import ViewCard from "./view";

type Props = {
    className ?: string;
};

export function ContactBook ({className=''}: Props){

    const appDispatch = useAppDispatch();
    const initialized = useRef(false);

    const {data, gotError, isLoading} = useAppSelector(selectContactsSlice) ;

    if (!initialized.current) {
        if (!data && !gotError){
            // store.dispatch(fetchContacts())
            appDispatch(fetchContacts())

        };
        initialized.current = true
    };

    if (isLoading){
        return (
            <div className={cn(className)}>
                {
                    Array.from('abcdef').map( i => <ContactCardSkeleton key={i}/>)
                }
            </div>
        )
    };

    if (gotError){
        return (
            <div className={cn("bg-[#f19888] text-sm text-white font-seimbold px-2 py-4 flex gap-2", className)}>
                <MdErrorOutline className="text-xl"/>
                <span>
                    Oops! Something went wrong while fetching your contact details. You could try again later
                </span>
            </div>
        )
    }


    if (data) {
        return (
            <div className={cn(className)}>
                {
                    data.map(
                        contact => <ViewCard key={contact.id} contact={contact}/>
                    )
                }
            </div>
        )
    };

    return <></>
}

