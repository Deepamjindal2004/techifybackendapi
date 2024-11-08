// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // To access environment variables

const app = express();  // Initialize an express application
const PORT = process.env.PORT || 3000;  // Use the port from environment variables or default to 3000

// Middleware setup
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());  // Parse JSON data in request bodies

// Import route modules
const userRoutes = require('./routes/userRoutes');
const adRoutes = require('./routes/adRoutes');

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to Techify API');
});

// Use routes
app.use('/api/users', userRoutes);  // Routes for user operations
app.use('/api/ads', adRoutes);      // Routes for ad operations



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)  // Use the MongoDB URI from environment variables
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });  // Send a generic error response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  // Log a message once the server is running
});