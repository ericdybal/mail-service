import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import error from '../middlewares/errorHandler';
import { responseHeaders } from '../middlewares/defaultHeaders';
import apiController from '../controllers/apiController';

const app = express();

// http logging
app.use(morgan('dev'));

// http request plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/api', responseHeaders());

// routing
app.use('/api', apiController);

// error handling
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

export default app;
