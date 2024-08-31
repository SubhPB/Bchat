/**
 * Byimaan
 */

import React, { useEffect } from "react";

type Props<E> = {
    rootRef: E;
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    dependencies: React.DependencyList | undefined;
    /** If user manually want to handle the logic when clicked outside the scope of DIV */
    callbackFn ?: Function
}

/**
 * UseCase :-
 *      Suppose we have div element which is resizeable such that if state is true means it is at its full size.
 *      We want that if user click outside the scope of div element then we gonna shrink it using setState
 */

export function useClickScopeEffect<E>({rootRef, state, setState, dependencies, callbackFn}: Props<E>){
    return useEffect(
        () => {
            const listenFn = (e:MouseEvent) => {
                //@ts-ignore
                if (state && rootRef.current && !rootRef.current?.contains(e.target as Node)){
                    callbackFn ? callbackFn() : setState(false)
                };  
            }
            /** we only want to listen to the click event if element is in its large size*/
            if(state) {
                document.addEventListener('click', listenFn)
            };
            return () => document.removeEventListener('click', listenFn)
        }, dependencies
    )
}