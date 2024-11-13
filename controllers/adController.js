// controllers/adController.js

const Ad = require('../models/Ad');

// Create an ad
exports.createAd = async (req, res) => {
    const { title, description, price, endDate } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    const ad = new Ad({
        title,
        description,
        price,
        userId: req.user.id,
        endDate,
        image: imageUrl // Set the full URL for the image
    });

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
        if (req.file) {
            ad.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // Set the full URL for the image
        }

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.disableAd = async (req, res) => {
    const adId = req.params.id;  // Get the adId from the URL

    try {
        const ad = await Ad.findById(adId);  // Find ad by ID
        if (!ad) {
            return res.status(404).json({ error: "Ad not found" });
        }

        if (ad.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to disable this ad" });
        }

        ad.isActive = false;  // Set the ad as inactive
        await ad.save();  // Save the changes to the ad

        res.status(200).json({ message: "Ad disabled successfully", ad });
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
};

