/**
 * Byimaan
 */

'use client'

import { cn } from '@/lib/utils';
import React, { useState, useRef } from 'react';

import AccountForm from './account-form';
import AccountField, {AccountFieldButton} from './account-field';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/redux/hooks';

import { EditIcon, SaveIcon } from 'lucide-react';

import { selectUserSlice } from '@/lib/redux/features/user/selectors';
import Infobar from '@/components/common/Infobar';
import { Button } from '@/components/ui/button';

import { useClickScopeEffect } from '@/utils/react-hooks/use-click-scope';

type Props = {
    className: string
    userId: string
};


function AccountFieldsSection({className, userId}: Props) {

  const {data, isLoading, gotError} = useAppSelector(selectUserSlice)
  const {email, firstName, lastName } = (data ?? {}) as NonNullable<typeof data>;

  const [editMode, setEditMode] = useState(false);

  const ref = useRef(null)

  let defaultValues = {
    password: '',
    rePassword: '',
    firstName: firstName || undefined ,
    lastName: lastName || undefined
  }

  if (data){
    defaultValues = {
      ...defaultValues,
      firstName: firstName || undefined,
      lastName: lastName || undefined
    }
  }

  const handleOnFocus = () => setEditMode(true);

  const submitFormAt = `/api/bchat/user/${userId}`;

  useClickScopeEffect({rootRef: ref, state: editMode, setState: setEditMode, dependencies: [editMode]})
   
  return (
    <div className={cn(className)} ref={ref}>
      <AccountForm defaultValues={defaultValues} className='w-full space-y-4 px-2' submitAtAPIEndpoint={submitFormAt}>
        {
          ({form, isSubmitting}) => (
            <>
              <p className='text-3xl font-semibold'>Edit your account info.</p>

              {
                gotError && <Infobar allowDefaultIcons error> Oops! Something went wrong </Infobar>
              }

              {/* Email field which is not editable */}
              <AccountField
                isLoading={isLoading}
              > 
                <Input 
                  className='bg-gray-200 text-black' value={email ?? 'abc@gmail.com' } disabled
                />
              </AccountField>

              {/* FirstName */}
              <AccountField 
                isLoading={isLoading}
                label={{
                  htmlFor: 'firstName',
                  value: 'First name'
                }}
                notification={form.formState.errors.firstName?.message}
              >
                <Input id='firstName' className={cn(!editMode && 'bg-gray-200')} defaultValue={defaultValues.firstName} onFocus={handleOnFocus} {...form.register('firstName')}/>
                </AccountField>

              <AccountField 
                isLoading={isLoading}
                notification={form.formState.errors.lastName?.message}
                label={{
                  htmlFor: 'lastName',
                  value: 'Last name'
                }}
                
              >
                <Input id='lastName' className={cn(!editMode && 'bg-gray-200')} defaultValue={defaultValues.lastName} onFocus={handleOnFocus} {...form.register('lastName')}/>
                </AccountField>

              <AccountField
                isLoading={isLoading}
                label={{
                  htmlFor: 'password',
                  value: 'Password'
                }}
                notification={form.formState.errors.password?.message}
              >
                <Input type='password' defaultValue={defaultValues.password} className={cn(!editMode && 'bg-gray-200')} onFocus={handleOnFocus} placeholder='Enter your new password' id='password' {...form.register('password')}/>

              </AccountField>

              {
                editMode && (
                  <AccountField
                    isLoading={isLoading}
                    label={{
                      htmlFor: 'rePassword',
                      value: 'Confirm password'
                    }}
                    notification={form.formState.errors.rePassword?.message}
                  >
                    <Input id='rePassword' className={cn(!editMode && 'bg-gray-200')} type='password' placeholder='Re-enter your password' {...form.register('rePassword')}/>
                    </AccountField>
                )
              }
              
              <AccountFieldButton isLoading={isLoading}>
                <Button type='submit' variant={'ghost'} className='flex items-center justify-center gap-2 w-full text-white bg-primary-bchat md:bg-gray-200 md:text-primary hover:bg-primary-bchat hover:text-white' disabled={isSubmitting}> 
                  {
                    !editMode ? (
                      <>
                      <EditIcon size={14}/>
                      <p>Edit account details</p>
                      </>
                    ) : (
                      <>
                        <SaveIcon size={14}/>
                        <p>Save changes</p>
                      </>
                    )
                  }
                </Button>
              </AccountFieldButton>
            </>
          )
        }
      </AccountForm>
    </div>
  )
}

export default AccountFieldsSection