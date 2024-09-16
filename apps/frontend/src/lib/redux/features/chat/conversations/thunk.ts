/** Byimaan */

import { ConversationsActions } from "./actions";
import { AppThunk } from "@/lib/redux/app/store";
import { ExpectedConversationDataTypeFromAPI } from "./slice";
import { fetchingAPI, gotErrorResponseFromAPI, gotSuccessResponseFromAPI } from "./slice"; 
/** Thunk Action */

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;
const API_ENDPOINT_TO_FETCH_CONVERSATIONS = NEXT_PUBLIC_URL + '/api/bchat/conversation';


export const fetchConversations = (endpoint=API_ENDPOINT_TO_FETCH_CONVERSATIONS):AppThunk => {

    return async (dispatch) => {

        dispatch(  fetchingAPI( /**No arg value needed */ undefined ) );

        const response = await fetch(endpoint);
        const {data} = await response.json();
        
        if (response.ok){
            if (data === undefined){
                console.log(`[Dev-Error] | Redux-Thunk-Callback. Need to fix Api endpoint ${endpoint}. this endpoint was expected to return data object but got undefined.`)
                dispatch(gotErrorResponseFromAPI(undefined))
            } else {
                dispatch( gotSuccessResponseFromAPI(data as ExpectedConversationDataTypeFromAPI) )
            };
        } else {
            dispatch( gotErrorResponseFromAPI( /**No arg value needed */ undefined ) )
        }
    }
}