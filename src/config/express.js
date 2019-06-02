import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler, { notFound } from '../middlewares/errorHandler';
import router from '../routes/allRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../controllers/swagger.json';

const app = express();

// http logging
app.use(morgan('dev'));

// http request plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(helmet());
app.use(cors());

// routing
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router);

// error handling
app.use(notFound);
app.use(errorHandler);

export default app;
