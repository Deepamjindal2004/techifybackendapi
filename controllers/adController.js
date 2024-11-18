const Ad = require('../models/Ad');

// Create an ad
exports.createAd = async (req, res) => {
    const { title, description, price, endDate } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    try {
        const ad = await Ad.create({
            title, description, price, endDate, image: imageUrl, userId: req.user.id
        });
        res.status(201).json(ad);
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
        const ad = await Ad.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            {
                ...req.body,
                image: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined,
            },
            { new: true, runValidators: true }
        );
        if (!ad) return res.status(403).json({ message: 'Forbidden' });
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search ads with optional filters
exports.searchAds = async (req, res) => {
    const { search, category, minPrice, maxPrice } = req.query;
    const query = {
        ...(search && {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        }),
        ...(category && { category }),
        ...(minPrice && { price: { $gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { $lte: parseFloat(maxPrice) } }),
    };

    try {
        const ads = await Ad.find(query).sort({ createdAt: -1 });
        if (!ads.length) return res.status(404).json({ message: 'No ads found matching the criteria.' });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ads', error });
    }
};

// Disable an ad
exports.disableAd = async (req, res) => {
    try {
        const ad = await Ad.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isActive: false },
            { new: true }
        );
        if (!ad) return res.status(403).json({ message: 'Unauthorized or Ad not found' });
        res.json({ message: 'Ad disabled successfully', ad });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
