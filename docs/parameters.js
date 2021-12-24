const { User } = require('../src/models');

let usersFilterParams = {};
User.filterFields.forEach((field) => {
  usersFilterParams[`${field}FilterParam`] = {
    in: 'query',
    name: field,
    required: false,
    schema: {
      type: 'string',
    },
    description: `${field} filter param`,
  };
});

module.exports = {
  parameters: {
    ...usersFilterParams,
    sortParam: {
      in: 'query',
      name: 'sort',
      required: false,
      schema: {
        type: 'string',
      },
      description:
        'Name of columns (separated by commas) to sort ascending. Prepend column name with a dash to sort descending',
    },
    pageParam: {
      in: 'query',
      name: 'page',
      required: false,
      schema: {
        type: 'integer',
      },
      description: 'Page number',
    },
  },
};
