const parameters = require('./parameters');
const schemas = require('./schemas');

module.exports = {
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
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
