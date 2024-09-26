/** Byimaan */

import { PayloadAction } from "@reduxjs/toolkit";
import { ChatUsersSliceState } from "./slice";

type PayloadBase = {
    userId: string
}

export const ChatUsersActions = {

    //Done
    removeChatUser(state: ChatUsersSliceState, action: PayloadAction<
        PayloadBase>){
            if(state.length){
                state = state.filter(user => user.userId !== action.payload.userId)
            }
    },
    //Done : Only apply if user already exist in state
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
    //Done: Only apply if user already exist in state
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
    //Done: If user already then that would be replaced otherwise new user would be added
    addChatUser(state: ChatUsersSliceState, action: PayloadAction<ChatUsersSliceState[number]>){
        const filteredState = state.filter(user => user.userId !== action.payload.userId);

        state = [
            ...filteredState,   
            action.payload
        ]
    },
    //Done 
    upsertSomeoneIsOnline(state: ChatUsersSliceState, action: PayloadAction<PayloadBase>){
        const newChatUserToUpsert: ChatUsersSliceState[number] = {
            userId: action.payload.userId,
            status: 'online'
        }
        if (!state.length){
            state.push( newChatUserToUpsert )
        } else {
            state = state.map(
                user => {
                    if (user.userId === action.payload.userId){
                        return {
                            ...user,
                            ...newChatUserToUpsert
                        }
                    };
                    return user
                }
            )
        }
    },
    //Done
    upsertSomeoneIsOffline(state: ChatUsersSliceState, action: PayloadAction<PayloadBase>){
        const newChatUserToUpsert : ChatUsersSliceState[number] = {
            userId: action.payload.userId,
            status: 'offline'
        };

        if (!state.length){
            state.push(newChatUserToUpsert)
        } else {
            state = state.map(
                user => {
                    if (user.userId === action.payload.userId){
                        return {
                            ...user, ...newChatUserToUpsert
                        }
                    }
                    return user
                }
            )
        }
    }
    
}