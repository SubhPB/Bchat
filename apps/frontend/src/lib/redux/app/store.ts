/**
 * Byimaan
 */

import {configureStore} from "@reduxjs/toolkit";

// ReduxStore
export const makeStore = () => {
    return configureStore({
        reducer: {}
    })
};


// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];