/**
 * Byimaan
 */
'use client';

import React, { useEffect, useRef, useImperativeHandle } from 'react';

import { htmlMimeTypes } from '@/constants/file-type';
import { cn } from '@/lib/utils';
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

// will be deprecated soon...
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
};

const FileInputFR = React.forwardRef<HTMLInputElement | null, Props>(
    function (props, ref){

        const {
            className,
            maxFileSizeInMB=Infinity,
            maxNoOfFiles=1,
            fileType,
            handleError,
            onChange,
            autoFocus,
            onBlur
        } = props;

        const isFirstRender = useRef(true);
        const localRef = useRef<HTMLInputElement | null>(null);


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
    
        /** This would allow the parent to use the localRef current 's values and methods */
        useImperativeHandle(
            ref as  React.RefObject<HTMLInputElement | null>,
            () => localRef.current, 
            [localRef.current]
        );
    
        useEffect(
            () => {   
                if (isFirstRender.current){
                    isFirstRender.current = false;
                    return
                }         
                if (localRef?.current && autoFocus){
                    localRef.current.click();
                };
            }, []
        )
    

        return (
            <Input
                ref={localRef} 
                onBlur={onBlur}
                accept={fileType}
                type='file'
                className={cn(className)}
                multiple={maxNoOfFiles > 1 ? true : false} onChange={handleChange}
            />
        )
    }
) ;

export default FileInputFR