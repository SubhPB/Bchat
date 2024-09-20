/** Byimaan */

'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, createContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import IoSocket, {Socket} from "socket.io-client";

import { clientEventHandlers } from './handlers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type Props = {
    children : React.ReactNode;
    backendUrl ?: string;
};

type SocketContextType = {
    args: any
} | null;

const SocketContext = createContext<SocketContextType>(null);

function SocketProvider({children, backendUrl=BACKEND_URL}:Props) {

    const [ioSocket, setIoSocket] = useState<Socket | null>(null);
    const session = useSession(), userId = (session.data?.user?.id ?? session.data?.adapterUser?.id) as string;

    /** useSocket will have all the methods to interact with the socket which will be used in different components */

    useEffect(
        () => {

            const socket = IoSocket(backendUrl, {
                query: {
                    userId,
                }
            });

            /** Handle events here */
            Object.entries(clientEventHandlers).forEach(([eventName, eventHandler]) => {
                socket.on(eventName, eventHandler);
            });

            setIoSocket(socket);

            return () => {
                
                /**
                 * Make sure to `off` all the events here
                 * e.g:-  * socket.off(<event_name>)
                 */

                Object.entries(clientEventHandlers).forEach(([eventName, eventHandler]) => {
                    socket.off(eventName, eventHandler);
                })

                /** 
                 * if we do socket.disconnect(true) or socket.close() here, then `disconnect` event will not be triggered at the server side.
                 */
                socket.disconnect();

                setIoSocket(null);
            }

        }, []
    );

    return (
        <SocketContext.Provider value={null}>
            {children}    
        </SocketContext.Provider>  
    )
};

export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error("useScocket must be used within a SocketProvider");
    }
    return context
}

export default SocketProvider