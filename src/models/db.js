const mongoose = require('mongoose');
var debug = require('debug')('lemon-mart-server:db');

const connectDb = (uri) => {
  mongoose.connect(uri);

  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${uri}`);
  });

  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
};

module.exports = {
  connectDb,
};
