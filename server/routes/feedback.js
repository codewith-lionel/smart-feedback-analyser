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
    const { productId, satisfaction, quality, value, recommend, improvements, usage, additionalComments } = req.body;

    // Validate required fields
    if (!productId || !satisfaction || !quality || !value || !recommend || !improvements || !usage) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
      });
    }

    // Perform sentiment analysis with new algorithm
    const sentimentResult = analyzeFeedback({
      satisfaction,
      quality,
      value,
      recommend,
      improvements,
      usage
    });

    // Create feedback entry
    const feedback = {
      id: Date.now(),
      productId: parseInt(productId),
      satisfaction,
      quality,
      value,
      recommend,
      improvements,
      usage,
      additionalComments,
      sentiment: sentimentResult.classification,
      sentimentScore: sentimentResult.score,
      sentimentData: sentimentResult, // Store complete analysis
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
      message: 'Feedback submitted successfully! Thank you for your response.',
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

/**
 * GET /api/feedback - Get all feedback
 */
router.get('/', (req, res) => {
  try {
    let feedbackData = [];
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
    
    res.json({ 
      success: true, 
      feedback: feedbackData
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting feedback' 
    });
  }
});

/**
 * GET /api/feedback/:id - Get a single feedback
 */
router.get('/:id', (req, res) => {
  try {
    const feedbackId = parseInt(req.params.id);
    let feedbackData = [];
    
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
    
    const feedback = feedbackData.find(f => f.id === feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
    }
    
    res.json({ 
      success: true, 
      feedback: feedback
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting feedback' 
    });
  }
});

/**
 * PUT /api/feedback/:id - Update feedback
 */
router.put('/:id', (req, res) => {
  try {
    const feedbackId = parseInt(req.params.id);
    const { satisfaction, quality, value, recommend, improvements, usage, additionalComments } = req.body;
    
    let feedbackData = [];
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
    
    const feedbackIndex = feedbackData.findIndex(f => f.id === feedbackId);
    
    if (feedbackIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
    }
    
    // Update fields
    if (satisfaction) feedbackData[feedbackIndex].satisfaction = satisfaction;
    if (quality) feedbackData[feedbackIndex].quality = quality;
    if (value) feedbackData[feedbackIndex].value = value;
    if (recommend) feedbackData[feedbackIndex].recommend = recommend;
    if (improvements) feedbackData[feedbackIndex].improvements = improvements;
    if (usage) feedbackData[feedbackIndex].usage = usage;
    if (additionalComments !== undefined) feedbackData[feedbackIndex].additionalComments = additionalComments;
    
    // Re-analyze sentiment with updated data
    const sentimentResult = analyzeFeedback({
      satisfaction: feedbackData[feedbackIndex].satisfaction,
      quality: feedbackData[feedbackIndex].quality,
      value: feedbackData[feedbackIndex].value,
      recommend: feedbackData[feedbackIndex].recommend,
      improvements: feedbackData[feedbackIndex].improvements,
      usage: feedbackData[feedbackIndex].usage
    });
    
    feedbackData[feedbackIndex].sentiment = sentimentResult.classification;
    feedbackData[feedbackIndex].sentimentScore = sentimentResult.score;
    feedbackData[feedbackIndex].sentimentData = sentimentResult;
    feedbackData[feedbackIndex].updatedAt = new Date().toISOString();
    
    // Save to file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Feedback updated successfully',
      feedback: feedbackData[feedbackIndex]
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating feedback' 
    });
  }
});

/**
 * DELETE /api/feedback/:id - Delete feedback
 */
router.delete('/:id', (req, res) => {
  try {
    const feedbackId = parseInt(req.params.id);
    
    let feedbackData = [];
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
    
    const feedbackIndex = feedbackData.findIndex(f => f.id === feedbackId);
    
    if (feedbackIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
    }
    
    // Remove feedback
    const deletedFeedback = feedbackData.splice(feedbackIndex, 1)[0];
    
    // Save to file
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Feedback deleted successfully',
      feedback: deletedFeedback
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting feedback' 
    });
  }
});

module.exports = router;
