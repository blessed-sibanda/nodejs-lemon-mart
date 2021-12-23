module.exports = {
  '/v1/auth/me': {
    get: {
      tags: ['Auth'],
      description: 'Gets the `User` object of the logged n user',
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
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
