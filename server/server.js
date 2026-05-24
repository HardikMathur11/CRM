const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./src/config/db');

const app = express();

// standard middleware stuff
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

// connect to DB
connectDB();

// quick test route
app.get('/', (req, res) => {
  res.send('Manufacturing CRM API is running...');
});

// import all route groups
app.use('/api', require('./src/routes'));

// let's start the server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
  console.log(`client url is: ${process.env.CLIENT_URL}`);
});
