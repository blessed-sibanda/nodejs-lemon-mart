module.exports = {
  '/v2/users/{id}': {
    get: {
      tags: ['Users'],
      description: 'Gets a `User` object by id',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: "User's unique id",
        },
      ],
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
    },
    put: {
      tags: ['Users'],
      summary: 'Updates an existing `User`',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: "User's unique id",
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
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
