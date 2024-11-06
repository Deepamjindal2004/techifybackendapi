// controllers/adController.js

const Ad = require('../models/Ad');

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
