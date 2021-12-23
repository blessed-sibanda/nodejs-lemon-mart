var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const docs = require('./docs');
const cors = require('cors');

var v1Router = require('./src/routes/v1');
var v2Router = require('./src/routes/v2');

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

module.exports = app;
