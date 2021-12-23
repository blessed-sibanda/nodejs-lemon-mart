module.exports = {
  schemas: {
    ServerMessage: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    Role: {
      type: 'string',
      enum: ['none', 'clerk', 'cashier', 'manager'],
    },
    PhoneType: {
      type: 'string',
      enum: ['none', 'mobile', 'home', 'work'],
    },
    Phone: {
      type: 'object',
      properties: {
        type: { $ref: '#/components/schemas/PhoneType', required: true },
        digits: { type: 'string', required: true },
      },
    },
    Name: {
      type: 'object',
      properties: {
        first: { type: 'string', required: true },
        middle: { type: 'string' },
        last: { type: 'string', required: true },
      },
    },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        email: { type: 'string', required: true },
        name: { $ref: '#/components/schemas/Name', required: true },
        picture: { type: 'string', required: true },
        role: { $ref: '#/components/schemas/Role' },
        userStatus: { type: 'boolean', required: true },
        dateOfBirth: { type: 'string', format: 'date' },
        address: {
          type: 'object',
          properties: {
            line1: { type: 'string', required: true },
            line2: { type: 'string' },
            city: { type: 'string', required: true },
            state: { type: 'string', required: true },
            zip: { type: 'string', required: true },
          },
        },
        phones: {
          type: 'array',
          items: { $ref: '#/components/schemas/Phone' },
        },
      },
    },
  },
};
