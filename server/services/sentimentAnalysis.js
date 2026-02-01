const Sentiment = require('sentiment');
const sentiment = new Sentiment();

/**
 * Analyze the sentiment of feedback text
 * @param {Object} feedbackData - Object containing feedback responses
 * @returns {Object} - Sentiment analysis result with score and classification
 */
function analyzeFeedback(feedbackData) {
  // Combine all text responses for analysis
  const textToAnalyze = [
    feedbackData.satisfaction || '',
    feedbackData.likes || '',
    feedbackData.improvements || '',
    feedbackData.additionalComments || ''
  ].join(' ');

  // Perform sentiment analysis
  const result = sentiment.analyze(textToAnalyze);
  
  // Calculate comparative score (normalized by word count)
  const score = result.comparative;
  
  // Classify sentiment based on threshold
  let classification;
  if (score > 0.1) {
    classification = 'positive';
  } else if (score < -0.1) {
    classification = 'negative';
  } else {
    classification = 'neutral';
  }

  return {
    score: score,
    classification: classification,
    details: {
      positiveWords: result.positive,
      negativeWords: result.negative,
      rawScore: result.score
    }
  };
}

module.exports = {
  analyzeFeedback
};
