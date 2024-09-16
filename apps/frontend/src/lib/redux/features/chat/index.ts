/**
 * Byimaan
 */

import { combineReducers } from "@reduxjs/toolkit";
import { conversationsReducer } from "./conversations/slice";

export const ChatReducer = combineReducers({
    conversations: conversationsReducer
});