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
    setChatUserToOffline,

    /** These two status upsert actions can handle following events:
     * [1] SOMEONE_IS_ONLINE [2] SOMEONE_IS_OFFLINE
     * [3] YOUR_REQUESTED_USER_IS_ONLINE [4] YOUR_REQUESTED_USER_IS_OFFLINE
     */
    upsertSomeoneIsOffline,
    upsertSomeoneIsOnline
} = chatUsersSlice.actions;