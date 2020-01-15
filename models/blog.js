const mongoose = require('mongoose');
const config = require('../utils/config');
const logger = require('../utils/logger');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required'
  },
  author: {
    type: String,
    required: 'Author is required'
  },
  url: {
    type: String,
    required: 'URL is required'
  },
  likes: {
    type: Number,
    require: 'Number of likes is required',
    default: 0
  }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

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

module.exports = Blog;