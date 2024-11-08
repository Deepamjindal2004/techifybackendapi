// controllers/userController.js

const User = require('../models/User');      // Import User model
const bcrypt = require('bcryptjs');          // Import bcryptjs for password hashing
const jwt = require('jsonwebtoken');         // Import jsonwebtoken for generating JWTs

// Register a new user
exports.register = async (req, res) => {
    const { username, password, email } = req.body; // Extract user details from request body
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
    
    // Create a new user instance
    const user = new User({ 
        username, 
        password: hashedPassword, // Store the hashed password
        email 
    });

    try {
        // Save the user to the database
        const savedUser = await user.save();
        // Respond with the user ID on successful registration
        res.status(201).json({ user: savedUser._id });
    } catch (error) {
        // Handle errors with 400 response if user can't be saved
        res.status(400).json({ message: error.message });
    }
};

// Log in a user
exports.login = async (req, res) => {
    const { username, password } = req.body; // Extract credentials from request body

    try {
        // Find user by username
        const user = await User.findOne({ username });
        // If user doesn't exist, return an error
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare provided password with the stored hashed password
        const isValid = await bcrypt.compare(password, user.password);
        // If the password is invalid, return an error
        if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token that expires in 1 hour
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with the generated token
        res.json({ token });
    } catch (error) {
        // Handle errors with 500 response for internal server errors
        res.status(500).json({ message: error.message });
    }
};
