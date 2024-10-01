/**
 * Byimaan
*/

import { Input } from "@/components/ui/input";
import FormField from "../../account/account-fields/account-field";
import {ChatGroupForm} from ".";
import { SelectedContacts } from "@/app/bchat/createChatGroup/page";
import { X } from "lucide-react";
type Props = {
    form: ChatGroupForm;
    className ?: string;
    isLoading: boolean
}

export function GroupNameField({form, className, isLoading}: Props){


    return (
        <FormField 
            isLoading={isLoading} 
            label={
                {
                    htmlFor: 'groupName',
                    value: 'Group Name'
                }
            }
            notification={form.formState.errors.name?.message}
        >
            <Input id='groupName' {...form.register('name')} className={className}/>
        </FormField>
    )
};

type ParticipantsFieldProps = Props & {
    selectedContacts: SelectedContacts,
    setSelectedContacts: React.Dispatch<React.SetStateAction<SelectedContacts>>
}

type ParticipantBoxProps = {
    data: string;
    className ?: string;
    onCancel: (userId: string) => void;
    userId: string
}

function ParticipantBox(
    {data, onCancel, className, userId}: ParticipantBoxProps
){

    return (
        <span className={className}>
            <p>{data}</p>
            <X className="cursor-pointer" onClick={() => onCancel(userId)}/>
        </span>
    )
}

export function ParticipantsField({
    form, 
    className, 
    selectedContacts, 
    setSelectedContacts,
    isLoading
}: ParticipantsFieldProps){


    const onCancel = (userId: string) => {
        /** Un select the contact */
    };

    return (
        <FormField
         notification={form.formState.errors.userIdOfParticipants?.message}
         isLoading={isLoading}
         >
            <div className={className}>
                {
                    selectedContacts.map(
                        selectedContact => (
                            <ParticipantBox 
                                key={selectedContact.contactId}
                                userId={selectedContact.contact.id}
                                data={
                                    selectedContact.contact?.name ?? selectedContact.contact?.name 
                                }
                                onCancel={onCancel}
                            />
                        )
                    )
                }
            </div>
        </FormField>
    )
}