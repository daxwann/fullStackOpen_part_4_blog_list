const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/blogs', blogsRouter);
app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app;