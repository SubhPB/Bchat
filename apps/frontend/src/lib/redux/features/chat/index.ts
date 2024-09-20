/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";
import { conversationsReducer } from "./conversations/slice";
import { ChatUsersReducer } from "./users/slice"; 

export const ChatReducer = combineReducers({
    conversations: conversationsReducer,
    users: ChatUsersReducer
});