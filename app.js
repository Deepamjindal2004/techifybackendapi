// app.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const app = express();  // Initialize an express application
const PORT = process.env.PORT || 3000;  

// Middleware setup
const allowedOrigins = [
    'https://techifyapplication.netlify.app',
    'https://techifyfrontendapp-2.onrender.com',
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));
app.use(bodyParser.json());  

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));// Serve static files from the "uploads" directory 


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)  
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });  
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
});