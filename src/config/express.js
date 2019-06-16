import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler, { notFound } from '../middlewares/errorHandler';
import router_v1 from '../routes/routes_v1';
import router_v2 from '../routes/routes_v2';
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
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router_v1);
app.use('/api/v1', router_v1);
app.use('/api/v2', router_v2);

// error handling
app.use(notFound);
app.use(errorHandler);

export default app;
