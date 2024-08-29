/**
 * Byimaan
 */

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ContactsSlice, ContactsSliceState } from "./slice";


export const selectContactsSlice = (state: RootState) => state.contacts as ContactsSliceState;

export const selectContactById = (id:string) => createSelector(selectContactsSlice, (state) => state.data?.filter(contact => contact.id === id));

export const selectContacts = () => createSelector(selectContactsSlice, (state) => state.data);

