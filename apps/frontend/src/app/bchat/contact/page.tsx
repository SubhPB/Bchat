/**
 * Byimaan
 */


import React from 'react';
import { Workarea } from '../../../components/routes/bchat/layout/workarea';
import ContactAddForm from '@/components/routes/bchat/contact/AddForm';
import ViewCard from '@/components/routes/bchat/contact/view';
import { ContactSucceesReturnType } from '@/app/api/bchat/contact/route';

import { ContactBook } from '@/components/routes/bchat/contact';

const contact: ContactSucceesReturnType['GET'][number] = {
  id: 'id',
  name: 'Byimaan',
  createdAt: new Date(),
  isBlocked: false,
  contactId: 'contactId',
  userId: 'userId',
  contact: {
    id: 'user-id',
    name: 'byimaan',
    email: 'byimaanllkjfbsivebvsievbse1@gmail.com',
    emailVerified: true,
    image: null,
    firstName: null,
    lastName: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
}

function page() {

  return (
    <Workarea.main className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col'>
      <ContactAddForm className='w-full max-w-[790px] self-center' />
      <ContactBook className="flex gap-2 flex-wrap justify-center" />
    </Workarea.main>
  )
}

export default page