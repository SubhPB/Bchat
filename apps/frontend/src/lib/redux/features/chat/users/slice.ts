/** Byimaan */

import { createSlice } from "@reduxjs/toolkit";
import { ChatUsersActions } from "./actions";

type ChatUser = {
    status: "online" | "offline";
    userId: string;
};

export type ChatUsersSliceState = ChatUser[]

const sliceName = "redux/features/chat/users",
    initialState : ChatUsersSliceState = [];

export const chatUsersSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: ChatUsersActions
});

export const ChatUsersReducer = chatUsersSlice.reducer;
export const { 
    removeChatUser,
    addChatUser,
    setChatUserToOnline,
    setChatUserToOffline
} = chatUsersSlice.actions;