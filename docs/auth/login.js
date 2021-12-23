module.exports = {
  '/v1/login': {
    post: {
      tags: ['Auth'],
      description: 'Generates a JWT, given correct credentials',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', required: true },
                password: { type: 'string', required: true },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    description:
                      'JWT token that contains the userId as subject, email and role as data payload',
                  },
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
      },
    },
  },
};
