/**
 * Byimaan
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
    className ?: string;
    type: "button" | "submit" | "reset";
    disable ?: boolean
}

export const CreateChatGroupButtons = {

    className: "",

    Cancel: ({className, type, disable=false}:Props) => {
        const commonClassName = CreateChatGroupButtons.className;

        return (
            <Button disabled={disable} className={cn(commonClassName, className)} variant={"outline"} type={type}>
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

    render: ({className, buttonCommonClassName=''}: Pick<Props, "className"> & {
        buttonCommonClassName ?: string
    }) => {
        CreateChatGroupButtons.className = buttonCommonClassName
        return (
            <div className={cn(className)}>
                <CreateChatGroupButtons.Cancel type="reset"/>
                <CreateChatGroupButtons.Create type="submit"/>
            </div>
        )
    }
}