/**
 * Byimaan
 */
'use client';

import React, {useState} from 'react';

import { EditIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { UploadIcon } from "lucide-react";

import { Client as ClientResFeatures } from "@/utils/features/http/feature_type/response/client";
import { generatePUTPreSignedUrlForProfileImgUpload } from "@/app/bchat/account/actions/aws";

import { useAppDispatch } from "@/lib/redux/hooks";
import { updateUserField } from "@/lib/redux/features/user/slice";

import toast from "react-hot-toast";

type Props = {
    children: React.ReactNode;
    LucideIcon ?: typeof EditIcon;
    className ?: string;
    onClick ?: () => void;
    disabled ?: boolean;
}

function ProfileButton ({children, LucideIcon, className, onClick=()=>{}, disabled}:Props) {
    return (
        <Button 
            onClick={onClick}
            variant={'ghost'} 
            className={cn('flex items-center justify-center gap-2 w-full text-white bg-primary-bchat md:bg-gray-200 md:text-primary hover:bg-primary-bchat hover:text-white', className)}
            disabled={disabled}
        >
            {LucideIcon && <LucideIcon size={14}/>}
            <p>{children}</p>
        </Button>
    )
};

type UploadImgButtonProps = {
   file ?: File; 
   userId ?: string;
   afterUploadSuccessOrError ?: () => void;
} & Props

type ProfileButtonsTS = {
    [key : string]: (args: Props) => JSX.Element;
    'UploadImage': (args: UploadImgButtonProps) => JSX.Element;
}


const ProfileButtons: ProfileButtonsTS = {
    Edit : (props:Props) => (
        <ProfileButton {...{...props, LucideIcon:EditIcon}}/>
    ),
    DiscardChanges: (props:Props) => (
        <ProfileButton {...{...props, LucideIcon:XIcon}}/>
    ),
    UploadImage: (props:UploadImgButtonProps) => {

        /**Steps :-
         * 1) Get image which has been passed as 'file' prop
         * 2) Get pre_signed_url to put it in S3
         * 3) then upload it to S3
         * 4) then update the database
         * 5) at last update the user data in redux slice
          */

        const [isUploading, setIsUploading] = useState(false);
        const appDispatch = useAppDispatch();

        const handleUpload = async () => {
            
            
            try {
                const {file, userId} = props;
                if (!file || !userId) return;
    
                setIsUploading(true);
                
                const {signedUrl, keyName} = await generatePUTPreSignedUrlForProfileImgUpload({contentType: file.type, userId});
            
                const res = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file ,
                    headers: {
                        "Content-Type": file.type
                    },
                });

                if (res.ok) {
                    /** after uploading image we need to update the database */
                    await handleDBAndReduxUpadate(keyName);

                } else {
                    toast.error("Oops! Something went wrong while uploading image.");
                }
            } catch (error){
                if (error instanceof Error) {
                    console.log(error.message);
                };
                toast.error("Oops! Something went wrong while uploading image. Please try again later.");
            } finally {
                props.afterUploadSuccessOrError && props.afterUploadSuccessOrError();
                setIsUploading(false);
            }
            ;
                
        };
        
        const handleDBAndReduxUpadate = async(keyName:string) => {
            if (!props.userId) return;

            const res = await fetch(`/api/bchat/user/${props.userId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image: keyName
                })
            });

            const payload = await res.json();

            if (res.ok) {
                const {data} = payload;
                if (data?.image) {
                    appDispatch(updateUserField({
                        key: 'image',
                        value: data.image
                    }));
                }
                toast.success("Profile image updated successfully");
            } else {
                if (payload?.userFriendlyData && payload.userFriendlyData?.toast){
                    const customToast = ClientResFeatures.useToast(payload.userFriendlyData.toast);
                    customToast();
                } else {
                    toast.error("Oops! Something went wrong while updating profile image.");
                }
            }
        }
        

        return (
            <ProfileButton {...props} LucideIcon={UploadIcon} disabled={!props.file || isUploading} onClick={handleUpload}/>
        )
    }

};

export {ProfileButtons};