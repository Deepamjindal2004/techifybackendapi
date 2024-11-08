// controllers/adController.js

const Ad = require('../models/Ad');
const Question = require('../models/Question');

// Create a question for an ad
exports.createQuestion = async (req, res) => {
    const { question } = req.body;
    const adId = req.params.id;
    
    try {
        const ad = await Ad.findById(adId);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        const newQuestion = new Question({
            adId: adId,
            userId: req.user.id, // Using the user ID from the token
            question: question
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Answer a question for an ad
exports.answerQuestion = async (req, res) => {
    const { answer } = req.body;
    const { adId, questionId } = req.params;

    try {
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        
        if (question.adId.toString() !== adId) return res.status(400).json({ message: 'Question does not belong to this ad' });

        // Ensure the user is the ad owner or an authorized user
        if (question.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        question.answer = answer;
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
        const savedAd = await ad.save();
        res.status(201).json(savedAd);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all ads
exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const ad = await Ad.findById(req.params.id);
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
        const ad = await Ad.findById(req.params.id);
        if (!ad || ad.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        ad.endDate = Date.now(); // Set the end date to now to disable it
        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
