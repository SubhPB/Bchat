// Byimaan

import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import clsx from 'clsx';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';


type FieldProps = {
    field ?: ControllerRenderProps<any>,
    hidePasswordAsDefaultState ?: boolean,
    render ?: (type : string, setState: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode
}

function PasswordField({field, hidePasswordAsDefaultState=true, render}: FieldProps){

    const [hidePassword, setHidePassword] = useState(hidePasswordAsDefaultState);

    const type = hidePassword ? 'password' : 'text';

    return (
    <div className="flex items-center">
        {
            render ? render(type, setHidePassword) : (
                field && <Input {...field} type={type}></Input>
            )
        }
        <div className="px-4">
            {
                hidePassword 
                ? 
                <FaEyeSlash onClick={() => setHidePassword(false)} className={clsx('cursor-pointer')}/>
                :
                <FaEye onClick={() => setHidePassword(true)} className={clsx('cursor-pointer')}/>
            }
        </div>
      </div>
    )

}

export default PasswordField