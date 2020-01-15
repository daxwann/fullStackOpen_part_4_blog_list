const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  
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
  } catch(exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch(exception) {
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
  } catch(exception) {
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
  } catch(exception) {
    next(exception);
  }
});

module.exports = blogsRouter;