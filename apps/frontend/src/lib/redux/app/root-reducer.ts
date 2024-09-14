/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";

import { ContactsReducer } from "../features/contacts/slice";
import { UserReducer } from "../features/user/slice";
import { ChatReducer } from "../features/chat"

export const rootReducer = combineReducers({
    /** contacts tells what are the other users are saved by the user in his/her contact book */
    contacts: ContactsReducer,
    user: UserReducer,
    chat: ChatReducer
});