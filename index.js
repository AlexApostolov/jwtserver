// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB SETUP
mongoose.connect('mongodb://localhost:auth/auth');

// APP SETUP
// Use middlewares morgan & body-parser for any incoming requests
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// SERVER SETUP
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
