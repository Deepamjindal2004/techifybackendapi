const express = require('express');
const router = express.Router();
const {
  createAd,
  getAllAds,
  getAd,
  updateAd,
  disableAd,
  searchAds, // Import the search logic from the controller
} = require('../controllers/adController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Create an ad
router.post('/', authenticate, upload.single('image'), createAd);

// Get all ads
router.get('/', getAllAds);

// Search ads by query
router.get('/search', searchAds); // Delegates logic to the controller

// Get a specific ad by ID
router.get('/:id', getAd);

// Update an ad
router.put('/:id', authenticate, upload.single('image'), updateAd);

// Disable an ad
router.patch('/:id/disable', authenticate, disableAd);

module.exports = router;
