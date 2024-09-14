/** Byimaan */

import { sharedSlice } from "./slice";

/*
    import { PayloadAction } from "@reduxjs/toolkit";
    import { SliceState } from "@/lib/redux/shared/custom-slice";
    import { ExpectedConversationDataTypeFromAPI } from "./slice";
*/

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;
const apiEndpoint = NEXT_PUBLIC_URL + '/api/bchat/conversation';

export function fetchConversations (endpoint=apiEndpoint){return sharedSlice.fetchSliceDataFromAPI(endpoint)};

/** More Conversation Actions will be added if needed */

export const ConversationActions = { };