/** 
 * Byimaan
 */

import { createSlice } from "@reduxjs/toolkit";
import { ConversationsActions } from "./actions";
import { ConversationSuccessReturnType } from "@/app/api/bchat/conversation/route";


export type ExpectedConversationDataTypeFromAPI = ({
    unreadMessages ?: number,
    usersWhoAreTyping ?: string[], 
    socketConnectionStatus ?: boolean
} & 
    ConversationSuccessReturnType['GET'][number]
)[];

export type ConversationsSliceState = {
    data: ExpectedConversationDataTypeFromAPI | null
    gotError: boolean
    isLoading: boolean
}

const sliceName = "redux/features/chat/conversations";

const initialConversationsState : ConversationsSliceState = {
    data: null,
    gotError: false,
    isLoading: true
}

const conversationsSlice = createSlice({
    name: sliceName,
    initialState: initialConversationsState,
    reducers: ConversationsActions
});

export const conversationsReducer = conversationsSlice.reducer;
export const {
    fetchingAPI,
    gotErrorResponseFromAPI, 
    gotSuccessResponseFromAPI,

    upsertConversation,
    addMessageToConversation,
    deleteMessageFromConversation,
    setConversationAsRead,
    incrementConversationUnreadMessages,

    setSocketConnectionStatusOfConversation,
    removeSomeoneWhoIsTyping,
    addSomeoneWhoIsTyping
} = conversationsSlice.actions