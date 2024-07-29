// Byimaan

'use client';

import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';

import { TimeFeatures } from '@/utils/time';

function DialogDemo() {

    const router = useRouter();

    const [tokenValue, setTokenValue] = useState('');
    const [inputError, setInputError] = useState<string | null>('');

    const setInputErr = (error: string, seconds ?: number) => {
        setInputError(error)

        if (seconds !== undefined && seconds > 0) {
            TimeFeatures.holdOn(seconds).then(
                _res => setInputError(null)
            );
        }
    }

    const handleSubmit = () => {
        if (tokenValue.length < 8){
            setInputErr("Please provide a valid token", 5 * 1000);
            return
        };
        router.push(`/auth/reset_password?token=${tokenValue}`)
    };

    const listenEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            handleSubmit()
        }
    }

    return (
    <Dialog open={true} defaultOpen={true} >
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle className='text-red-600'>Invalid Token</DialogTitle>
            {
                inputError && (
                    <div className="error-box opacity-100 bg-red-300 py-3 px-2 text-xs text-zinc-800 font-semibold mb-2 ">
                        {inputError}
                    </div>
                )
            }
            <DialogDescription>
                Oops! It looks like your given token to reset password is not valid. It either not exist or may have expired. If you do have a token please continue the remaining process from the sent email or paste your token down below.
            </DialogDescription>
        </DialogHeader>
        <div className="grid py-2">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right" >
                Token
            </Label>
            <Input id="name" onKeyDown={listenEnterKey} value={tokenValue} onChange={e => setTokenValue(e.target.value.trim())} className="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <Button  onClick={handleSubmit} type="submit">Save changes</Button>
        </DialogFooter> 
        </DialogContent>
    </Dialog>
    )
}


function TokenForm() {
  return (
    <DialogDemo/>
  )
}

export default TokenForm