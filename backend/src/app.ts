import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import routesV1 from './routes/v1';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

// API Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('PrimeTrade Backend API is running');
});

// v1 API routes
app.use('/api/v1', routesV1);

// Global Error Handler
app.use(errorHandler);

export default app;
