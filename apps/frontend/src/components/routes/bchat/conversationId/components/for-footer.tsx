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
    
    const {
      dispatchSendMessageToConversation,
      dispatchIamTypingInConversation,
      dispatchIHaveStoppedTypingInConversation
    } = useSocketEvents()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };

    const dispatchMessage = (contentType: HtmlAllMimeTypes=DEFAULT_CONTENT_TYPE) => {
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
        
        dispatchSendMessageToConversation({
          conversationId,
          message: messageToDispatch
        });
        setText('');
    };

    const handleImTyping = () => {
      dispatchIamTypingInConversation({
        conversationId,
        participantId: myParticipantId,
        userId: myUserId
      })
    };

    const handleImNoLongerTyping = () => {
      dispatchIHaveStoppedTypingInConversation({
        conversationId,
        participantId: myParticipantId,
        userId: myUserId
      })
    }

    // Adjust height based on content
    useEffect(() => {
      if (textareaRef.current) {
        /** If it was not set to `auto` then height will always stick to the previous height  */
        textareaRef.current.style.height = "auto"; 
        /** After setting to `auto` then height will be adjusted and have got the opportunity to update the scrollHeight.
         * Now this is time to fix its height back to the scrollHeight not no longer `auto`
         */
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
      }
    }, [text]); 
  

    return (
      <div className={cn("flex justify-center items-end text-base bg-gray-200 rounded-xl w-fit", className)}>
          <textarea 
            className="w pl-1 w-[280px] xs:w-[360px] md:w-[460px]  outline-none bg-transparent text-sm resize-none max-h-[220px] overflow-y-scroll scrollbar-none self-center "
            rows={1}
            placeholder="Type a message" 
            ref={textareaRef}
            value={text}
            onChange={handleChange}

            onFocus={handleImTyping}
            onBlur={handleImNoLongerTyping}
          />
          <button disabled={disable} onClick={() => dispatchMessage()} type="button" className="text-white bg-primary-bchat rounded-full flex justify-center items-center">
              <MdArrowOutward className="m-2"/>
          </button>
      </div>
    )
}
