/**
 * Byimaan
 */

import React, {useContext, createContext, useState} from "react";
import { PropsWhenFalse, PropsWhenTrue } from "./types";
import { Utilities } from "./types";

type ContextValues = {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    utilities: Utilities
}

const FileContext = createContext<ContextValues | null>(null);

const FileContextProvider:React.FC<PropsWhenTrue  | PropsWhenFalse> = (props) => {


    const [files, setFiles] = useState<File[]>([]);

    const utilities:Utilities = {
       pushFile: (file:File) => setFiles([...files, file]),
       unShift: (file: File) => setFiles([file, ...files]),
       doEmpty: () => setFiles([]),
    };
    const contextValues: ContextValues = {
        files,
        setFiles,
        utilities
    };


    if (props.useByRenderProps){
        const {children} = props as PropsWhenTrue;
        return (
            <>
            {children({files, setFiles, utilities})}
            </>
        )
    };
    const {children} = props as PropsWhenFalse;

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
