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
      
      // Count by classification (handles both old and new format)
      let positive = 0, negative = 0, neutral = 0;
      let totalScore = 0;
      
      productFeedback.forEach(f => {
        // Check for new format
        if (f.sentimentData && typeof f.sentimentData === 'object') {
          const classification = f.sentimentData.classification;
          if (classification === 'positive') positive++;
          else if (classification === 'negative') negative++;
          else neutral++;
          
          totalScore += f.sentimentData.percentageScore || 0;
        } 
        // Fallback to old format
        else {
          if (f.sentiment === 'positive') positive++;
          else if (f.sentiment === 'negative') negative++;
          else neutral++;
          
          totalScore += (f.sentimentScore || 0) * 10 + 50; // Convert old -5 to +5 scale to percentage
        }
      });
      
      // Calculate average score (percentage 0-100)
      const avgScore = total > 0 ? totalScore / total : 0;
      
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
