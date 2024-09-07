import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { router } from '@/api/router';

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

const app = express();

app.use(cors());
app.get('/', (req, res) => res.send('Server is running!'));
app.use('/api', router);

app.listen(port, () => {
 console.log(`App listening on port: ${port}`);
});