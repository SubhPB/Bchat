/** Byimaan */

/** 
 * make seperate selectors for :-
 *  1. conversation
 *  2. participants
 *  3. messages 
 *  4. ...
 */

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/app/store";
import { ConversationsSliceState } from "./slice";

export const selectConversationsSlice = (state: RootState) => state.chat.conversations as ConversationsSliceState

export const selectConversations = () => createSelector(selectConversationsSlice, (state) => state.data)

export const selectConversationById = (id:string) => createSelector(selectConversationsSlice, (state) => state.data?.find(conversation => conversation.id === id))