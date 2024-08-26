/**
 * Byimaan
 */

import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

// ReduxStore
export const makeStore = () => {
    return configureStore({
        reducer: rootReducer
    })
};


// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType=void> = ThunkAction<
ReturnType, RootState, unknown, Action<string>>