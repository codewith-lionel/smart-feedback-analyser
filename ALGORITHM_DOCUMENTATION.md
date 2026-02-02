# Smart Feedback Analyzer - Scoring Algorithm Documentation

## 📊 Overview

The Smart Feedback Analyzer uses an advanced weighted scoring algorithm to analyze structured multiple-choice feedback responses. This algorithm provides quantitative metrics, actionable insights, and performance classifications based on customer responses.

## 🎯 Algorithm Design

### Core Principles

1. **Weighted Scoring**: Different aspects of feedback carry different weights based on their business impact
2. **Normalization**: All scores are normalized to a 0-100% scale for consistency
3. **Classification**: Scores are automatically classified into performance categories
4. **Insight Generation**: AI-powered insights are generated based on response patterns

## 📐 Scoring System

### Question Weights (Total: 100%)

```javascript
{
    satisfaction: 30%,  // Overall satisfaction - most critical
    quality: 25%,       // Product quality assessment
    value: 20%,         // Value for money perception
    recommend: 15%,     // Likelihood to recommend
    improvements: 10%   // Areas needing attention
}
```

**Rationale:**
- **Satisfaction (30%)**: Primary indicator of customer happiness
- **Quality (25%)**: Core product performance measure
- **Value (20%)**: Price-to-quality ratio assessment
- **Recommendation (15%)**: Word-of-mouth potential
- **Improvements (10%)**: Specific pain point identification

### Score Mapping

Each answer option is mapped to a raw score (0-100):

#### 1. Overall Satisfaction
```javascript
'Very Satisfied'      → 100
'Satisfied'           → 75
'Neutral'             → 50
'Dissatisfied'        → 25
'Very Dissatisfied'   → 0
```

#### 2. Product Quality
```javascript
'Excellent'           → 100
'Good'                → 75
'Average'             → 50
'Below Average'       → 25
'Poor'                → 0
```

#### 3. Value for Money
```javascript
'Strongly Agree'      → 100
'Agree'               → 75
'Neutral'             → 50
'Disagree'            → 25
'Strongly Disagree'   → 0
```

#### 4. Recommendation Likelihood
```javascript
'Definitely Yes'      → 100
'Probably Yes'        → 75
'Not Sure'            → 50
'Probably Not'        → 25
'Definitely Not'      → 0
```

#### 5. Primary Improvement Area
```javascript
'Nothing - It\'s Perfect'           → 100
'Design & Appearance'               → 60
'Customer Support'                  → 60
'Functionality & Features'          → 50
'Price & Value'                     → 50
'Durability & Build Quality'        → 40
```

*Note: Lower scores for improvement areas indicate higher priority issues*

#### 6. Usage Frequency
```javascript
'Daily'                            → Not scored (used for insights)
'Several times a week'             → Not scored (used for insights)
'Once a week'                      → Not scored (used for insights)
'Occasionally'                     → Not scored (used for insights)
'Rarely'                           → Not scored (used for insights)
```

*Usage frequency contributes to qualitative insights but not the quantitative score*

## 🧮 Calculation Process

### Step 1: Raw Score Calculation
For each question:
```
Raw Score = Score Mapping Value (0-100)
```

### Step 2: Weighted Score Calculation
For each question:
```
Weighted Score = (Raw Score × Question Weight) / 100
```

### Step 3: Total Score Aggregation
```
Total Score = Sum of all Weighted Scores
Max Score = Sum of all Weights = 100
```

### Step 4: Percentage Score
```
Percentage Score = (Total Score / Max Score) × 100
```

### Step 5: Sentiment Score (Legacy Compatibility)
```
Sentiment Score = ((Percentage Score - 50) / 10)
Range: -5 to +5
```

## 📊 Classification System

### Performance Categories

| Percentage Score | Classification | Category | Badge Color |
|-----------------|---------------|----------|-------------|
| 75% - 100% | Positive | Highly Positive | Green |
| 60% - 74% | Positive | Positive | Light Green |
| 40% - 59% | Neutral | Neutral | Yellow/Amber |
| 25% - 39% | Negative | Negative | Orange |
| 0% - 24% | Negative | Highly Negative | Red |

## 💡 Insight Generation

### Automatic Insights

The algorithm generates actionable insights based on response patterns:

#### Satisfaction Insights
- **High**: "✓ Customer is satisfied with the product"
- **Low**: "⚠ Customer satisfaction needs immediate attention"

#### Quality Insights
- **High**: "✓ Product quality meets expectations"
- **Low**: "⚠ Quality improvement required"

#### Value Insights
- **Low**: "⚠ Pricing strategy needs review"
- **High**: "✓ Good value proposition"

#### Recommendation Insights
- **High**: "✓ High likelihood of word-of-mouth promotion"
- **Low**: "⚠ Low recommendation score - critical issue"

#### Improvement Focus
- Identifies the specific area requiring attention
- Example: "→ Focus area: Functionality & Features"

#### Usage Frequency Insights
- **High**: "✓ High engagement and product utility"
- **Low**: "⚠ Low usage frequency indicates potential issues"

#### Overall Performance
- **≥80%**: "🌟 Excellent feedback - maintain current standards"
- **<40%**: "🚨 Critical feedback - immediate action required"

## 📈 Example Calculation

### Sample Feedback Response

```javascript
{
  satisfaction: "Satisfied",           // Raw: 75
  quality: "Good",                     // Raw: 75
  value: "Agree",                      // Raw: 75
  recommend: "Probably Yes",           // Raw: 75
  improvements: "Price & Value",       // Raw: 50
  usage: "Daily"                       // Not scored
}
```

### Calculation Breakdown

| Question | Raw Score | Weight | Weighted Score |
|----------|-----------|--------|----------------|
| Satisfaction | 75 | 30% | 22.5 |
| Quality | 75 | 25% | 18.75 |
| Value | 75 | 20% | 15.0 |
| Recommend | 75 | 15% | 11.25 |
| Improvements | 50 | 10% | 5.0 |
| **Total** | - | **100%** | **72.5** |

### Final Results

- **Percentage Score**: 72.5%
- **Classification**: Positive
- **Category**: Positive
- **Sentiment Score**: 2.25 (on -5 to +5 scale)

### Generated Insights

1. ✓ Customer is satisfied with the product
2. ✓ Product quality meets expectations
3. ✓ Good value proposition
4. ✓ High likelihood of word-of-mouth promotion
5. → Focus area: Price & Value
6. ✓ High engagement and product utility

## 🔄 NPS (Net Promoter Score) Calculation

While not part of the main score, the system also classifies customers by NPS:

```javascript
'Definitely Yes', 'Probably Yes'     → Promoter
'Not Sure'                           → Passive
'Probably Not', 'Definitely Not'     → Detractor
```

**NPS Formula:**
```
NPS = % Promoters - % Detractors
Range: -100 to +100
```

## 📦 Data Structure

### Stored Feedback Object

```javascript
{
  id: 1234567890,
  productId: 1,
  satisfaction: "Satisfied",
  quality: "Good",
  value: "Agree",
  recommend: "Probably Yes",
  improvements: "Price & Value",
  usage: "Daily",
  additionalComments: "Great product overall!",
  sentiment: "positive",
  sentimentScore: 2.25,
  sentimentData: {
    score: 2.25,
    percentageScore: 72,
    classification: "positive",
    category: "Positive",
    breakdown: {
      satisfaction: {
        answer: "Satisfied",
        rawScore: 75,
        weightedScore: 22.5,
        weight: 30
      },
      // ... other questions
    },
    insights: [
      "✓ Customer is satisfied with the product",
      // ... other insights
    ],
    totalScore: 72.5,
    maxScore: 100
  },
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Visual Representation

### Admin Dashboard Display

1. **Score Badge**: Color-coded percentage (e.g., "72%")
2. **Category Label**: Classification text (e.g., "Positive")
3. **Progress Bars**: Visual representation of sentiment distribution
4. **Pie Charts**: Sentiment breakdown per product
5. **Insights Panel**: Actionable recommendations list
6. **Average Score**: Product-level aggregation

## 🔧 Customization Options

### Adjusting Weights

To change question importance, modify `QUESTION_WEIGHTS` in `server/services/sentimentAnalysis.js`:

```javascript
const QUESTION_WEIGHTS = {
    satisfaction: 30,  // Increase for more emphasis
    quality: 25,
    value: 20,
    recommend: 15,
    improvements: 10
};
```

### Modifying Score Mappings

Update `SCORE_MAPS` to change answer values:

```javascript
const SCORE_MAPS = {
    satisfaction: {
        'Very Satisfied': 100,
        'Satisfied': 80,  // Changed from 75
        // ...
    }
};
```

### Adjusting Classifications

Modify thresholds in the `analyzeFeedback` function:

```javascript
if (percentageScore >= 80) {  // Changed from 75
    classification = 'positive';
    category = 'Highly Positive';
}
```

## 📊 Aggregation & Analytics

### Product-Level Metrics

```javascript
{
  productId: 1,
  productName: "Smartphone X",
  totalFeedback: 25,
  sentimentCounts: {
    positive: 18,
    neutral: 5,
    negative: 2
  },
  averageSentimentScore: 68.5,  // Average percentage
  positivePercentage: 72.0
}
```

### Calculation:

```
Average Score = Sum(all feedback scores) / Total feedback count
Positive % = (Positive count / Total count) × 100
```

## 🚀 Best Practices

1. **Regularly Review Weights**: Adjust based on business priorities
2. **Monitor Insights**: Act on recurring negative patterns
3. **Track Trends**: Compare scores over time
4. **Segment Analysis**: Analyze by product, time period, or customer segment
5. **Feedback Loop**: Use insights to improve products and services

## 🔍 Troubleshooting

### Common Issues

1. **Low Scores Despite Good Reviews**: Check if weights align with business goals
2. **Too Many Neutral Classifications**: Adjust threshold boundaries
3. **Insights Not Helpful**: Review and update insight generation logic
4. **Score Inflation/Deflation**: Verify score mapping values are appropriate

## 📚 References

- Algorithm Implementation: `server/services/sentimentAnalysis.js`
- Feedback Storage: `server/routes/feedback.js`
- Analytics Aggregation: `server/routes/admin.js`
- UI Display Logic: `public/admin/script.js`

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainer**: Smart Feedback Analyzer Team
