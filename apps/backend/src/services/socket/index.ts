/**
 * Byimaan
 * 
 * To handle all socket.io code logic e.g connect, disconnect, any event etc
 */


import { Server as IoServer } from "socket.io";
import { onConnection, onDisconnect } from "./events";

class SocketService {
    private io: IoServer
    constructor() { 
        this.io = new IoServer({
            cors: {
                /** Will change during deployment */
                origin: '*',
                allowedHeaders: ['*']
            }
        });
    };
    get IO(): IoServer {
        return this.io
    };

    public initListeners = () => {
        console.log(" Initializing Socket.io listeners...");
        /**All socket listeners here */
        this.io.on('connection', (socket) => onConnection(socket, this.io));

        this.io.on('disconnect', (socket) => onDisconnect(socket, this.io));

    };

};

export default SocketService