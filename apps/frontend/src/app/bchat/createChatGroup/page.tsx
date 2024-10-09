/** Byimaan */
'use client'

import React from 'react';

import { ContactsSliceState } from '@/lib/redux/features/contacts/slice';
import { RenderPropHOC } from '@/components/render_props';
import { Workarea } from '@/components/routes/bchat/layout/workarea';

import InitData from '@/components/routes/bchat/createChatGroup';
import { FileContextProvider } from '@/providers/file';

import { GroupNameField, ParticipantsField } from '@/components/routes/bchat/createChatGroup/form/fields';
import GroupImage from '@/components/routes/bchat/createChatGroup/form/group-img';

import Infobar from '@/components/common/Infobar';
import ChatGroupForm from '@/components/routes/bchat/createChatGroup/form';
import { ContactsHandler } from '@/components/routes/bchat/contact/cards-handler';
import SelectCard,{SelectCardSkeleton} from '@/components/routes/bchat/createChatGroup/card';

export type SelectedContacts = NonNullable<ContactsSliceState['data']>;

/**
 * Components we may need:
 * 
 * [1] Provider to maintain the state that which users are been selected for group and this state will be accessible to all the components
 * 
 * [2] Init wrapper to initialize the contacts
 * [3] Form
 * [4] SearchBar to select contacts to be added in group chat
*/
             

function page() {
  
  const apiEndpointToSubmitForm = "/api/bchat/create-chat-group/not-available";

  return (
    <Workarea.main
        className='px-2 pt-2 app-scrollbar overflow-y-scroll space-y-2 flex flex-col items-center'
    >
            {/* 
              For the GroupImage this context will keep record of the actual file image 
              & set useByRenderProps to true to use it with renderProps pattern
             */}
            <FileContextProvider useByRenderProps={false}>

              <RenderPropHOC.ARRAY<SelectedContacts[number]>
                defaultState={[]}
                >
                {
                  ({
                    state: selected, 
                    setState: setSelection
                  }) => (
                    
                    <div className='w-full max-w-[790px]'>
                      <ChatGroupForm
                        submitAtAPIEndpoint={apiEndpointToSubmitForm}
                        selectedContacts={selected}
                        setSelectedContacts={setSelection}
                      >
                        {
                          (form) => (
                            <>
                              <GroupNameField 
                                form={form}
                                isLoading={form.formState.isSubmitting}
                                className='w-full'
                              />

                              <div className='grid grid-rows-[auto_auto]  grid-cols-[100%] lg:grid-cols-[300px_1fr] gap-1'>
                                <GroupImage form={form} className='w-full max-w-[300px] shrink-0'/>
                                <ParticipantsField
                                  className=' flex rounded-lg border-2 border-secondary-bchat flex-wrap gap-2 p-3 shrink-0'
                                  form={form}
                                  isLoading={form.formState.isSubmitting}
                                  selectedContacts={selected}
                                  setSelectedContacts={setSelection}
                                />
                              </div>
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

            </FileContextProvider>  

    </Workarea.main>
  )
}

export default page