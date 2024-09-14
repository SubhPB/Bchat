/**
 * Byimaan
 */

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/app/store";
import { ConversationSliceState } from "./slice";

export const selectConversationsSlice = (state: RootState) => state.chat.conversations as ConversationSliceState;

export const selectConversations = () => createSelector(selectConversationsSlice, (state) => state.data)

export const selectConversationById = (id:string) => createSelector(selectConversationsSlice, (state) => state.data?.filter(conversation => conversation.id === id))
