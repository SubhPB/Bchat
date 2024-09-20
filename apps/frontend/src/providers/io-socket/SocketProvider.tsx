/** Byimaan */

'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, createContext, useState, useMemo } from 'react';
import IoSocket, {Socket} from "socket.io-client";

import { useEventHandlers } from './handlers';
import { useEventDispatcher } from './dispatchers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type Props = {
    children : React.ReactNode;
    backendUrl ?: string;
};

type SocketContextType = ReturnType<typeof useEventDispatcher> | null;

const SocketContext = createContext<SocketContextType>(null);

function SocketProvider({children, backendUrl=BACKEND_URL}:Props) {

    const [ioSocket, setIoSocket] = useState<Socket | null>(null);
    const session = useSession(), userId = (session.data?.user?.id ?? session.data?.adapterUser?.id) as string;

    /** useSocket will have all the methods to interact with the socket which will be used in different components */

    const eventDispatchers = useMemo(() => (
        useEventDispatcher(ioSocket)
    ), [ioSocket]);

    useEffect(
        () => {

            const socket = IoSocket(backendUrl, {
                query: {
                    userId,
                }
            });

            /**
             * Event handlers are the ones who handles events which are sent by server to us.
             * and the reason we passed eventDispatchers as a parameter is because we might need to dispatch some events back to the server
             */
            const eventHandlers = useEventHandlers(eventDispatchers);

            /** Handle events here */
            Object.entries(eventHandlers).forEach(([eventName, eventHandler]) => {
                socket.on(eventName, eventHandler);
            });

            setIoSocket(socket);

            return () => {
                
                /**
                 * Make sure to `off` all the events here
                 * e.g:-  * socket.off(<event_name>)
                 */

                Object.entries(eventHandlers).forEach(([eventName, eventHandler]) => {
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
        <SocketContext.Provider value={eventDispatchers}>
            {children}    
        </SocketContext.Provider>  
    )
};

export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context
}

export default SocketProvider