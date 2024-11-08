// controllers/adController.js

const Ad = require('../models/Ad');
const Question = require('../models/Question');

// Create a question for an ad
exports.createQuestion = async (req, res) => {
    const { question } = req.body;            // Extract question text from request body
    const adId = req.params.id;               // Get ad ID from request parameters
    
    try {
        const ad = await Ad.findById(adId); // Find ad by ID
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        // Create a new question associated with the ad
        const newQuestion = new Question({
            adId: adId,
            userId: req.user.id, // Using the user ID from the token
            question: question
        });

        const savedQuestion = await newQuestion.save();  // Save question
        res.status(201).json(savedQuestion);              // Respond with the saved question
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Answer a question for an ad
exports.answerQuestion = async (req, res) => {
    const { answer } = req.body;            // Extract answer text from request body
    const { adId, questionId } = req.params;  // Get ad and question IDs from request parameters

    try {
        const question = await Question.findById(questionId); // Find question by ID
        if (!question) return res.status(404).json({ message: 'Question not found' }); // If question not found, return 404
        
        if (question.adId.toString() !== adId) return res.status(400).json({ message: 'Question does not belong to this ad' });

        // Ensure the user is the ad owner or an authorized user
        if (question.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        question.answer = answer;   // Set the answer on the question
        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create an ad
exports.createAd = async (req, res) => {
    const { title, description, price, endDate } = req.body;
    const ad = new Ad({ title, description, price, userId: req.user.id, endDate });

    try {
        const savedAd = await ad.save();    // Save ad 
        res.status(201).json(savedAd);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all ads
exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();           // Retrieve all ads from the database
        res.json(ads);                         // Respond with list of ads
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors with 500 response
    }
};


// Get a specific ad
exports.getAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an ad
exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);  // Find ad by ID
        if (!ad || ad.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        const { title, description, price, endDate } = req.body;
        ad.title = title;
        ad.description = description;
        ad.price = price;
        ad.endDate = endDate;

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Disable an ad
exports.disableAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);  // Find ad by ID
        if (!ad || ad.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        ad.endDate = Date.now(); // Set the end date to now to disable it
        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
