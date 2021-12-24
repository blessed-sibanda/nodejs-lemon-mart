const { User } = require('../../src/models');

let filterParamReferences = [];
User.filterFields.forEach((field) => {
  filterParamReferences.push({
    $ref: `#/components/parameters/${field}FilterParam`,
  });
});

module.exports = {
  '/v2/users': {
    post: {
      tags: ['Users'],
      summary: 'Create a new `User`',
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
      },
    },
    get: {
      tags: ['Users'],
      description:
        'Searches, sorts, paginates and returns a summary of `User` objects',
      parameters: [
        ...filterParamReferences,
        { $ref: '#/components/parameters/sortParam' },
        { $ref: '#/components/parameters/pageParam' },
      ],
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        email: { type: 'string' },
                        fullName: { type: 'string' },
                        name: { $ref: '#/components/schemas/Name' },
                        role: { $ref: '#/components/schemas/Role' },
                      },
                      description: 'Summary of `User` object',
                    },
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
