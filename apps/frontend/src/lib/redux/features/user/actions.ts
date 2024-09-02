/**
 * Byimaan
 */

import { PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "../../shared/custom-slice";
import { sharedSlice } from "./slice";
import { ExpectedUserDataTypeFromAPI } from "./slice";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;
const apiEndpoint = NEXT_PUBLIC_URL + '/api/bchat/user';

export function fetchUserData (userId: string){
    return sharedSlice.fetchSliceDataFromAPI(apiEndpoint + '/' + userId)
};

type Payload = ExpectedUserDataTypeFromAPI;
type UserActions<P> = (state: SliceState<Payload>, action: PayloadAction<P>) => void;

type UpdateUserFieldPayload = {
    key: keyof Pick<Payload, 'name' | 'image' | 'firstName' | 'lastName'>,
    value: string
};

const updateUserField : UserActions<UpdateUserFieldPayload> = (state, action) => {
    if (state?.data){
        const {key, value} = action.payload;
        state.data = {
            ...state.data,
            [key]: value
        }
    } else {
        console.log("[ Redux-Invalid-Action-Invoke | User<'updateUserField'> ] Can't perform update operation unless state is provided ")
    }
};

const setUserData: UserActions<Payload> = (state, action) => {
    state.data = action.payload;
};

export const UserActions = { updateUserField, setUserData };