/**
 * Byimaan
 * 
 * Converstaions slice as holding conversation[] will also includes the sub slices of messages and paryicipents per conversation
 */

import { SharedSlice, SliceState } from "@/lib/redux/shared/custom-slice";
import { SlicePlugin } from "@/lib/redux/shared/plugin";
/**
 * Might need in future
 * import { SlicePlugin } from "@/lib/redux/shared/plugin";
 */

type ExpectedConversationDataTypeFromAPI = unknown;

const sliceName = "redux/features/chat/conversations";

const slicePlugin = new SlicePlugin();
const sharedSlice = new SharedSlice<ExpectedConversationDataTypeFromAPI>(sliceName, slicePlugin);

export const ConversationSlice = sharedSlice.getSharedSlice();

export const ConversationReducer = ConversationSlice.reducer;   
