const serverless = require('serverless-http');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const bookController = require('./src/controllers/books.controller');

app.use(bodyParser());
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/book', bookController);

module.exports.handler = serverless(app);