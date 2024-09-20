/** Byimaan */

import { PayloadAction } from "@reduxjs/toolkit";
import { ChatUsersSliceState } from "./slice";
import { set } from "react-hook-form";

type PayloadBase = {
    userId: string
}

export const ChatUsersActions = {

    removeChatUser(state: ChatUsersSliceState, action: PayloadAction<
        PayloadBase>){
            if(state.length){
                state = state.filter(user => user.userId !== action.payload.userId)
            }
    },

    setChatUserToOnline(state: ChatUsersSliceState, action: PayloadAction<PayloadBase>){
        state = state.map(user => {
            if (user.userId === action.payload.userId){
                return {
                    ...user,
                    status: "online"
                }
            }
            return user
        })
    },

    setChatUserToOffline(state: ChatUsersSliceState, action: PayloadAction<PayloadBase>){
        state = state.map(user => {
            if (user.userId === action.payload.userId){
                return {
                    ...user,
                    status: "offline"
                }
            }
            return user
        })
    },

    addChatUser(state: ChatUsersSliceState, action: PayloadAction<ChatUsersSliceState[number]>){
        const filteredState = state.filter(user => user.userId !== action.payload.userId);

        state = [
            ...filteredState,   
            action.payload
        ]
    },
    
}