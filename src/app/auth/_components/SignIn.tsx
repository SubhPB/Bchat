// Byimaan

'use client';

import React from 'react'
import { useForm } from 'react-hook-form';

import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";


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
  username: z.string().min(1, 'This field is required').max(50, 'Username is too lengthy'),
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'This field is required'),
})

export type signInFormValues = z.infer<typeof signInFormSchema>


function SignIn() {

  
  const form = useForm<signInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });
  
  const onSubmit = async (values: signInFormValues) => {

    try {
      const result = await signIn('credentials', {
        ...values,
        redirect: true,
        callbackUrl: '/bChat?msg=login+success',
      });
      if (result?.error){
        _console._log.doMagenta(result.error)
      }

    } catch (error:any) {
      _console._log.doCyan(error)
    }
  };

  return (
    <div className="w-full grid place-content-center my-2 py-8  rounded-lg bg-gray-100">
      <Form {...form}>
        <form className='w-[300px] md:w-[400px]' onSubmit={form.handleSubmit(onSubmit)}>
          {/* username */}
          <FormField
            control={form.control}
            name='username'
            render={
              ({field}) => (
                <FormItem>
                  <FormLabel className='text-black text-sm font-semibold'>Username</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                  <FormMessage  className="text-xs"/>
                </FormItem>
              )
            }
          >
          </FormField>
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