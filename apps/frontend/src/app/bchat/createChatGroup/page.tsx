/** Byimaan */


import React from 'react';

import { ContactsSliceState } from '@/lib/redux/features/contacts/slice';
import { RenderPropHOC } from '@/components/render_props';
import { Workarea } from '@/components/routes/bchat/layout/workarea';

export type SelectedContacts = NonNullable<ContactsSliceState['data']>
function page() {
  return (
    <Workarea.main
        className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'
    >
        <div className='w-full max-w-[790px]'>
            {
                /**
                 * Components we may need:
                 * 
                 * [1] Provider to maintain the state that which users are been selected for group and this state will be accessible to all the components
                 * 
                 * [2] Init wrapper to initialize the contacts
                 * [3] Form
                 * [4] SearchBar to select contacts to be added in group chat
                 */
              <RenderPropHOC.ARRAY<SelectedContacts> defaultState={[]}>
                {
                  ({
                      state: selected, 
                      setState: setSelection
                  }) => (
                    <div>

                    </div>
                  )
                }
              </RenderPropHOC.ARRAY>  
            }
        </div>
    </Workarea.main>
  )
}

export default page