/**
 * Byimaan
 * 
 * Converstaions slice as holding conversation[] will also includes the sub slices of messages and paryicipents per conversation
 */

import { ConversationSuccessReturnType } from "@/app/api/bchat/conversation/route";
import { SharedSlice, SliceState } from "@/lib/redux/shared/custom-slice";

import { ConversationActions } from "./actions";
import { SlicePlugin } from "@/lib/redux/shared/plugin";
/**
 * Might need in future
 * import { SlicePlugin } from "@/lib/redux/shared/plugin";
 */

export type ExpectedConversationDataTypeFromAPI = ConversationSuccessReturnType['GET'];
export type ConversationSliceState = SliceState<ExpectedConversationDataTypeFromAPI>;

const sliceName = "redux/features/chat/conversations";

let _sharedSlice;

try {
    const slicePlugin = new SlicePlugin();
    slicePlugin.actionsRecord.register<typeof ConversationActions>(ConversationActions);
    _sharedSlice = new SharedSlice<ExpectedConversationDataTypeFromAPI>(sliceName, new SlicePlugin());
} catch {{
    _sharedSlice = new SharedSlice<ExpectedConversationDataTypeFromAPI>(sliceName);
}}


export const sharedSlice = _sharedSlice;

export const ConversationSlice = sharedSlice.getSharedSlice();

export const ConversationReducer = ConversationSlice.reducer;   

export const {addConversation} = ConversationSlice.actions