/** Byimaan */


import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/app/store";

import { ChatUsersSliceState } from "./slice";

export const selectChatSlice= (state: RootState) => state.chat ;

export const selectChatUsers =  createSelector(
    selectChatSlice,
    (state) => state.users
);

export const selectAllChatUsers = () => createSelector(
    selectChatUsers, state => state
)

export const selectChatUserByID = (id: string) => createSelector(
    selectChatUsers,
    (state) => state.find(user => user.userId === id)
);

export const selectChatUsersWhoAreOnline = () => createSelector(
    selectChatUsers,
    (state) => state.filter(user => user.status === "online")
);

export const selectIsChatUserOnline = (id: string) => createSelector(
    selectChatUsers,
    (state) => state.find(user => user.userId === id)?.status === "online"
);

