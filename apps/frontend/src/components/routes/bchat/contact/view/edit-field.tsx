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
import { Duration } from "@/utils/features/time/duration";

type Props = {
    contactId: string;
    key: string;
    value: string;
};

export function EditContactField({contactId, key, value}:Props){

    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(value)
    const ref = useRef<HTMLDivElement>(null);

    /**
     * editMode if true means user wants to edit/ change the value of field.
     */

    const commitChange = async() => {
        const filteredValue = inputValue.trim()
        if (filteredValue.length < 4){
            toast.error("Contact name is too short");
            return
        };
        
        const toastRef = toast.loading("Processing request...");
        await Duration.holdOn(4000);
        toast.dismiss(toastRef);
    };
    
    const ReadMode = () => (
        <>
            <p className='font-normal text-[.8em] w-[90%] truncate'>{value}</p>
            <GiveTipOfComponent onClick={() => setEditMode(true)} tipContent="Edit this field">
                <FaEdit className="text-primary-bchat"/>
            </GiveTipOfComponent>
        </>
    );

    const EditMode = () => (
        <>
            <input
             value={inputValue}
             onChange={e => setInputValue(e.target.value)}
             type="text"
             className={"outline-none w-[90%] border-b-[1px] pb-1 text-xs border-primary-bchat font-light"} autoFocus/>
            <GiveTipOfComponent onClick={commitChange} tipContent="Commit change.">
                <IoCheckmarkDone className="text-primary-bchat"/>
            </GiveTipOfComponent>
        </>
    );

    useEffect(
        () => {
            /** User interactive feature so that if user click outside the scope of component then turn off the edit mode */
            const listenFn = (e: MouseEvent) => {
                if (editMode && ref.current &&  !ref.current.contains(e.target as Node)){
                    setEditMode(false);
                };
            };

            if (editMode){
                document.addEventListener('click', listenFn);
            }

            const cleanUpFn = () => document.removeEventListener('click', listenFn)

            return cleanUpFn
        }, [editMode]
    )
   
    return (
        <div className=" flex gap-2 transition-all" ref={ref}>
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