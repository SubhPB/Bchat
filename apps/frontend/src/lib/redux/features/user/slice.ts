
/**
 * Byimaan
 * 
 * it will be used to stay up-to-date with the data of user who owns this account
 */

import { SharedSlice, SliceState } from "../../shared/custom-slice";
import { SlicePlugin } from "../../shared/plugin";

import { UserSuccessReturnType } from "@/app/api/bchat/user/[id]/route";

import { UserActions } from "./actions";


export type ExpectedUserDataTypeFromAPI = UserSuccessReturnType['GET']
export type UserSliceState = SliceState<ExpectedUserDataTypeFromAPI>

const sliceName = "redux/features/user";

/** We have add more custom actions along with the default actions So we will use SlicePlugin to plug those custom actions in slice  */
const slicePlugin = new SlicePlugin();
slicePlugin.actionsRecord.register<typeof UserActions>(UserActions)

export const sharedSlice = new SharedSlice<ExpectedUserDataTypeFromAPI>(sliceName, slicePlugin);

export const UserSlice = sharedSlice.getSharedSlice();

export const UserReducer = UserSlice.reducer;

export const {updateUserField, setUserData} = UserSlice.actions;