// const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// load env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/blog-list';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});