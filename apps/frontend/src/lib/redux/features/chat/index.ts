/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";
import { ConversationReducer } from "./conversations/slice";

export const ChatReducer = combineReducers({
    conversations: ConversationReducer
});