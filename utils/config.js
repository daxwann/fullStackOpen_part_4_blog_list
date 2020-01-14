// load env in development
require('dotenv').config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let NODE_ENV = process.env.NODE_ENV;

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV
};