const mongoose = require('mongoose');

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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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



module.exports = Blog;