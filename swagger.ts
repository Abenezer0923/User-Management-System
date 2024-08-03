// swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'A simple API documentation',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Local server',
    },
  ],
};
// http://localhost:8000/api/auth/login


const options = {
  swaggerDefinition,
  apis: ['./router/**/*.ts'], // Ensure this path is correct
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
