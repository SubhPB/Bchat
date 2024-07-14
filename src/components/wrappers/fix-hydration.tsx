//Byimaan
'use client'

import { useEffect, useState } from "react";
import React from 'react';

type Props = {
    children: React.ReactNode
}

function FixHydration({children}: Props) {

    const [serverRendering, setServerRendering] = useState(true);

    useEffect(
        () => {
            setServerRendering(false);
        }, []
    )

    return (
    <>
        {!serverRendering && children}
    </>
    )
}

export default FixHydration