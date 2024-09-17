/**
 * Byimaan
 * 
 * In the footer the main component we have is Input with internal functionalities
 */

'use client';

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";   

import { MdArrowOutward } from "react-icons/md";

type Props = {  
    className ?: string         
};

export function ChatInput({className} : Props){

    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Adjust height based on content
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; 
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
      }
    }, [text]); 
  
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };

    return (
            <div className={cn("flex justify-center items-end text-base bg-gray-200 rounded-xl w-fit", className)}>
                <textarea className="w pl-1 w-[280px] xs:w-[360px] md:w-[460px]  outline-none bg-transparent text-sm resize-none max-h-[220px] overflow-y-scroll scrollbar-none self-center " rows={1} placeholder="Type a message" ref={textareaRef} value={text} onChange={handleChange} />
                <button type="button" className="text-white bg-primary-bchat rounded-full flex justify-center items-center">
                    <MdArrowOutward className="m-2"/>
                </button>
            </div>
    )
}
