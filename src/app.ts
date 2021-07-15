import path from 'path';
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import { router } from './router';
import fileUpload from 'express-fileupload';
import { routerFiles } from './router-files';

const staticFilesPath = path.resolve(__dirname, '../wwwroot');

const server = express();

const PORT = 3001;

server.use(json());

server.use(cors());

server.use(fileUpload());

server.use('/', express.static(staticFilesPath));

server.use('/api/', router);

server.use('/upload', routerFiles);


server.listen(PORT, () => console.log(`server started on port ${PORT}`));