import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import env from './utils/env.js';
import routerAuth from './routers/auth.js';
import routerContacts from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const PORT = env('PORT', 3000);
const app = express();
const logger = pinoHttp({
  transport: {
    target: 'pino-pretty',
  },
});

const setupServer = () => {
  app.use(cors());
  app.use(logger);
  app.use(cookieParser());

  app.use('/auth', routerAuth);

  app.use('/contacts', routerContacts);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
