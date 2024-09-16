/** Byimaan */

import { PayloadAction } from "@reduxjs/toolkit";
import { ExpectedConversationDataTypeFromAPI } from "./slice";
import { ConversationsSliceState } from "./slice";

type AnConversationAction<Payload=any> = (state: ConversationsSliceState, action: PayloadAction<Payload>) => void

type ConversationActions = {
    [actionName : string] : AnConversationAction
};


export const ConversationsActions: ConversationActions = {
    /** First three are specfic to thunk calback */
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
    }
};

