// routes/userRoutes.js

const express = require('express');
const router = express.Router();  // Create a new router instance
const { register, login } = require('../controllers/userController'); // Import user controller methods

// Register a new user
router.post('/register', register);

// Login an existing user
router.post('/login', login);

module.exports = router;