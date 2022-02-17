const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app);

const PORT = process.env.APP_PORT || '4000';
app.listen(PORT, function () {
  console.log(
    `Localhost app listening on port ${PORT}! Go to http://localhost:${PORT}/`
  );
});
