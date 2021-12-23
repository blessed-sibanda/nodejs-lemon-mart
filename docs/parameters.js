module.exports = {
  parameters: {
    filterParam: {
      in: 'query',
      name: 'filter',
      required: false,
      schema: {
        type: 'string',
      },
      description: 'Search text to filter the result set by',
    },
    skipParam: {
      in: 'query',
      name: 'skip',
      required: false,
      schema: {
        type: 'integer',
        minimum: 0,
      },
      description: 'The number of items to skip before collecting the result set',
    },
    limitParam: {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'integer',
        minimum: 0,
        maximum: 50,
        default: 10,
      },
      description: 'The number of items to return',
    },
    sortParam: {
      in: 'query',
      name: 'sortKey',
      required: false,
      schema: {
        type: 'string',
      },
      description:
        'Name of column to sort ascending. Prepend column name with a dash to sort descending',
    },
  },
};
