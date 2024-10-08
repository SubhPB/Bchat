/**
 * Byimaan
 */

'use client';

import React from "react";
import { useFiles } from "@/providers/file";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { SelectedContacts } from "@/app/bchat/createChatGroup/page";

type Props = {
    className ?: string;
    type: "button" | "submit" | "reset";
    disable ?: boolean
}

type CancelProps = Props & {
    setSelection : React.Dispatch<React.SetStateAction<SelectedContacts>>
}

export const CreateChatGroupButtons = {

    className: "",

    Cancel: ({className, type, disable=false, setSelection}: CancelProps) => {
        const commonClassName = CreateChatGroupButtons.className;

        const {files, setFiles} = useFiles();

        const handleClick = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            /** Upon cancel we need to unselect everybody */
            setSelection([]);
            if (type==='reset'){
                e.currentTarget.form?.reset();
                /** If any image was selected, we need to remove it */
                files.length && setFiles([]);
            }
        }

        return (
            <Button disabled={disable} className={cn(commonClassName, className)} onClick={handleClick} variant={"outline"} type={type}>
                Cancel
            </Button>
        )

    },

    Create: ({className, type, disable=false}:Props) => {

        const commonClassName = CreateChatGroupButtons.className;

        return (
            <Button disabled={disable} type={type} className={cn(commonClassName, className)}>
                Create 
            </Button>
        )
    },
}