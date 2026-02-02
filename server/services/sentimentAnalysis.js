/**
 * Advanced sentiment analysis algorithm for multiple choice feedback
 * Calculates weighted scores based on question responses
 */

// Scoring weights for each question (out of 100)
const QUESTION_WEIGHTS = {
    satisfaction: 30,  // Most important
    quality: 25,
    value: 20,
    recommend: 15,
    improvements: 10
};

// Score mappings for each question type
const SCORE_MAPS = {
    satisfaction: {
        'Very Satisfied': 100,
        'Satisfied': 75,
        'Neutral': 50,
        'Dissatisfied': 25,
        'Very Dissatisfied': 0
    },
    quality: {
        'Excellent': 100,
        'Good': 75,
        'Average': 50,
        'Below Average': 25,
        'Poor': 0
    },
    value: {
        'Strongly Agree': 100,
        'Agree': 75,
        'Neutral': 50,
        'Disagree': 25,
        'Strongly Disagree': 0
    },
    recommend: {
        'Definitely Yes': 100,
        'Probably Yes': 75,
        'Not Sure': 50,
        'Probably Not': 25,
        'Definitely Not': 0
    },
    improvements: {
        'Nothing - It\'s Perfect': 100,
        'Design & Appearance': 60,
        'Functionality & Features': 50,
        'Durability & Build Quality': 40,
        'Price & Value': 50,
        'Customer Support': 60
    }
};

/**
 * Analyze feedback and calculate sentiment score
 * @param {Object} feedback - Feedback object with multiple choice answers
 * @returns {Object} - Analysis result with score and classification
 */
function analyzeFeedback(feedback) {
    let totalScore = 0;
    let maxScore = 0;
    const breakdown = {};

    // Calculate weighted score for each question
    for (const [question, weight] of Object.entries(QUESTION_WEIGHTS)) {
        if (feedback[question] && SCORE_MAPS[question]) {
            const rawScore = SCORE_MAPS[question][feedback[question]] || 50;
            const weightedScore = (rawScore * weight) / 100;
            
            breakdown[question] = {
                answer: feedback[question],
                rawScore: rawScore,
                weightedScore: weightedScore,
                weight: weight
            };
            
            totalScore += weightedScore;
            maxScore += weight;
        }
    }

    // Calculate final percentage score
    const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 50;
    
    // Normalize to sentiment score (-5 to +5 scale)
    const sentimentScore = ((percentageScore - 50) / 10);
    
    // Classify sentiment
    let classification;
    let category;
    
    if (percentageScore >= 75) {
        classification = 'positive';
        category = 'Highly Positive';
    } else if (percentageScore >= 60) {
        classification = 'positive';
        category = 'Positive';
    } else if (percentageScore >= 40) {
        classification = 'neutral';
        category = 'Neutral';
    } else if (percentageScore >= 25) {
        classification = 'negative';
        category = 'Negative';
    } else {
        classification = 'negative';
        category = 'Highly Negative';
    }

    // Generate insights
    const insights = generateInsights(feedback, breakdown, percentageScore);

    return {
        score: sentimentScore,
        percentageScore: Math.round(percentageScore),
        classification: classification,
        category: category,
        breakdown: breakdown,
        insights: insights,
        totalScore: totalScore,
        maxScore: maxScore
    };
}

/**
 * Generate actionable insights from feedback
 */
function generateInsights(feedback, breakdown, score) {
    const insights = [];

    // Satisfaction insights
    if (feedback.satisfaction) {
        if (['Very Satisfied', 'Satisfied'].includes(feedback.satisfaction)) {
            insights.push('✓ Customer is satisfied with the product');
        } else if (['Dissatisfied', 'Very Dissatisfied'].includes(feedback.satisfaction)) {
            insights.push('⚠ Customer satisfaction needs immediate attention');
        }
    }

    // Quality insights
    if (feedback.quality) {
        if (['Excellent', 'Good'].includes(feedback.quality)) {
            insights.push('✓ Product quality meets expectations');
        } else if (['Below Average', 'Poor'].includes(feedback.quality)) {
            insights.push('⚠ Quality improvement required');
        }
    }

    // Value insights
    if (feedback.value) {
        if (['Strongly Disagree', 'Disagree'].includes(feedback.value)) {
            insights.push('⚠ Pricing strategy needs review');
        } else if (['Strongly Agree', 'Agree'].includes(feedback.value)) {
            insights.push('✓ Good value proposition');
        }
    }

    // Recommendation insights
    if (feedback.recommend) {
        if (['Definitely Yes', 'Probably Yes'].includes(feedback.recommend)) {
            insights.push('✓ High likelihood of word-of-mouth promotion');
        } else if (['Probably Not', 'Definitely Not'].includes(feedback.recommend)) {
            insights.push('⚠ Low recommendation score - critical issue');
        }
    }

    // Improvement insights
    if (feedback.improvements && feedback.improvements !== 'Nothing - It\'s Perfect') {
        insights.push(`→ Focus area: ${feedback.improvements}`);
    }

    // Usage frequency insights
    if (feedback.usage) {
        if (['Daily', 'Several times a week'].includes(feedback.usage)) {
            insights.push('✓ High engagement and product utility');
        } else if (['Rarely'].includes(feedback.usage)) {
            insights.push('⚠ Low usage frequency indicates potential issues');
        }
    }

    // Overall score insights
    if (score >= 80) {
        insights.push('🌟 Excellent feedback - maintain current standards');
    } else if (score < 40) {
        insights.push('🚨 Critical feedback - immediate action required');
    }

    return insights;
}

/**
 * Calculate NPS (Net Promoter Score) from recommendation
 */
function calculateNPS(recommend) {
    const promoters = ['Definitely Yes', 'Probably Yes'];
    const detractors = ['Definitely Not', 'Probably Not'];
    
    if (promoters.includes(recommend)) return 'Promoter';
    if (detractors.includes(recommend)) return 'Detractor';
    return 'Passive';
}

module.exports = {
    analyzeFeedback,
    calculateNPS,
    SCORE_MAPS,
    QUESTION_WEIGHTS
};
