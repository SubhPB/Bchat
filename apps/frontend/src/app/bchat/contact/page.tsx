/**
 * Byimaan
 */
'use client';

import React from 'react';
import { Workarea } from '../../../components/routes/bchat/layout/workarea';
import ContactAddForm from '@/components/routes/bchat/contact/AddForm';

function page() {

  return (
    <Workarea.main className='px-2 pt-2'>
      <ContactAddForm/>
    </Workarea.main>
  )
}

export default page