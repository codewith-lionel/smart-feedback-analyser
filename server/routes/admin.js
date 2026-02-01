const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const feedbackPath = path.join(__dirname, '../data/feedback.json');
const productsPath = path.join(__dirname, '../data/products.json');

/**
 * GET /api/admin/analytics - Get analytics data for all products
 */
router.get('/analytics', (req, res) => {
  try {
    // Read products and feedback
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    let feedbackData = [];
    
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }

    // Calculate analytics for each product
    const analytics = productsData.map(product => {
      const productFeedback = feedbackData.filter(f => f.productId === product.id);
      
      const total = productFeedback.length;
      const positive = productFeedback.filter(f => f.sentiment === 'positive').length;
      const negative = productFeedback.filter(f => f.sentiment === 'negative').length;
      const neutral = productFeedback.filter(f => f.sentiment === 'neutral').length;
      
      // Calculate average sentiment score
      const avgScore = total > 0 
        ? productFeedback.reduce((sum, f) => sum + f.sentimentScore, 0) / total 
        : 0;
      
      // Calculate positive percentage
      const positivePercentage = total > 0 ? (positive / total) * 100 : 0;

      return {
        productId: product.id,
        productName: product.name,
        totalFeedback: total,
        sentimentCounts: {
          positive,
          negative,
          neutral
        },
        averageSentimentScore: avgScore,
        positivePercentage: positivePercentage
      };
    });

    res.json({
      success: true,
      analytics: analytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting analytics data' 
    });
  }
});

/**
 * GET /api/admin/feedback/:productId - Get all feedback for a specific product
 */
router.get('/feedback/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    
    let feedbackData = [];
    if (fs.existsSync(feedbackPath)) {
      feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }

    const productFeedback = feedbackData.filter(f => f.productId === productId);

    res.json({
      success: true,
      feedback: productFeedback
    });
  } catch (error) {
    console.error('Error getting product feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting feedback data' 
    });
  }
});

module.exports = router;
