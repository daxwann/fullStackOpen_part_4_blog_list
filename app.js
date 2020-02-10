const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());

// mongodb
const mongoUrl = config.MONGODB_URI;

logger.info('connecting to', mongoUrl);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

// route handling
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

// middleware
app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app;