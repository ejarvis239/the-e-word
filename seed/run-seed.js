process.env.NODE_ENV = 'production';
const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://<dbuser>:<dbpassword>@ds257372.mlab.com:57372/ncnews'
const data = require('./devData/index.js')

mongoose.connect(DB_URL)
  .then(() => {
    return seedDB(data)
  })
  .then(() => {
    console.log('Database successfully seeded!')
    mongoose.disconnect();
  });