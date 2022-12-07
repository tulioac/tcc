import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import 'module-alias/register';
import 'reflect-metadata';

import createDatabaseConnection from 'database/createConnection';
import { RouteNotFoundError } from 'errors';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { addRespondToResponse } from 'middleware/response';

import { attachPrivateRoutes, attachPublicRoutes } from './routes';

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('Connecting to database...');
    await createDatabaseConnection();
    console.log('Connected!');
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  app.listen(process.env.PORT || 3000);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
