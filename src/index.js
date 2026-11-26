import express from 'express';
import mediaRouter from './routes/media-routes.js';
import userRouter from './routes/user-routes.js';
import {logRequest} from './middlewares/logger.js';
import authRouter from './routes/auth-router.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handler.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Media Sharing REST API',
      version: '1.0.0',
      description: 'REST API documentation for template1 application',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.set('view engine', 'pug');
app.set('views', 'src/views');

// käytetään omaan logger-middlewarea jokaiselle http-pyynnölle
app.use(logRequest);

app.use(express.json());

// public-kansion kaikki sisältö tarjoillaan palvelimen juuri-urlissa
app.use('/', express.static('public'));

// Swagger UI for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS middleware configuration
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// API "docs" using pug template engine
app.get('/api', (req, res) => {
  res.render('index', {
    title: 'Example REST api',
    message: 'Dummy /items endpoint API for now.',
  });
});

// All media resource routes (/api/media endpoints) are handled with media router
app.use('/api/media', mediaRouter);
// user resource endpoints
app.use('/api/users', userRouter);
// user authentication
app.use('/api/auth', authRouter);

// oletusreitti kaikille http-pyynnöille, joille ei ole määritelty reittiä.
app.use(notFoundHandler);
// oletusvirheenkäsittely
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
