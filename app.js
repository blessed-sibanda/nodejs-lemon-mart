var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var docs = require('./docs');
var cors = require('cors');
var mongoose = require('mongoose');
var v1Router = require('./src/routes/v1');
var v2Router = require('./src/routes/v2');
var config = require('./config');

mongoose.connect(config.mongoUri);

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/', v1Router);
app.use('/v2/', v2Router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

module.exports = app;
