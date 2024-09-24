/**
 * Byimaan
 * 
 * In the footer the main component we have is Input with internal functionalities
 * 
 * [1] So when user press enter it will send the message using socket event dispatcher
 */

'use client';

import React, { useState, useRef, useEffect } from "react";
import {v4 as uuidV4} from 'uuid';
import { cn } from "@/lib/utils";   
import { MdArrowOutward } from "react-icons/md";

import { HtmlAllMimeTypes } from "@/constants/file-type";
import { Message } from "@repo/db";
import { useSocketEvents } from "@/providers/io-socket/SocketProvider";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

const DEFAULT_CONTENT_TYPE: HtmlAllMimeTypes = "text/plain"

type Props = {  
    className ?: string;
    myParticipantId: string;  
    myUserId: string;
    conversationId: string;  
};

export type ChatInputProps = Props

export function ChatInput({className, myParticipantId, myUserId, conversationId} : Props){

    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const disable = text.trim().length === 0;
    
    const {dispatchSendMessageToConversation} = useSocketEvents()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };

    const dispatchMessage = (contentType: HtmlAllMimeTypes=DEFAULT_CONTENT_TYPE) => {
        const toastMsg = toast.loading("Sending message ...")
        const messageToDispatch : Message = {
          id: uuidV4(),
          conversationId,
          senderUserId: myUserId,
          participantId: myParticipantId,
          text,
          createdAt: new Date(),
          url: null,
          contentType,
        };

        
        setTimeout(() => {
          toast.dismiss(toastMsg);
        }, 1000);
        
        dispatchSendMessageToConversation({
          conversationId,
          message: messageToDispatch
        });
        setText('');
    };

    // Adjust height based on content
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; 
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
      }
    }, [text]); 
  

    return (
      <div className={cn("flex justify-center items-end text-base bg-gray-200 rounded-xl w-fit", className)}>
          <textarea className="w pl-1 w-[280px] xs:w-[360px] md:w-[460px]  outline-none bg-transparent text-sm resize-none max-h-[220px] overflow-y-scroll scrollbar-none self-center " rows={1} placeholder="Type a message" ref={textareaRef} value={text} onChange={handleChange} />
          <button disabled={disable} onClick={() => dispatchMessage()} type="button" className="text-white bg-primary-bchat rounded-full flex justify-center items-center">
              <MdArrowOutward className="m-2"/>
          </button>
      </div>
    )
}
