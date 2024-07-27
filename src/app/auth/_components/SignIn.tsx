// Byimaan

'use client';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import PasswordField from './PasswordField';

import OAuth from './OAuth';
import { signIn } from 'next-auth/react';
import { _console } from '@/utils/console';

const signInFormSchema= z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'This field is required'),
})

export type signInFormValues = z.infer<typeof signInFormSchema>


function SignIn() {
  
  const form = useForm<signInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });
  const [forgotPassword, setForgotPassword] = useState(false);
  
  const onSubmit = async (values: signInFormValues) => {
    forgotPassword && setForgotPassword(false)
    // first we will verify the user using '/api/user/verify'

    try {

      const res = await fetch("/api/user/verify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const data = await res.json()

      if (res.ok){
        await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: true,
          callbackUrl: "/bChat"
        });
        return
      } else {
        if (res.status === 409){
          setForgotPassword(true)
        };
        data?.feedback && toast.error(data.feedback)
      };

    } catch (error) {
      _console._log.doRed(error)
      toast.error("Oops! Something went wrong");
      return
    };
  };

  const handleForgotPassword = () => {
    alert("Are you sure to reset your password.")
  };



  return (
    <div className="w-full grid place-content-center my-2 py-8  rounded-lg bg-gray-100">
      <Form {...form}>
        <form className='w-[300px] md:w-[400px]' onSubmit={form.handleSubmit(onSubmit)}>
          {/* email */}
          <FormField
            control={form.control}
            name='email'
            render={
              ({field}) => (
                <FormItem>
                  <FormLabel className='text-black text-sm font-semibold'>Email</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                  <FormMessage  className="text-xs"/>
                </FormItem>
              )
            }
          >
          </FormField>
          {/* password */}
          <FormField
            control={form.control}
            name='password'
            render={
              ({field}) => (
                <FormItem>
                  <FormLabel className='text-black text-sm font-semibold'>Password</FormLabel>
                  <FormControl>
                    <PasswordField render={
                      (type) => (
                        <Input type={type} {...field}></Input>
                      )
                    }/>
                  </FormControl>
                  {
                    forgotPassword && (
                      <Button type='button' variant={'ghost'} className='w-full '><span onClick={handleForgotPassword} className='cursor-pointer hover:text-blue-500 hover:scale-105 transition-all hover:underline'>Forgot password?</span></Button>
                    )
                  }
                  <FormMessage  className="text-xs"/>
                </FormItem>
              )
            }
          >
          </FormField>

          <Button type='submit' className='w-full my-4 text-center'>Submit</Button>

          <OAuth/>
        </form>
      </Form>
    </div>
  )
}

export default SignIn