/** Byimaan */


import 'dotenv/config';
import cors from 'cors';
import {Server as HttpServer} from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan'
import express from 'express';

import { router } from '@/api/router';

import SocketService from './services/socket';

const port = process.env.PORT || 8000;

/**
 * Folder Structure Strategy for backend
 * backend/
    src/
    app/
    controllers/
    <-- models/ 'May not be used' -->
    routes/
    services/
    utils/
    server.ts
    config/
    env.ts
    database.ts
    server.ts
    package.json
    tsconfig.json
 */

function initializeBackend() {
   
   const app = express();
   
   /**  Integrate io.socket with express */
   const httpServer = new HttpServer(app);
   const socketService = new SocketService();
   socketService.IO.attach(httpServer);
   
   
   /** Express  Middlewares */
   app.use(bodyParser.json())
   app.use(cors());
   app.use(morgan('combined'))
   app.use('/api', router);
   
   
   app.get('/', (req, res) => res.send('Server is running!'));
   
   httpServer.listen(port, () => {
    console.log(`App listening on port: ${port}`);
   });
   
   /** After we have httpServer running, only then we can start listening for socket.io connections*/
   socketService.initListeners();
   
};

initializeBackend();