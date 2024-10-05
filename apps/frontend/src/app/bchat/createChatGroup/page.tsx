/** Byimaan */
'use client'

import React from 'react';

import { ContactsSliceState } from '@/lib/redux/features/contacts/slice';
import { RenderPropHOC } from '@/components/render_props';
import { Workarea } from '@/components/routes/bchat/layout/workarea';

import InitData from '@/components/routes/bchat/createChatGroup';

import { GroupNameField, ParticipantsField } from '@/components/routes/bchat/createChatGroup/form/fields';

import Infobar from '@/components/common/Infobar';
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
                      selectedContacts={selected}
                    >
                      {
                        (form) => (
                          <>
                            <GroupNameField 
                              form={form}
                              isLoading={form.formState.isSubmitting}
                              className='w-full'
                            />
                            {
                                <ParticipantsField
                                  className='w-full flex rounded-lg border-2 border-secondary-bchat flex-wrap gap-2 p-3'
                                  form={form}
                                  isLoading={form.formState.isSubmitting}
                                  selectedContacts={selected}
                                  setSelectedContacts={setSelection}
                                />
                            }
                          </>
                        )
                      }
                    </ChatGroupForm>


                    {
                      // Inform the user that no user is selected
                      selected.length === 0 && (
                        <Infobar warning renderCloseButton className='transition-all'> Please Select at least one user to create group </Infobar>
                      )
                    }

                    <InitData>
                      {/* Remember InitData will handle the loading by itself */}
                      {
                        (data) => (
                          <ContactsHandler
                            contacts={data}
                            renderSearchbar
                            className={''}
                            ChildSkeleton={SelectCardSkeleton}
                          >
                            {
                              (filteredData) => (
                                <div className='columns-[220px] gap-1 space-y-2'>
                                  {
                                    filteredData.map(
                                      contact => {

                                        const isSelected = selected.some(
                                          s => s.contact.id === contact.contact.id
                                        );

                                        const onSelect = () =>{

                                          if (isSelected){
                                            setSelection(prev => prev.filter(c => c.contact.id !== contact.contact.id))
                                          } else {
                                            setSelection(prev => [...prev, contact])
                                          }
                                        }

                                        return(
                                          
                                              <SelectCard 
                                                className='break-inside-avoid'
                                                key={contact.id}
                                                contact={contact}
                                                isSelected={isSelected}
                                                onSelect={onSelect}
                                              />
                                        )
                                      }
                                    )
                                  }
                                </div>
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