/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";

import { ContactsReducer } from "../features/contacts/slice";
import { UserReducer } from "../features/user/slice";

export const rootReducer = combineReducers({
    /** contacts tells what are the other users are saved by the user in his/her contact book */
    contacts: ContactsReducer,
    user: UserReducer,
});