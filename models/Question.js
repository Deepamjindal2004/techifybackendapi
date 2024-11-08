// models/Question.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
