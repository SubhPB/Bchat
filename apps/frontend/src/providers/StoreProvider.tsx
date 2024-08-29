/**
 * Byimaan
 */

'use client'

import React, {useRef} from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/redux/app/store';

type Props = {
    children: React.ReactNode
}

function ReduxStoreProvider({children}:Props) {

    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current){
        storeRef.current = makeStore();
    };


    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}

export default ReduxStoreProvider