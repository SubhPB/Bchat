/**
 * Byimaan
 */
'use client';
import React, {useState} from 'react'
import toast from 'react-hot-toast';

type ChildrenArgs = {
    editMode: boolean,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
}

type Props = {
    children: (args:ChildrenArgs) => React.ReactNode
}

function StateMode({children}:Props) {

    const [editMode, setEditMode] = useState(false);

    return (
        <>
            { children({editMode, setEditMode}) }
        </>
    )
}

export default StateMode