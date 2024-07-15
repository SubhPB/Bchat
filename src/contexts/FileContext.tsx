// Byimaan

import React, {useContext, createContext, useState} from "react";

type ContextValues = {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

type Props = {
    children: React.ReactNode
};

const FileContext = createContext<ContextValues | null>(null);


const FileContextProvider:React.FC<Props> = ({children}) => {


    const [files, setFiles] = useState<File[]>([]);

    const contextValues: ContextValues = {
        files,
        setFiles
    }

    return (
        <FileContext.Provider value={contextValues}>
            {children}
        </FileContext.Provider>
    )
};

const useFiles = () => {
    const context = useContext(FileContext);
    if (!context){
        throw new Error(`[4xx Context Error] useFiles hooks should only be used inside the scope of FileContextProvider`)
    };
    return context;
};

export {FileContextProvider, useFiles};
