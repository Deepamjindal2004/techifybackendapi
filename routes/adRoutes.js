// routes/adRoutes.js

const express = require('express');  // Import express for routing
const router = express.Router();    // Create a new router instance
const {
    createAd,
    getAllAds,
    getAd,
    updateAd,
    disableAd,
    createQuestion,
    answerQuestion
} = require('../controllers/adController');  
const { authenticate } = require('../middleware/authMiddleware'); 

// Create an ad
router.post('/', authenticate, createAd);

// Get all ads
router.get('/', getAllAds);

// Get a specific ad
router.get('/:id', getAd);

// Update an ad
router.put('/:id', authenticate, updateAd);

// Disable an ad
router.patch('/:id/disable', authenticate, disableAd);

// Create a question for an ad
router.post('/:id/questions', authenticate, createQuestion);

// Answer a question for an ad
router.post('/:id/questions/:questionId/answer', authenticate, answerQuestion);

module.exports = router;