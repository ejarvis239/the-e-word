const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./router/api');
const { handle404s, handle400s, handle500s } = require('./errors')
app.use(bodyParser.json(), express.static('public'))
const DB_URL = process.env.DB_URL || require('./config/index.js')

mongoose.connect(DB_URL)
  .catch(console.log)

app.get('/', (req, res) => {
    res.render('index');
    // res.send('all good'));
});

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
res.status(404).send('Page not found');
});

// app.use((err, req, res, next) => {
//   // console.log(err.name)
//   // console.log(err.message)
// })
app.use(handle404s);

app.use(handle400s);

// app.use(handle500s);

module.exports = app;
