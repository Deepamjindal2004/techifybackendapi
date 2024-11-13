// routes/adRoutes.js

const express = require('express');  // Import express for routing
const router = express.Router();    // Create a new router instance
const {
    createAd,
    getAllAds,
    getAd,
    updateAd,
    disableAd,
} = require('../controllers/adController');  
const { authenticate } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/upload');

// Create an ad
router.post('/', authenticate, upload.single('image'), createAd);

// Get all ads
router.get('/', getAllAds);

// Get a specific ad
router.get('/:id', getAd);

// Update an ad
router.put('/:id', authenticate, upload.single('image'), updateAd);

// Disable an ad
router.patch('/:id/disable', authenticate, disableAd);

module.exports = router;