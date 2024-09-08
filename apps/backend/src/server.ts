/** Byimaan */


import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { router } from '@/api/router';

import {Server as HttpServer} from 'http';
import SocketService from './services/socket';

const port = process.env.PORT || 4001;

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
   app.use(cors());
   app.use('/api', router);
   
   
   app.get('/', (req, res) => res.send('Server is running!'));
   
   httpServer.listen(port, () => {
    console.log(`App listening on port: ${port}`);
   });
   
   /** We can't start listening without httpServer running */
   socketService.initListeners();
   
};

initializeBackend();