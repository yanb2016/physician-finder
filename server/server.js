const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/config')
const router = require('./route/route');
const app = express();
const PORT = process.env.PORT || 3001 ;

// connect database
mongoose.connect(config.mongoDbUri, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/static', express.static(path.join(__dirname, './build/static')))
app.use(bodyParser.json());

// return template
app.get('/', function(req, response, next) {
  response.sendFile('index.html', { root: path.join(__dirname, './build/')});
});

// use route to handle requests
app.use('/v1', router)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))