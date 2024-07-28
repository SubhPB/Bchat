// Byimaan

'use client';

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
    dialog ?: {
        open : boolean,
        defaultOpen: boolean
    },
    trigger ?: {
        text: string,
    },
    content: {
        header: {
            title: string,
            description: string
        },
        footer: {
            cancel: {
                onClick: () => void,
                text: string,
            },
            action: {
                onClick: () => void,
                text: string
            }
        }
    }
};

const defaultProps = {
    dialog: {
        open: false,
        defaultOpen: false,
    },
    content: {
        header: {
            title: "Are you absolutely sure?",
            description: `This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers`
        }
    }

}
  
function AlertDialogComponent(props: Props) {

    const {dialog=defaultProps.dialog, trigger, content:{header, footer}} = props;

    return (

        <AlertDialog open={dialog.open} defaultOpen={dialog.defaultOpen}>

            {trigger && <AlertDialogTrigger> {trigger.text} </AlertDialogTrigger>}

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{header.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {header.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={footer.cancel.onClick}>{footer.cancel.text}</AlertDialogCancel>
                    <AlertDialogAction onClick={footer.action.onClick}>{footer.action.text}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
  
  export default AlertDialogComponent
