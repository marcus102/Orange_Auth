const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorsController');
const OTPRouter = require('./routes/OTPRoutes');
const clientRouter = require('./routes/clientRoutes');
const appError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

app.use(cors());

const rootUrl = '/api/v1';
app.use(`${rootUrl}/orange-OTP`, OTPRouter);
app.use(`${rootUrl}/orange-client`, clientRouter);

app.all('*', (req, res, next) => {
  next(appError(`Sorry!!! cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
