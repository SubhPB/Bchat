/**
 * Byimaan
 */

import { SharedSlice } from "../../shared/custom-slice";
import { ContactSucceesReturnType } from "@/app/api/bchat/contact/route";

type ExpectedContactsDataTypeFromAPI = ContactSucceesReturnType['GET']

const sliceName = "redux/features/contacts";

const sharedSlice = new SharedSlice< ExpectedContactsDataTypeFromAPI >(sliceName);

/** This will be used by ./actions.ts */
export const fetchContacts  = sharedSlice.fetchSliceDataFromAPI;

export const ContactsSlice = sharedSlice.getSharedSlice();

export const ContactsReducer = ContactsSlice.reducer;
