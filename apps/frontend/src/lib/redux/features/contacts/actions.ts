/**
 * Byimaan
 */

import { PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "../../shared/custom-slice";
import { sharedSlice } from "./slice";
import { ExpectedContactsDataTypeFromAPI } from "./slice";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;
const apiEndpoint = NEXT_PUBLIC_URL + '/api/bchat/contact'

export function fetchContacts (endpoint=apiEndpoint){return sharedSlice.fetchSliceDataFromAPI(endpoint)};

type Payload = ExpectedContactsDataTypeFromAPI[number];

type ContactActions<P> = (state: SliceState<ExpectedContactsDataTypeFromAPI>, action: PayloadAction<P>) => void

type DeleteContactPayload = Pick<Payload, 'id'>;
const deleteContact: ContactActions<DeleteContactPayload> = (state, action) => {
    if (state?.data) {
        state.data = state.data.filter(
            contact => contact.id !== action.payload.id
        )
    } else {
        console.log("[ Redux-Invalid-Action-Invoke | Contact<'deleteContact'> ] Can't perform delete operation unless state is provided ")
    }
};

/** Update or insert new contact with this single action */
type UpsertContactPayload = ExpectedContactsDataTypeFromAPI[number]
const upsertContact: ContactActions<UpsertContactPayload> = (state, action) => {

    if (!state?.data) {
        /** If this going to be the first contact put in array then */
        state.data = [ action.payload ]
    } else {
        state.data = [
            /** new contact will be updated or either inserted by action.payload */
            action.payload,
            /** if user intends to update existing contact then filer will delete the old data of that contact */
            ... state.data.filter(contact => contact.id !== action.payload.id),
        ]
    }
    
};

export const ContactActions = {
    upsertContact,
    deleteContact
}