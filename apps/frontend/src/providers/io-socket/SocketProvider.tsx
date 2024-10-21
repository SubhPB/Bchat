/** Byimaan */

'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, createContext, useState, useMemo } from 'react';
import IoSocket, {Socket} from "socket.io-client";
import { useAppDispatch } from '@/lib/redux/hooks';

import { useIoEventManager } from '@/utils/react-hooks/use-socket-event-manager';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type Props = {
    children : React.ReactNode;
    backendUrl ?: string;
};

type SocketContextType = ReturnType<typeof useIoEventManager>['eventDispatchers'] | null;

const SocketContext = createContext<SocketContextType>(null);

function SocketProvider({children, backendUrl=BACKEND_URL}:Props) {

    const [ioSocket, setIoSocket] = useState<Socket | null>(null);
    const session = useSession(), userId = (session.data?.user?.id ?? session.data?.adapterUser?.id) as string;

    const appDispatch = useAppDispatch();

    /** useSocket will have all the methods to interact with the socket which will be used in different components */
    const {eventDispatchers, eventHandlers} = useMemo(
        () => useIoEventManager(
            ioSocket,
            appDispatch
        ),
        [ioSocket, appDispatch]
    );


    useEffect(
        () => {
            const isAuthenticated = session.status === 'authenticated';

            if (!isAuthenticated){
                return
            };

            const socket = IoSocket(backendUrl, {
                query: {
                    userId,
                }
            });

            /**
             * Event handlers are the ones who handles events which are sent by server to us.
             * and the reason we passed eventDispatchers as a parameter is because we might need to dispatch some events back to the server
             */

            /** Handle events here */
            Object.entries(eventHandlers).forEach(([eventName, eventHandler]) => {
                socket.on(eventName, eventHandler);
            });

            setIoSocket(socket);

            return () => {

                if (!isAuthenticated){
                    return
                }
                
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

        }, [session.status]
    );

    return (
        <SocketContext.Provider value={eventDispatchers}>
            {children}    
        </SocketContext.Provider>  
    )
};

export const useSocketEvents = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context
}

export default SocketProvider