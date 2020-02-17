const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }

  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const blog = await Blog.findById(id);

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).json({ error: 'cannot find blog' });
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const newBlog = {
      title: body.title,
      author: user.name,
      likes: body.likes,
      user: user._id,
      url: body.url
    };

    const blog = new Blog(newBlog);

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const updatedBlog = request.body;

  try {
    const blog = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).json({ error: 'cannot find blog' });
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const blog = await Blog.findByIdAndRemove(id);
    if (blog) {
      response.status(204).json(blog);
    } else {
      response.status(404).json({ error: 'cannot find blog' });
    }
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
