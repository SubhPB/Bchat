/**
 * Byimaan
 */

export type Utilities = {
    pushFile: (file: File) => void;
    unShift: (file: File) => void;
    doEmpty: () => void;
};

type ChildrenArgs = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    utilities: Utilities
};

export type BaseProps = { 
    useByRenderProps: boolean
}

export type PropsWhenFalse = {
    children: React.ReactNode;
    useByRenderProps: false
};

export type PropsWhenTrue = {
    children: (args:ChildrenArgs) => React.ReactNode;
    useByRenderProps: true,
};

export type ConditionalProps = PropsWhenTrue 

