/**
 * Byimaan
 */

import { SharedSlice, SliceState } from "../../shared/custom-slice";
import { SlicePlugin } from "../../shared/plugin";

import { ContactSucceesReturnType } from "@/app/api/bchat/contact/route";

import { ContactActions } from "./actions";

export type ExpectedContactsDataTypeFromAPI = ContactSucceesReturnType['GET'];
export type ContactsSliceState = SliceState<ExpectedContactsDataTypeFromAPI>

const sliceName = "redux/features/contacts";

/**Let's configure Sliceplugin because we have some custom contact actions to be added along with buildin actions of SharedSlice  */
const slicePlugin = new SlicePlugin();
slicePlugin.actionsRecord.register<typeof ContactActions>(ContactActions);

/**now init the sharedSlice with the plugged in actions */
export const sharedSlice = new SharedSlice< ExpectedContactsDataTypeFromAPI >(sliceName, slicePlugin);

/** This will be used by ./actions.ts */
export const fetchContactsAction  = sharedSlice.fetchSliceDataFromAPI;

export const ContactsSlice = sharedSlice.getSharedSlice();

export const ContactsReducer = ContactsSlice.reducer;

export const {deleteContact, upsertContact, /**The remaining actions are only needed by thunk callback*/} = ContactsSlice.actions
