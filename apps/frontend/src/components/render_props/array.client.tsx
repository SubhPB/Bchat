/** Byimaan */

/**
 * Array render prop 
 */

'use client';

import React from "react";

type RenderProps<T> = {
    state: T[];
    setState: React.Dispatch<React.SetStateAction<T[]>>;
}

type ARRAYProps<T> = {
    defaultState ?: T[];
    children: (props: RenderProps<T>) => React.ReactNode
}

function ARRAYHOC<ElemType>({defaultState=[], children}: ARRAYProps<ElemType>) {

    const [state, setState] = React.useState<ElemType[]>(defaultState);

    const push = (elem: ElemType) => {
        setState(
            currState => [...currState, elem]
        );
        return elem
    };

    return (
        children({
            state, 
            setState
        })
    )
};

export {ARRAYHOC}