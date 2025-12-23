const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic configuration for swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for Test Prep',
    },
  },
  // Path to the API specs
  apis: ['./routes/*.js'], // Adjust the path to where your route files are
};

const swaggerSpec = swaggerJSDoc(options);

// Function to set up Swagger UI middleware
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
