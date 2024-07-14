// Byimaan
'use client';

import React from 'react'

import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';

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
import OAuth from './OAuth';
import { signUpAction } from '@/server/actions/auth';
import { useRouter } from 'next/navigation';
import { _console } from '@/utils/console';
import PasswordField from './PasswordField';
import FileInput from '@/components/specific/form/file-uploader';


const signUpFormSchema= z.object({
  username: z.string().min(4, 'Username is required and should be atleast of 4 characters').max(50, 'Username is too lengthy'),
  email: z.string().email('Email is required'),
  password: z.string().min(6, 'Password is too short.').regex(/^(?!\s*$).+$/, {
    message: "Field cannot be empty or contain only spaces",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export type signUpFormValues = z.infer<typeof signUpFormSchema>

function Signup() {

  const router = useRouter()
  const form = useForm<signUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  });

  const password = form.watch('password');
  const [verifyPassword, setVerifyPassword] = React.useState<string>('');
  
  const onSubmit = async (values: signUpFormValues) => {
    if (verifyPassword !== password){
      return
    }
    await signUpAction({values}).then(
      user => router.push(`/auth?type=signin&msg=Account+created+need+signin`)
    )
  };

  return (
    <div className="w-full grid place-content-center my-2 py-8 bg-gray-100 rounded-lg">
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
                  <FormMessage className="text-xs"/>
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
                  <FormMessage className="text-xs"/>
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
              ({field}) => 
              {
                return  (
                  <FormItem>
                    <FormLabel className='text-black text-sm font-semibold'>Password</FormLabel>
                    <FormControl>
                      <PasswordField field={field}/>
                    </FormControl>
                    <FormMessage className="text-xs"/>
                  </FormItem>
                )
              }
              
            }
          >
          </FormField>
          {/* confirmPassword */}
            <FormItem>
              <FormLabel className='text-black text-sm font-semibold'>Confirm Password</FormLabel>
              <FormControl>
                {
                  <PasswordField render={
                    (type) => (

                      <Input type={type} onChange={(e) => setVerifyPassword(e.target.value)} value={verifyPassword}></Input>
                    )
                  }/>
                }
              </FormControl>
              {
                verifyPassword && verifyPassword !== password && <FormMessage className='text-xs'>Field does not match with the password</FormMessage>
              }
              
            </FormItem>

          {/* firstName */}
          <FormField
            control={form.control}
            name='firstName'
            render={
              ({field}) => (
                <FormItem>
                  <FormLabel className='text-black text-sm font-semibold'>First name</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )
            }
          >
          </FormField>
          {/* lastName */}
          <FormField
            control={form.control}
            name='lastName'
            render={
              ({field}) => (
                <FormItem>
                  <FormLabel className='text-black text-sm font-semibold'>Last name</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )
            }
          >
          </FormField>

          <FormItem>
            <FileInput/>
          </FormItem>

          <Button type='submit' className='w-full my-4 text-center'>Submit</Button>

          <OAuth/>
        </form>
      </Form>
    </div>
  )
}

export default Signup