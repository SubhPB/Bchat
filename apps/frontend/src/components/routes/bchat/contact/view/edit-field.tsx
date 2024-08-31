/**
 * Byimaan
 * 
 * This component offers to edit name of the contact.
 */
'use client';

import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";

import { IoCheckmarkDone } from "react-icons/io5";
import { GiveTipOfComponent } from "./footer-options";
import toast from "react-hot-toast";

import { Client as ClientComponentFeature } from '@/utils/features/http/feature_type/response/client';

import { ContactIDSuccessReturnType } from "@/app/api/bchat/contact/[contactId]/route";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/redux/hooks";
import { upsertContact } from "@/lib/redux/features/contacts/slice";

import { useClickScopeEffect } from "@/utils/react-hooks/use-click-scope";

type UpdatedContact = ContactIDSuccessReturnType['PATCH']

type Props = {
    contactId: string;
    key: string;
    value: string;
};

const rootApiEndpoint = '/api/bchat/contact';

export function EditContactField({contactId, value}:Props){

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const appDispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement>(null);

    /**
     * editMode if true means user wants to edit/ change the value of field.
     */

    const commitChange = async() => {

        if (loading){
            /** do not run this function when it is already running */
            return
        }

        const filteredValue = inputValue.trim()
        if (filteredValue.length < 4){
            toast.error("Contact name is too short");
            return
        };
        
        const toastRef = toast.loading("Processing request...");
        setLoading(true)
        
        const response = await fetch(`${rootApiEndpoint}/${contactId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: filteredValue
            })
        });

        const payload = await response.json();
        toast.dismiss(toastRef);
        setLoading(false)

        if (response.ok){
            const updatedContact = payload.data as UpdatedContact;
            appDispatch(upsertContact(updatedContact))
        };

        const toastObj = payload?.userFriendlyData?.toast;
        if (toastObj){
            const buildInToast = ClientComponentFeature.useToast(toastObj);
            buildInToast()
        };
    };
    
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            setEditMode(false)
            commitChange()
        }
    }
    const ReadMode = () => (
        <>
            <p className='font-medium text-[.8em] w-[90%] truncate'>{value}</p>
            <GiveTipOfComponent onClick={() => setEditMode(true)} tipContent="Edit this field">
                <FaEdit className={cn("text-primary-bchat", loading && "cursor-not-allowed")}/>
            </GiveTipOfComponent>
        </>
    );

    const EditMode = () => (
        <>
            <input
             value={inputValue}
             onKeyDown={handleEnterKey}
             onChange={e => setInputValue(e.target.value)}
             type="text"
             className={"outline-none w-[90%] border-b-[1px] pb-1 text-xs border-primary-bchat font-normal"} autoFocus/>
            <GiveTipOfComponent onClick={commitChange} tipContent="Commit change.">
                <IoCheckmarkDone className="text-primary-bchat"/>
            </GiveTipOfComponent>
        </>
    );

    /** If edit mode is on and user clicked outside the scope of card then this will set the editState to be false */
    useClickScopeEffect<React.RefObject<HTMLDivElement>>({rootRef: ref, state: editMode, setState: setEditMode,dependencies: [editMode]})
   
    return (
        <div className=" flex flex-row-reverse gap-2 transition-all" ref={ref}>
            {
                editMode ? (
                    <EditMode/>
                ) : (
                    <ReadMode/>
                )
            }
        </div>
    );
}