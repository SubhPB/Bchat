/**
 * Byimaan
 * 
 * In the header we need two main components
 * 
 * 1. Left side (represents the conversation name and go back button)
 * 2. Right side (represents the chat options and settings etc)
 * 
 * ############### LEFT SIDE ###############
 * What are the props of this component and what are the expectation from this component?
 *    [1] Go back button
 *    [2.1] Avatar
 *    [2.2] Conversation name
 *    [2.3] A small div underneath the conversation name e.g for who is typing or someone is online
 * 
 * ############### RIGHT SIDE ###############
 * What are the props of this component and what are the expectation from this component?
 *    [1] Call functionality if we plan to add it in future
 *    [2] Some setting options
 * 
 * 
 */

import React from "react";
import { cn } from "@/lib/utils";
import { CustomImgAvatar } from "@/components/common/custom-img-avatar";

import { FaArrowLeft } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { captializeText } from "@/utils/features/typing/text";
import { useRouter } from "next/navigation";

type Props = {  
    className ?: string 
};

type ChatProfileProps = Props & {
    chatName : string;
    activityText : string;
    chatImgSrc : string | null;
};

const DEFAULT_FONT_SIZE = "text-2xl";

export function ChatProflile({className, chatName, activityText, chatImgSrc} : ChatProfileProps){
    
    const router = useRouter()

    const goBack = () => {
        router.back()
    };

    return (
        <aside className={cn("w-fit text-primary-bchat flex items-center", DEFAULT_FONT_SIZE, className)}>
            <FaArrowLeft className="cursor-pointer" onClick={goBack}/>     
            <CustomImgAvatar className="w-10 h-10 ml-3 mr-2" isAwsObject imgSrc={chatImgSrc ?? undefined} fallback={String(chatName).toUpperCase().slice(0, 2)}/>
            <div className="pt-3">
                <p className="font-bold text-[0.8em] truncate w-[14ch] md:w-[24ch]">{captializeText(chatName)}</p>
                <p className="text-[0.4em] text-secondary-foreground leading-[0] ">{activityText}</p>
            </div>
        </aside>
    );
};

export function ChatOptions({className} : Props){
    return (
        <aside className={cn("w-fit text-primary-bchat flex text-xl", className)}>
            <SlOptionsVertical  cursor={'pointer'}/>
        </aside>
    );
}