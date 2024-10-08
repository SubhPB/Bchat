/**
 * Byimaan
 * 
 * Basically we need to create a image container and few of buttons to cancel/edit image
 * --> Upon selection we would manually need to update the state of form with Aws's object keyName 
 */
'use client';

import React,{useRef} from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';
import {ChatGroupForm} from '..';

import { useFiles } from '@/providers/file';

import { Button } from '@/components/ui/button';
import FileInputFR from '@/components/common/file-input';
import { CustomImgAvatar as GroupImgAvatar } from '@/components/common/custom-img-avatar';

type Props = {
  form: ChatGroupForm;
  className ?: string;
}

/**
 * Things to do
 * --> Need FileContextProvider
 * --> Need FileInput
 * --> Would need buttons to edit/cancel
 */

function GroupImage({className, form}:Props) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const selectImage = () => {
      inputRef.current?.click();
    };

    const {files, setFiles} = useFiles();
    const handleCancel = () => {
      files.length && setFiles([]);
      form.setValue('image', false);
    };

    const handleImgError = (error: string) => {
      
      handleCancel();
      toast.error(error, {position: 'bottom-right'})
    };

    const handleImgChange = ([file]: File[]) => {
      if (file){
        // A valid state has been selected
        setFiles([ file ]);
        // should update the form if current state is false
        form.setValue('image', true);
      }
    };


    const selectedFile = files[0] ?? undefined;

    const defaultButtonClassName = 'rounded-lg w-full text-white text-semibold text-sm cursor-pointer mb-1';

    return (
        <div className={cn(className)}>
          <GroupImgAvatar 
            imgSrc={
              selectedFile ? URL.createObjectURL(selectedFile) : undefined
            }
            className='w-full aspect-square rounded-none mb-2 h-[265px] max-h-[76vw]' fallback='Select Group Image'             
          />

          {/* It is there but not be shown on UI */}
          <FileInputFR
            ref={inputRef}
            className='hidden'
            fileType='image/*'
            maxFileSizeInMB={5}
            maxNoOfFiles={1}
            onChange={handleImgChange}
            autoFocus={false /**OR !selectedFile */}
            handleError={handleImgError}
          />

          {/* <-- Button !--> */}
          {
            !!selectedFile ? (
              <>
                <Button key='change' type='button' className={cn(defaultButtonClassName, 'bg-zinc-700 hover:bg-primary-bchat')} onClick={selectImage}>
                  Change
                </Button>
                <Button key='cancel' type='button' variant='outline' className={cn(defaultButtonClassName, '')} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button key='upload' type='button' className={cn(defaultButtonClassName, '')} onClick={selectImage} variant='outline'>
                Upload Image
              </Button>
            )
          }

        </div>
    )
}

export default GroupImage