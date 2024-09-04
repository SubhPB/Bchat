/**
 * Byimaan
 */
'use client';

import { htmlMimeTypes } from '@/constants/file-type';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { FileValidator } from '@/utils/features/validation/file';


type Props = {
    fileType: typeof htmlMimeTypes[number]['mimeTypes'][number];
    maxNoOfFiles ?: number;
    maxFileSizeInMB ?: number;
    className: string;
    handleError ?: (error: string) => void;
    onChange : (files:File[]) => void;
    onBlur ?: () => void;
    autoFocus ?: boolean
}

function FileInput({fileType, maxFileSizeInMB=Infinity, className, maxNoOfFiles=1, handleError, onChange, onBlur, autoFocus}:Props) {
    
    const inputRef = useRef<HTMLInputElement>(null);

    const isFirstRender = useRef(true)

    const fileInspector = new FileValidator({
        expectedSizeInBytes: maxFileSizeInMB * (1024**2),
        expectedType: fileType
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files:File[] = Array.from(e.target.files || []);

        if (files.length > maxNoOfFiles){
            toast.error(`You can't select more than ${maxNoOfFiles} files.`)
            return;
        };

        const filteredFiles = files.filter(
            file => {
                try {
                    fileInspector.compareOrThrow(file);
                    return true;
                } catch (error) {
                    if (error instanceof Error){
                        handleError ? handleError(error.message) : toast.error(error.message)
                    }
                    return false
                }
            }
        );
        onChange(filteredFiles)     
    };


    useEffect(
        () => {   
            if (isFirstRender.current){
                isFirstRender.current = false;
                return
            }         
            if (inputRef?.current && autoFocus){
                inputRef.current.click()
            };
        }, []
    )

    return (
    <Input ref={inputRef} onBlur={onBlur} accept={fileType} type='file' className={cn(className)} multiple={maxNoOfFiles > 1 ? true : false} onChange={handleChange}/>
    )
}

export default FileInput