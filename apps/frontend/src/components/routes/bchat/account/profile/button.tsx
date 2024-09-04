/**
 * Byimaan
 */

import { EditIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { UploadIcon } from "lucide-react";

type Props = {
    children: React.ReactNode;
    LucideIcon ?: typeof EditIcon;
    className ?: string;
    onClick ?: () => void
}

function ProfileButton ({children, LucideIcon, className, onClick=()=>{}}:Props) {
    return (
        <Button 
            onClick={onClick}
            variant={'ghost'} 
            className={cn('flex items-center justify-center gap-2 w-full text-white bg-primary-bchat md:bg-gray-200 md:text-primary hover:bg-primary-bchat hover:text-white', className)}>
            {LucideIcon && <LucideIcon size={14}/>}
            <p>{children}</p>
        </Button>
    )
};

type ProfileButtonsTS = {
    [key : string]: (args: Props) => JSX.Element;
}

const ProfileButtons: ProfileButtonsTS = {
    Edit : ({children, LucideIcon=EditIcon, className='', onClick}:Props) => (
        <ProfileButton LucideIcon={LucideIcon} className={className} onClick={onClick}>
            {children}
        </ProfileButton>
    ),
    UploadImage: ({children, LucideIcon=UploadIcon, className='', onClick}:Props) => (
        <ProfileButton LucideIcon={LucideIcon} className={className} onClick={onClick}>
            {children}
        </ProfileButton>
    ),
    DiscardChanges: ({children, LucideIcon=XIcon, className='', onClick}:Props) => (
        <ProfileButton LucideIcon={LucideIcon} className={className} onClick={onClick}>
            {children}
        </ProfileButton>
    ),
};

export {ProfileButtons};