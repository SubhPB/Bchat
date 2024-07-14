// Byimaan

'use client'
import React, {useState} from 'react';

type Args = {
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    doToggle: () => void;
}

type Props = {
    defaultState ?: boolean
    render: ({state, setState, doToggle}: Args) => React.ReactNode
}

function BooleanRenderProp({defaultState=false, render}: Props) {

    const [state, setState] = useState(defaultState);
    
    const doToggle = () => setState(
        prevState => !prevState
    );

    return (
        render({state, setState, doToggle})
    )
}

export { BooleanRenderProp }