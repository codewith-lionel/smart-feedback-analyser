const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { analyzeFeedback } = require('../services/sentimentAnalysis');

const feedbackPath = path.join(__dirname, '../data/feedback.json');
const productsPath = path.join(__dirname, '../data/products.json');

/**
 * POST /api/feedback - Submit new feedback
 */
router.post('/', (req, res) => {
  try {
    const { productId, satisfaction, likes, improvements, additionalComments } = req.body;

    // Validate required fields
    if (!productId || !satisfaction) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID and satisfaction rating are required' 
      });
    }

    // Perform sentiment analysis
    const sentimentResult = analyzeFeedback({
      satisfaction,
      likes,
      improvements,
      additionalComments
    });

    // Create feedback entry
    const feedback = {
      id: Date.now(),
      productId: parseInt(productId),
      satisfaction,
      likes,
      improvements,
      additionalComments,
      sentiment: sentimentResult.classification,
      sentimentScore: sentimentResult.score,
      timestamp: new Date().toISOString()
    };

    // Read existing feedback
    let feedbackData = [];
    if (fs.existsSync(feedbackPath)) {
      const data = fs.readFileSync(feedbackPath, 'utf8');
      feedbackData = JSON.parse(data);
    }

    // Add new feedback
    feedbackData.push(feedback);

    // Save to file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2));

    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedback: feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting feedback' 
    });
  }
});

module.exports = router;
