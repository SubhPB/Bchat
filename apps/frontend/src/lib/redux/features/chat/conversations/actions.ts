/** Byimaan */

import { PayloadAction } from "@reduxjs/toolkit";
import { sharedSlice } from "./slice";
import { SliceState } from "@/lib/redux/shared/custom-slice";
import { ExpectedConversationDataTypeFromAPI } from "./slice";
/*
    import { PayloadAction } from "@reduxjs/toolkit";
    import { SliceState } from "@/lib/redux/shared/custom-slice";
    import { ExpectedConversationDataTypeFromAPI } from "./slice";
*/

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;
const apiEndpoint = NEXT_PUBLIC_URL + '/api/bchat/conversation';

export function fetchConversations (endpoint=apiEndpoint){return sharedSlice.fetchSliceDataFromAPI(endpoint)};

/** More Conversation Actions will be added if needed */

type Payload = ExpectedConversationDataTypeFromAPI[number];
type ConversationActions<P> = (state: SliceState<ExpectedConversationDataTypeFromAPI>, action: PayloadAction<P>) => void

export const addConversation : ConversationActions<Payload> = (state, action) => {
    if (state.data){
        state.data = [...state.data, action.payload]
    } else {
        state.data = [action.payload]
    }
}

export const ConversationActions = { 
    addConversation
};