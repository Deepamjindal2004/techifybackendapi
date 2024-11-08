// controllers/userController.js

const User = require('../models/User');      
const bcrypt = require('bcryptjs');          
const jwt = require('jsonwebtoken');         

// Register a new user
exports.register = async (req, res) => {
    const { username, password, email } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    // Create a new user instance
    const user = new User({ 
        username, 
        password: hashedPassword, 
        email 
    });

    try {
        const savedUser = await user.save();
        res.status(201).json({ user: savedUser._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Log in a user
exports.login = async (req, res) => {
    const { username, password } = req.body; 

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare provided password with the stored hashed password
        const isValid = await bcrypt.compare(password, user.password);

        // If the password is invalid, return an error
        if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
