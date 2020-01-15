const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const testHelper = require('./test_helper.test');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of testHelper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('Get posts', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body.length).toBe(testHelper.initialBlogs.length);
  });

  test('all notes contain id', async () => {
    const blogs = await testHelper.blogsInDb();
    for (let blog of blogs) {
      expect(blog.id).toBeDefined();
    }
  });

  test('a specific title is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map(r => r.title);

    expect(titles).toContain(
      'React patterns'
    );
  });
});

describe('Create post', () => {
  test('a valid blog can be added ', async () => {
    await api
      .post('/api/blogs')
      .send(testHelper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map(r => r.title);

    expect(response.body.length).toBe(testHelper.initialBlogs.length + 1);
    expect(titles).toContain(
      'First class tests'
    );
  });

  test('note without author and url is not added', async () => {
    const newBlog = {
      title: 'No author'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const response = await api.get('/api/blogs');

    expect(response.body.length).toBe(testHelper.initialBlogs.length);
  });

  test('note without likes default to 0 like', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201);

    const response = await api.get('/api/blogs');

    expect(response.body.length).toBe(testHelper.initialBlogs.length + 1);

    const blog = await Blog.find({title: 'TDD harms architecture'});
    expect(blog[0].likes).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});