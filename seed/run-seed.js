process.env.NODE_ENV = 'production';
const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = require("../config/index.js")
const data = require('./devData/index.js')

mongoose.connect(DB_URL)
  .then(() => {
    return seedDB(data)
  })
  .then(() => {
    mongoose.disconnect();
  });