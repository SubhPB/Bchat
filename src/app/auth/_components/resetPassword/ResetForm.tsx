// Byimaan
'use client';

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation';
import { ResetPasswordToken } from '@prisma/client';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


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
import PasswordField from '../PasswordField';

type Props = {
  tokenDetails : ResetPasswordToken
}

/**
 * 
 * Goals :-
 *    1. Offer new password option with confirmation
 *    2. Upon submission make an api call to regster password change in database.
 *    3. Link user to "/bChat" after success
 */

const formSchema = z.object({
  password: z.string().min(6, 'Password is too short.').regex(/^(?!\s*$).+$/, {
    message: "Field cannot be empty or contain only spaces",
  }),
  confirmPassword: z.string(),
});

export type resetPasswordFormValues = z.infer<typeof formSchema>

function ResetForm({tokenDetails}: Props) {

  const router = useRouter();
 
  const submitButtonRef = useRef<null | HTMLButtonElement>(null);

  const form = useForm<resetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = async (values: resetPasswordFormValues) => {
    if (values.password !== values.confirmPassword){
      form.setError("confirmPassword", {
        type: "manual",
        message: "Password do not match"
      }, {shouldFocus: true})
    } else {
      alert("Submitting the reset password request")
    }
  };

  const listenEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter'){
          submitButtonRef?.current && submitButtonRef.current.click()
      }
  };

  console.log('Error ', form.formState.errors.confirmPassword?.message)

  return (
    <Dialog open={true} defaultOpen={true} >
        <DialogContent className="sm:max-w-[425px]">

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>
              <DialogTitle className='text-cyan-600'>Reset password</DialogTitle>

              <DialogDescription>
                  Almost there. Please fill the following form to change your password.
              </DialogDescription>
          </DialogHeader>

          <div className="py-2">
              <Label htmlFor="password" className="text-left mb-2" >
                  Password
              </Label>
              {
                form.formState.errors.password && (
                  <div className="error-box opacity-100 bg-red-300 py-3 px-2 text-xs text-zinc-800 font-semibold mb-2 ">
                        {form.formState.errors.password.message}
                  </div> 
                )
              }
              <div className="grid items-center gap-4">
              <Input id="password" onKeyDown={listenEnterKey} className="col-span-3" {...form.register('password')}/>
              </div>
          </div>

          <div className="pb-2">
              <Label htmlFor="confirm-password" className="text-left mb-2" >
                  Confirm Password
              </Label>
              {
                form.formState.errors.confirmPassword && (
                  <div className="error-box opacity-100 bg-red-300 py-3 px-2 text-xs text-zinc-800 font-semibold mb-2 ">
                        {form.formState.errors.confirmPassword.message}
                  </div> 
                )
              }
              <div className="grid items-center gap-4">
                <PasswordField 
                  render={
                    (type) => (
                      <Input id="confirm-password" type={type} onKeyDown={listenEnterKey} className="col-span-3" {...form.register("confirmPassword")}/>
                    )
                  }
                  />
              </div>
          </div>

          <DialogFooter>
              <Button ref={submitButtonRef} type="submit" className='bg-cyan-600'>Save changes</Button>
          </DialogFooter> 
        </form>

        </DialogContent>
    </Dialog>
  )
}

export default ResetForm