/**
 * Byimaan
 * 
 * Some slice's state depends on the api fetched data. 
 * So the following custom slice class can be used to create those slices without repeating the code.
 */

import { CaseReducerActions, createSlice, PayloadAction, Reducer, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { AppThunk } from "../app/store";

import { SlicePlugin } from "./plugin";

interface SliceState<T> {
    data: T | null;
    gotError: boolean;
    isLoading: boolean;
};

const initialSliceState : SliceState<null> = {
    data: null, gotError: false, isLoading: true
};


/** Here generic <DT> represents that what is the value of data is expected after a success api call. */
class SharedSlice <DT> {

    private sliceName : string;
    private slice : Slice;
    private actions : CaseReducerActions< SliceCaseReducers< SliceState<DT | null> >, string >;
    private reducer : Reducer< SliceState<DT | null> >;

    private static createSlice<T>(sliceName: string, plugIn :SlicePlugin){

        const ourSharedSlice: Slice = createSlice({
            name: sliceName,
            initialState: initialSliceState,
            reducers: {
                fetchingAPI(state){
                    state.data = null; state.gotError = false; state.isLoading = true
                },
                gotErrorResponseFromAPI(state){
                    state.data = null; state.gotError = true, state.isLoading = false;
                },
                gotSuccessResponseFromAPI(state: SliceState<T>, action: PayloadAction<T>){
                    state.data = action.payload; state.gotError = false; state.isLoading = false;
                },
                /** register custom actions if exist */
                ...plugIn.actionsRecord.actions
            }
        });

        return ourSharedSlice;
    };
    
    constructor (sliceName: string, plugIn = new SlicePlugin()){
        this.sliceName = sliceName;
        this.slice = SharedSlice.createSlice<DT>(this.sliceName, plugIn);
        this.actions = this.slice.actions;
        this.reducer = this.slice.reducer;
    };

    getSharedSlice(){
        return this.slice;
    };

    fetchSliceDataFromAPI(apiEndpoint: string): AppThunk {

        const {fetchingAPI, gotErrorResponseFromAPI, gotSuccessResponseFromAPI } = this.actions;

        return async function thunkCallbackFn(dispatch) {

            dispatch(  fetchingAPI( /**No arg value needed */ undefined ) );

            const response = await fetch(apiEndpoint);
            const {data} = await response.json();

            
            if (response.ok){
                if (data === undefined){
                    console.log(`[Dev-Error] | Redux-Thunk-Callback. Need to fix Api endpoint ${apiEndpoint}. this endpoint was expected to return data object but got undefined.`)
                    dispatch(gotErrorResponseFromAPI(undefined))
                } else {
                    dispatch( gotSuccessResponseFromAPI(data as DT) )
                };
            } else {
                dispatch( gotErrorResponseFromAPI( /**No arg value needed */ undefined ) )
            }

        }
    }
};

export {SharedSlice};
export type {SliceState};