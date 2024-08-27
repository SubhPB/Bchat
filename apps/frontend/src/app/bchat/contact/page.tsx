/**
 * Byimaan
 */

import React from 'react';
import { Workarea } from '../../../components/routes/bchat/layout/workarea';
import ContactAddForm from '@/components/routes/bchat/contact/AddForm';
import ViewCard from '@/components/routes/bchat/contact/view';
import { ContactSucceesReturnType } from '@/app/api/bchat/contact/route';

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
    <Workarea.main className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2'>
      <ContactAddForm className='w-full md:w-fit' />
      <div className="flex gap-2 flex-wrap">
        {
          Array.from('abcdefghijklmno').map(
            char => <ViewCard key={char} contact={contact}/>
          )
        }
      </div>
    </Workarea.main>
  )
}

export default page