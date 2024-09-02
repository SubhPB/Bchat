/**
 * Byimaan
 */

import { RootState } from "../../app/store";
import { ExpectedUserDataTypeFromAPI } from "./slice";
import { UserSliceState } from "./slice";

export const selectUserData = (state: RootState) => state.user.data;

type SelectUserField = (fieldKey: keyof ExpectedUserDataTypeFromAPI) =>  (state: RootState) => (ExpectedUserDataTypeFromAPI[typeof fieldKey] | undefined)

export const selectUserField: SelectUserField = (fieldKey) => {
    return function (state: RootState){
        return (state.user as UserSliceState).data?.[fieldKey]
    }
}