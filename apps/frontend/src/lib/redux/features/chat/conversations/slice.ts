/**
 * Byimaan
 * 
 * Converstaions slice as holding conversation[] will also includes the sub slices of messages and paryicipents per conversation
 */

import { ConversationSuccessReturnType } from "@/app/api/bchat/conversation/route";
import { SharedSlice, SliceState } from "@/lib/redux/shared/custom-slice";
import { SlicePlugin } from "@/lib/redux/shared/plugin";
import { ConversationActions } from "./actions";
/**
 * Might need in future
 * import { SlicePlugin } from "@/lib/redux/shared/plugin";
 */

export type ExpectedConversationDataTypeFromAPI = ConversationSuccessReturnType['GET'];
export type ConversationSliceState = SliceState<ExpectedConversationDataTypeFromAPI>;

const sliceName = "redux/features/chat/conversations";

const slicePlugin = new SlicePlugin();
slicePlugin.actionsRecord.register<typeof ConversationActions>(ConversationActions);

export const sharedSlice = new SharedSlice<ExpectedConversationDataTypeFromAPI>(sliceName, slicePlugin);

export const ConversationSlice = sharedSlice.getSharedSlice();

export const ConversationReducer = ConversationSlice.reducer;   

export const conversationActions = ConversationSlice.actions