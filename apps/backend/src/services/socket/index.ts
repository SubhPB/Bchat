/**
 * Byimaan
 * 
 * To handle all socket.io code logic e.g connect, disconnect, any event etc
 */


import { Server as IoServer } from "socket.io";

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

        /**All socket listeners here */
        this.io.on('connection', (socket) => {
            console.log('a user connected', socket.id);
        });

    };

};

export default SocketService