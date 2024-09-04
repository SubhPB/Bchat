/**
 * Byimaan
 * 
 * Goals of this component :-
 * 
 *  1) Represent username and sign out button
 *  2) Profile picture wit a option to change it
 */

'use client'

import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import React, { useRef } from 'react';

import ProfileNavbar from './navbar';
import { captializeText } from '@/utils/features/typing/text';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectUserSlice } from '@/lib/redux/features/user/selectors';

import { Skeleton } from '@/components/ui/skeleton';
import StateMode from './edit/state-mode';

import { CustomImgAvatar as ProfileImgAvatar } from '@/components/common/custom-img-avatar';
import { ProfileButtons } from './button';

import { Input } from '@/components/ui/input';
import { FileContextProvider } from '@/providers/file';
import FileInput from '@/components/common/file-input';

type Props = {
    className: string
}

function Profile({className}:Props) {

  const {data, gotError, isLoading} = useAppSelector(selectUserSlice);

  if (!data){

    if (gotError){
      toast.error("Oops! Failed to fetch profile details")
    }

    const MySkeleton = ({className=''}: Partial<Props>) => <Skeleton className={cn('bg-gray-300 rounded-md h-8', className)}/>

    return (
      <div className={cn(className, 'space-y-3')}>
        <div className="nav-skelton flex justify-between items-center py-1">
          <MySkeleton className='w-[60%]'/>
          <MySkeleton className='w-[30%]'/>
        </div>
        <div className='space-y-2'>
          <MySkeleton className='w-full h-[340px]'/>
          <MySkeleton />
        </div>
      </div>
    )
  };

  return (
    <div className={cn(className)}>
      <ProfileNavbar className='flex justify-between items-center border-b-[.8px] py-2 border-zinc-600' username={captializeText(data.name)}/>
      {/* <ProfileImage className='my-2 space-y-2' imgSrc={data.image || undefined}/> */}
      <StateMode>
        {
          ({editMode, setEditMode, uploadImage}) => (
            <div className='my-2 space-y-2'>
              {
                !editMode ? (
                  /**
                   * When editmode is not activate
                   */
                  <>
                    <ProfileImgAvatar className='w-full h-[340px] rounded-none' fallback={(data.name.toUpperCase()).slice(0,2)} imgSrc={data.image || undefined}/>
                    <ProfileButtons.Edit onClick={() => setEditMode(true)}>
                      Edit image
                    </ProfileButtons.Edit>  
                  </>
                ) : (
                  /**
                   * When user want to edit profile Image means editMode is true
                   */
                  <FileContextProvider useByRenderProps>
                    {
                      ({files, setFiles}) => (
                        <>
                          <ProfileImgAvatar className='w-full h-[340px] rounded-none' fallback='Select image' imgSrc={files[0] ? URL.createObjectURL(files[0]) : undefined}/>
                          <FileInput
                            className='hidden'
                            fileType='image/*'
                            onChange={(files) => files[0] && setFiles([files[0]])}
                            maxNoOfFiles={1} maxFileSizeInMB={6}
                            autoFocus={!files[0]}
                            onBlur={() => alert("Closing...")}
                            handleError={(error)=>{
                              toast.error(error, {position: 'bottom-right'});
                              setEditMode(false)
                            }}
                          />
                          <ProfileButtons.DiscardChanges onClick={() => setEditMode(false)}>
                            Discard changes
                          </ProfileButtons.DiscardChanges>
                          <ProfileButtons.UploadImage onClick={uploadImage}>
                            Save Changes
                          </ProfileButtons.UploadImage>
                        </>
                      )
                    }
                  </FileContextProvider>
                )
              }
            </div>
          )
        }
      </StateMode>
    </div>
  )
};



export default Profile