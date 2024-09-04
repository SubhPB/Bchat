/**
 * Byimaan
 */
'use client';
import React, {useState} from 'react'
import toast from 'react-hot-toast';

type ChildrenArgs = {
    editMode: boolean,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    uploadImage: () => Promise<void>
}

type Props = {
    children: (args:ChildrenArgs) => React.ReactNode
}

function StateMode({children}:Props) {

    const [editMode, setEditMode] = useState(false);

    const uploadImage = async() => {
        toast.loading("Saving Changes ...", {
            duration: 4000
        })
    }

    return (
        <>
            { children({editMode, setEditMode, uploadImage}) }
        </>
    )
}

export default StateMode