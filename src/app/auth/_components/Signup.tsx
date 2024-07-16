// Byimaan
'use client';

import React from 'react'

import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
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
import OAuth from './OAuth';
import { signUpAction } from '@/server/actions/auth';
import { useRouter } from 'next/navigation';
import { _console } from '@/utils/console';
import PasswordField from './PasswordField';
import FileInput from '@/components/specific/form/file-uploader';
import { useFiles } from '@/contexts/FileContext';
import { signIn } from 'next-auth/react';

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
  const {files, setFiles} = useFiles();

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

    // this condition is important to check before calling api because we are manually handling confirm password not with zod.
    if (verifyPassword !== password){
      return
    };

    let imageMetaData: undefined | {
      contentType: string,
      imageName: string
    };

    if (files && files.length === 1 && files[0].type.startsWith('image/')){
      imageMetaData = {
        contentType: files[0].type,
        imageName: files[0].name,
      }
    }

    await signUpAction({values, imageMetaData}).then(
      async (data) => {
        // here user's accunt has been created without profile image.
        const {user, uploadMetaData} = data;

        await signIn('credentials', {
          ...values,
          redirect: false
        });

        if (uploadMetaData?.signedUrl && uploadMetaData?.key){
          const {signedUrl, key} = uploadMetaData
          // Now our task is to upload the image to AWS S3 using signedUrl.
          try {

            const uploadToS3Response = await fetch(signedUrl, {
                method: 'PUT',
                body: files[0],
                headers: {
                  'Content-Type': files[0].type
                }
            });


            if (!uploadToS3Response.ok){
              throw new Error('Failed to upload profile image to S3')
            } else {
              // Now here we know image has been uploaded to S3
              // Our next task is to update user model 
              await fetch(`/api/user/${user.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  image: key
                })
              })
            };

          } catch (error) {
            // we failed to upload image even we had signedUrl
            _console._log.doRed('Failed to upload profile image');
            if (error instanceof Error){
              _console._log.doYellow(error.message)
            };
            // this assignment will trigger the toast error in the future to notify user
            imageMetaData = undefined
          }
        };


        toast.success("Your account has been created.");

        if (imageMetaData && !uploadMetaData?.signedUrl){
          // this means something went wrong there on the server side to get the signed url.
          // So it is our job to inform the user about failure of uploading profile image
          toast.error("Something went wrong to upload your profile image.")
        };


        router.push(`/?status=authenticated&from=signup`);
        form.reset();

      }
    ).catch(
      err => {
        if (err.message){
          toast.error(err.message, {
            position: 'top-center'
          })
        };
      }
    )
  };

  return (
    <div className="w-full grid place-content-center my-8 bg-gray-100 rounded-lg">
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
            <FileInput fileType='image/*' maxFileSizeInMb={3.5} maxNoOfFiles={2} whatToUploadTitle='Drag and drop your profile picture(optional) here.'/>
          </FormItem>

          <Button type='submit' className='w-full my-4 text-center'>Submit</Button>

          <OAuth/>
        </form>
      </Form>
    </div>
  )
}

export default Signup