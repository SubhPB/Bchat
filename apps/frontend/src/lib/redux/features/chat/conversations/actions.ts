/** Byimaan */

import { PayloadAction } from "@reduxjs/toolkit";
import { ExpectedConversationDataTypeFromAPI } from "./slice";
import { ConversationsSliceState } from "./slice";

import { ConversationBaseProps, HandleMessageProps, UserTypingProps } from "@/providers/io-socket/types";
import { set } from "react-hook-form";

type AnConversationAction<Payload=any> = (state: ConversationsSliceState, action: PayloadAction<Payload>) => void

type ConversationActions = {
    [actionName : string] : AnConversationAction
};


export const ConversationsActions: ConversationActions = {
    /** First three are specific to thunk callback */
    fetchingAPI(state){
        state.data = null; state.gotError = false; state.isLoading = true
    },
    gotErrorResponseFromAPI(state){
        state.data = null; state.gotError = true, state.isLoading = false;
    },
    gotSuccessResponseFromAPI(state : ConversationsSliceState, action: PayloadAction<ExpectedConversationDataTypeFromAPI>){
        state.data = action.payload; state.gotError = false; state.isLoading = false;
    },

    /**
     * Actions to be used if we have valid data state
    */

    upsertConversation(state: ConversationsSliceState, action: PayloadAction<ExpectedConversationDataTypeFromAPI[number]>){
        if (state.data && state.data.length){ 
            /** let 's see if it already exists */
            const filteredConversations = state.data.filter((conversation) => conversation.id !== action.payload.id);
            state.data = [
                action.payload,
                ...filteredConversations,
            ]
        } else [
            state.data = [
                action.payload
            ]
        ]
    },

    
    setConversationAsRead(state: ConversationsSliceState, action: PayloadAction<ConversationBaseProps>){

        if (state.data){
            state.data = state.data.map((conversation) => {
                if (conversation.id === action.payload.conversationId){
                    return {
                        ...conversation,
                        unreadMessages: 0
                    }
                }
                return conversation
            })
        }
    },
    
    /** The following action might be called after YOU_HAVE_JOINED_CONVERSATION */
    setSocketConnectionStatusOfConversation(state: ConversationsSliceState, action: PayloadAction<ConversationBaseProps & {socketConnectionStatus: boolean}>){
        if (state.data){
            state.data = state.data.map((conversation) => {
                if (conversation.id === action.payload.conversationId){
                    return {
                        ...conversation,
                        socketConnectionStatus: action.payload.socketConnectionStatus
                    }
                }
                return conversation
            })
        }
    },


    addSomeoneWhoIsTyping(state: ConversationsSliceState, action: PayloadAction<UserTypingProps>){
        
        const {conversationId, userId} = action.payload

        if (state.data){
            state.data = state.data.map((conversation) => {
                if (conversation.id === conversationId){
                    return {
                        ...conversation,
                        usersWhoAreTyping: conversation?.usersWhoAreTyping ? [
                            ...conversation.usersWhoAreTyping.filter(
                                id => id !== userId
                            ),
                            userId
                        ] : [
                            userId
                        ]
                    }
                }
                return conversation
            })
        }
    },

    removeSomeoneWhoIsTyping(state: ConversationsSliceState, action: PayloadAction<UserTypingProps>){
        const {conversationId, userId} = action.payload
        if (state.data){
            state.data = state.data.map((conversation) => {
                if (conversation.id === conversationId){
                    return {
                        ...conversation,
                        usersWhoAreTyping: conversation?.usersWhoAreTyping ? conversation.usersWhoAreTyping.filter(
                            id => id !== userId
                        ) : []
                    }
                }
                return conversation
            })
        }
    },

    /** For Messages */

    addMessageToConversation(state: ConversationsSliceState, action: PayloadAction<HandleMessageProps>){

        if (state.data){

            //@ts-ignore
            const deletedBy = action.payload.message?.deletedBy ?? [];

            state.data = state.data.map((conversation) => {
                if (conversation.id === action.payload.conversationId){
                    return {
                        ...conversation,
                        messages: [
                            ...conversation.messages,
                            action.payload.message,
                            deletedBy,
                        ]
                    }
                }
                return conversation
            })
        }
    },


    deleteMessageFromConversation(state: ConversationsSliceState, action: PayloadAction<HandleMessageProps>){

        const deletedMessage = action.payload.message;
        const conversationId = action.payload?.conversationId ?? deletedMessage?.conversationId;

        if (state.data){
            state.data = state.data.map((conversation) => {
                if (conversation.id === conversationId){
                    return {
                        ...conversation,
                        messages: conversation.messages.filter(
                            message => message.id !== deletedMessage.id
                        )
                    }
                }
                return conversation
            })
        }
    },

};

