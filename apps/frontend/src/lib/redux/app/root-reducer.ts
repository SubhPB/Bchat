/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";
import { ContactsReducer } from "../features/contacts/slice";

export const rootReducer = combineReducers({
    /** contacts tells what are the other users are saved by the user in his/her contact book */
    contacts: ContactsReducer,
    /** 
     * more reducers in the future ...
     */
});