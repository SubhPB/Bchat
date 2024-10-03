/** Byimaan */
'use client'

import React from 'react';

import { ContactsSliceState } from '@/lib/redux/features/contacts/slice';
import { RenderPropHOC } from '@/components/render_props';
import { Workarea } from '@/components/routes/bchat/layout/workarea';

import InitData from '@/components/routes/bchat/createChatGroup';

import { GroupNameField, ParticipantsField } from '@/components/routes/bchat/createChatGroup/form/fields';

import ChatGroupForm from '@/components/routes/bchat/createChatGroup/form';
import { ContactsHandler } from '@/components/routes/bchat/contact/cards-handler';
import SelectCard,{SelectCardSkeleton} from '@/components/routes/bchat/createChatGroup/card';

export type SelectedContacts = NonNullable<ContactsSliceState['data']>;


function page() {
  
  const apiEndpointToSubmitForm = "/api/bchat/create-chat-group/not-available";

  return (
    <Workarea.main
        className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'
    >
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
             
            }

            <RenderPropHOC.ARRAY<SelectedContacts[number]>
              defaultState={[]}>
              {
                ({
                  state: selected, 
                  setState: setSelection
                }) => (
                  
                  <div className='w-full max-w-[790px]'>
                    <ChatGroupForm
                      submitAtAPIEndpoint={apiEndpointToSubmitForm}
                    >
                      {
                        (form) => (
                          <>
                            <GroupNameField 
                              form={form}
                              isLoading={form.formState.isSubmitting}
                              className=''
                            />
                            <ParticipantsField
                            className=''
                            form={form}
                            isLoading={form.formState.isSubmitting}
                            selectedContacts={selected}
                            setSelectedContacts={setSelection}
                            />
                          </>
                        )
                      }
                    </ChatGroupForm>

                    <InitData>
                      {/* Remember InitData will handle the loading by itself */}
                      {
                        (data) => (
                          <ContactsHandler
                            contacts={data}
                            renderSearchbar
                            className='columns-[300px] '
                            ChildSkeleton={SelectCardSkeleton}
                          >
                            {
                              (filteredData) => (
                                filteredData.map(
                                  contact => {

                                    const isSelected = selected.some(
                                      s => s.contact.id === contact.contact.id
                                    );

                                    const onSelect = () =>{
                                      !isSelected && setSelection(prev => [...prev, contact])
                                    }

                                    return(
                                      <SelectCard 
                                        key={contact.id}
                                        contact={contact}
                                        isSelected={isSelected}
                                        onSelect={onSelect}
                                      />
                                    )
                                  }
                                )
                              )
                            }
                          </ContactsHandler>
                        )
                      }
                    </InitData>
                  </div>
                )
              }
            </RenderPropHOC.ARRAY>  
    </Workarea.main>
  )
}

export default page