/**
 * Byimaan
 */

'use client';

import React from 'react';
import z from "zod";
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import FieldNotify from '@/components/common/field-notify-box';
import { Client as ClientComponentFeature } from '@/utils/features/http/feature_type/response/client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Duration } from '@/utils/features/time/duration';

const formSchema = z.object({
    email: z.string().min(1, "* This field is required").email("* Incorrect email")
});

type formValues = z.infer<typeof formSchema>
  
type Props = {
    className ?: string,
}

function AddForm({className='w-full xs:w-[310px]'}: Props) {

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    const handleForm = async (values: formValues) => {
        const toastRef = toast.loading("Submiting...");
        await Duration.holdOn(6000);
        toast.dismiss(toastRef)
    };

    const loading = form.formState.isSubmitting;

    return (
    <Card className={cn(className)}>
        <CardHeader>
            <CardTitle>Add Contact</CardTitle>
            <CardDescription>Discover and chat with new people.</CardDescription>
        </CardHeader>
            <form onSubmit={form.handleSubmit(handleForm)} >
                <CardContent>
                        <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="add-contact">Email</Label>
                            <FieldNotify 
                                allowToRender={!!form.formState.errors.email}
                                children={form.formState.errors.email?.message}
                            />
                            <Input placeholder="User Email"  id="add-contact" {...form.register('email')}/>
                        </div>
                        </div>
                </CardContent>
                <CardFooter className="flex-row-reverse">
                    <Button type='submit' className='bg-primary-bchat' disabled={loading}>Save</Button>
                </CardFooter>
            </form>
    </Card>
    )
}

export default AddForm