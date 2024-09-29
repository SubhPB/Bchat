/** Byimaan
 * 
 * There would be only messages that will be shown here in conversation body
 * 
 */

import React, { useEffect, useRef } from "react";
import { useSocketEvents } from "@/providers/io-socket/SocketProvider";

import { cn } from "@/lib/utils";

import { ExpectedConversationDataTypeFromAPI } from "@/lib/redux/features/chat/conversations/slice";
import { captializeText } from "@/utils/features/typing/text";

import { MdOutlineCrisisAlert } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md"
import toast from "react-hot-toast";
import { useClickScopeEffect } from "@/utils/react-hooks/use-click-scope";

type Props = {
    className ?: string,
    message: 
    ExpectedConversationDataTypeFromAPI[number]['messages'][number] & {
        createdAt ?: string | Date
    },
    alignRight ?: boolean,

    /** Leaving room if we decide to use it to show images or files. */
    children ?: React.ReactNode,
    writerName ?: string
};

const DEBUG = [48]
export type MessageProps = Props;

/**
 * 
 * What are the expectation from this component
 *     [1] Shows the sender name and time at the top
 *     [2] Shows the message itself
 *     [3] Ablity to set right or left by the parent
 *     [4] Message options like edit and delete
 */

const MAX_HEIGHT_OF_MESSAGE_CONTENT = 250;
const MAX_HEIGHT_OF_MESSAGE_CONTENT_IN_TW = 'max-h-[250px] overflow-y-hidden';


export function Message({className, message, alignRight, children, writerName} : Props){
    
    const [readMore, setReadMore] = React.useState(false);
    const [openPanel, setOpenPanel] = React.useState(false);

    const msgRef = useRef<HTMLDivElement>(null), msgPanelRef = useRef<HTMLDivElement>(null);

    let dayTime = '';
    if (typeof message.createdAt === 'string'){
         dayTime = new Date(message.createdAt).toLocaleDateString("en-US", {hour: 'numeric', minute: 'numeric', hour12: true}).split(", ")[0];
    } else if (message.createdAt instanceof Date){
        dayTime = message.createdAt.toLocaleDateString("en-US", {hour: 'numeric', minute: 'numeric', hour12: true}).split(", ")[0];
    };

    if (typeof writerName === 'string'){
        writerName = captializeText(writerName);
    };

    const togglePanel = () => {
        alignRight && setOpenPanel(!openPanel);
    };

    const openUpThePanel = ()=> {
        alignRight && !openPanel && setOpenPanel(true);
    }

    const handleReadMore = (e:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setReadMore(false);
    };

    /** 
     * One feature we need:-
     *  (*) if message s height exceeds than the limit then add the read more option at the bottom-right corner
     */

    useEffect(
        () => {
            if (msgRef.current && msgRef.current.offsetHeight > MAX_HEIGHT_OF_MESSAGE_CONTENT) {
                setReadMore(true);
            };
        }, []
    );
    
    return (
        <div 
            id={message.id} 
            className={
                cn('mesage-container w-full flex relative transition-all',
                    alignRight && 'flex-row-reverse',
                    className,
                    openPanel  && `mt-[2rem]`
                )
            }>

            {
                alignRight && openPanel && (
                    <MessagePanel 
                        ref={msgPanelRef}
                        togglePanel={togglePanel}
                        message={message}   
                        className="w-fit pt-2 px-2 pb-1 rounded-t-md absolute right-0 bottom-full bg-white flex flex-row-reverse gap-2 z-[20]"
                    />
                )
            }

            <div
                className={
                    cn("w-fit min-w-[30%] md:min-w-[20%] max-w-[80%] md:max-w-[75%] p-2 pb-4 text-sm space-y-2 bg-gray-200 rounded-md text-secondary-foreground", alignRight && 'text-right'
                    )
                }
                onClick={openUpThePanel}
                >
                {/* Header */}
                <div className="flex flex-row-reverse items-center justify-between gap-2 ">
                    <p className="text-[0.6em] ">{dayTime}</p>
                    {
                        writerName && !alignRight && <p className="max-w-[14ch] md:max-w-[20ch] truncate font-semibold text-primary-bchat ">{writerName}</p>
                    }
                </div>

                {/* Message */}
                <div className={cn("relative", readMore && MAX_HEIGHT_OF_MESSAGE_CONTENT_IN_TW)} ref={msgRef}>

                    {
                        children
                    }

                    <p className="min-h-3 text-xs break-words whitespace-pre-wrap">
                        {message.text}
                    </p>

                    {
                        readMore && (
                            <div
                                onClick={handleReadMore}
                                className="absolute w-fit bottom-[-.1rem] right-0 z-[5] text-xs text-primary-bchat cursor-pointer backdrop-blur bg-gray-200"
                            >
                                <p className="pl-2 leading-3"> more...</p>
                            </div>
                        )
                    }
                </div>


            </div>
        </div>
    )
};
type Panel = {
    togglePanel : () => void;
    message: Props['message'];
    className ?: string
}

const MessagePanel = React.forwardRef<HTMLDivElement, Panel>(

    function (
        {className, message, togglePanel},
        ref
    ){

        useClickScopeEffect({
            rootRef: ref,
            state: true,
            setState: togglePanel,
            dependencies: []
        })

        return (
            <div ref={ref} className={cn(className)}>
                {
                    PanelOptions.map(
                        (PanelOption, index) => (
                            <PanelOption
                                key={index}
                                className="cursor-pointer font-semibold text-sm"
                                message={message}
                                togglePanel={togglePanel}
                            />
                        )
                    )
                }
            </div>
        )
    }
)




const PanelOptions = [

    function DeleteOption({message, className, togglePanel}: Panel){

        const {dispatchDeleteMessageFromConversation} = useSocketEvents();

        const handleDelete = () => {
            toast.loading("Deleting message...", {
                duration:2000
            });
            /** 
             * Process request
             */
            dispatchDeleteMessageFromConversation({
                conversationId: message.conversationId,
                message: message
            })
            togglePanel();
        }
        return (
            <MdOutlineDeleteOutline onClick={handleDelete} className={cn("text-red-500", className)}/>
        );
    },

    function EditOption({message, className, togglePanel}: Panel){
        const handleEdit = () => {
            toast.loading("This option is not available yet", {
                duration: 2000
            });
            /** 
             * Process request
             */
            togglePanel();
        }
        return (
            <MdOutlineCrisisAlert onClick={handleEdit} className={cn("text-primary-bchat", className)}/>
        );
    }
]
