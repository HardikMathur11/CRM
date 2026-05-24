const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./src/utils/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();


// Test Route
app.get('/', (req, res) => {
  res.send('Manufacturing CRM API is running...');
});

// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/followups', require('./routes/followups'));
app.use('/api/reports', require('./routes/reports'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
