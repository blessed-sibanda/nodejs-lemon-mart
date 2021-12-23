const parameters = require('./parameters');
const schemas = require('./schemas');

module.exports = {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            $ref: '#/components/schemas/ServerMessage',

            type: 'string',
          },
        },
      },
    },
    ...schemas,
    ...parameters,
  },
};
