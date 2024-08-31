/**
 * Byimaan
 * 
 * This component holds the records of all contacts 
 */
'use client';

import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";


import { fetchContacts } from "@/lib/redux/features/contacts/actions";
import { selectContactsSlice } from "@/lib/redux/features/contacts/selectors";

import ContactCardSkeleton from "./view/skeleton";
import ViewCard from "./view";
import { ContactsHandler } from "./cards-handler";
import Infobar from "@/components/common/Infobar";

type Props = {
    className ?: string;
};

export function ContactBook ({className=''}: Props){

    const appDispatch = useAppDispatch();
    const initialized = useRef(false);

    const {data, gotError, isLoading} = useAppSelector(selectContactsSlice) ;

    if (!initialized.current) {
        if (!data && !gotError){
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
            <Infobar error allowDefaultIcons>
                Oops! Something went wrong while fetching your contact details. You could try again later
            </Infobar>
        )
    };

    if (data) {

        if (!data.length){
            return (
                <Infobar success renderCloseButton>
                    It look like you have not saved any contacts yet. We recommend you to add contacts from the above given form.
                </Infobar>
            )
        }

        return (
            /** Used the render prop pattern for readablity */
            <ContactsHandler className={cn(className)} contacts={data} renderSearchbar>
                {
                    (contacts) => (
                        contacts.map(
                            contact => <ViewCard key={contact.id} contact={contact}/>
                        )
                    )
                }
            </ContactsHandler>
        )
    };

    return (
        <Infobar error allowDefaultIcons>
            Oops! Something went wrong due to an unexpected event. You may try again later.
        </Infobar> 
    )
}

