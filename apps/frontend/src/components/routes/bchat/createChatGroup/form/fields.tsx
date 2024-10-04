/**
 * Byimaan
*/

import { Input } from "@/components/ui/input";
import FormField from "../../account/account-fields/account-field";
import {ChatGroupForm} from ".";
import { SelectedContacts } from "@/app/bchat/createChatGroup/page";
import { X } from "lucide-react";
import { generateRandomColor } from "@/utils/features/general";
type Props = {
    form: ChatGroupForm;
    className ?: string;
    isLoading: boolean
}


export function GroupNameField({form, isLoading, className=''}: Props){


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
            className={className}
        >
            <Input id='groupName' {...form.register('name')}/>
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
    userId: string;
    allowRandomBgColor: boolean
}

function ParticipantBox(
    {data, onCancel, className, userId, allowRandomBgColor}: ParticipantBoxProps
){

    return (
        <span
            className={className}
            style={{
                backgroundColor: allowRandomBgColor ? generateRandomColor() : undefined
            }}>
            <p>{data}</p>
            <X className="cursor-pointer text-white" onClick={() => onCancel(userId)}/>
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

    /** There are 2 options to update form 
     * either we update from this component whenever the selectedContacts change
     * else we update right after the selection of contact card
     * We will see...
     */

    const onCancel = (userId: string) => {
        /** Un select the contact */
        setSelectedContacts(
            selectedContacts.filter(
                selectedContact => selectedContact.contact.id !== userId
            )
        )
    };

    return (
        <FormField
         notification={form.formState.errors.userIdOfParticipants?.message}
         isLoading={isLoading} className={className}
         >
            {
                selectedContacts.map(
                    selectedContact => (
                        <ParticipantBox 
                            key={selectedContact.contactId}
                            userId={selectedContact.contact.id}
                            className="p-2 rounded-lg text-white text-sm flex gap-2  items-center"
                            data={
                                selectedContact.contact?.name ?? selectedContact.contact?.name 
                            }
                            onCancel={onCancel}
                            allowRandomBgColor
                        />
                    )
                )
            }
        </FormField>
    )
};

