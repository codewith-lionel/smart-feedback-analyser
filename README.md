# Smart Feedback Analyzer 📊

A modern web-based application for organizations to understand product quality through structured customer feedback with intelligent algorithmic analysis.

## 🌟 Features

### Client Side (Customer Interface)
- **Product Display**: View all available products with descriptions and icons
- **Structured Feedback Form**: Submit feedback through 6 multiple-choice questions:
  1. **Overall Satisfaction**: Very Satisfied to Very Dissatisfied (5 levels)
  2. **Product Quality**: Excellent to Poor (5 levels)
  3. **Value for Money**: Strongly Agree to Strongly Disagree (5 levels)
  4. **Recommendation Likelihood**: Definitely Yes to Definitely Not (5 levels)
  5. **Primary Improvement Area**: 6 specific categories
  6. **Usage Frequency**: Daily to Rarely (5 levels)
  7. **Additional Comments**: Optional open-ended text field
- **Modern UI**: Professional navy blue color scheme with glassmorphism effects
- **Smooth Animations**: Enhanced user experience with transitions and effects
- **Form Validation**: Real-time validation ensures all required fields are completed

### Admin Side (Dashboard)
- **Advanced Scoring Algorithm**: 
  - Weighted scoring system (0-100% scale)
  - Satisfaction: 30%, Quality: 25%, Value: 20%, Recommend: 15%, Improvements: 10%
  - Automatic classification: Highly Positive, Positive, Neutral, Negative, Highly Negative
- **AI-Generated Insights**: 
  - Actionable recommendations based on feedback patterns
  - Critical issue identification
  - Performance highlights
- **Dynamic Real-Time Updates**:
  - Auto-refresh with configurable intervals (15s, 30s, 1m, 2m, 5m)
  - Live loading indicators and progress bars
  - Animated statistics counters
  - Toast notifications for all actions
  - "Last updated" timestamp display
- **Complete CRUD Operations**:
  - Products: Create, read, update, delete
  - Feedback: View, edit, delete with detailed modals
- **Visual Analytics**:
  - Pie Charts: Sentiment distribution per product
  - Bar Chart: Comparative product performance
  - Progress Bars: Visual score representation
  - Staggered card animations
- **Performance Metrics**: Color-coded badges and percentage scores

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Data Visualization**: Chart.js
- **Analysis Engine**: Custom weighted scoring algorithm
- **Data Storage**: JSON file system (products.json, feedback.json)
- **Design Pattern**: Glassmorphism with professional navy/blue color scheme

## 📁 Project Structure

```
smart-feedback-analyser/
├── public/
│   ├── client/
│   │   ├── index.html      # Customer feedback form with multiple choice
│   │   ├── style.css       # Modern professional styling
│   │   └── script.js       # Form handling and submission
│   ├── admin/
│   │   ├── dashboard.html  # Dynamic admin dashboard
│   │   ├── style.css       # Admin panel styling with animations
│   │   └── script.js       # Real-time updates, CRUD operations, charts
│   └── lib/
│       └── chart.js        # Chart.js library
├── server/
│   ├── server.js           # Express server configuration
│   ├── routes/
│   │   ├── feedback.js     # Feedback CRUD endpoints
│   │   ├── products.js     # Product management endpoints
│   │   └── admin.js        # Analytics aggregation endpoints
│   ├── services/
│   │   └── sentimentAnalysis.js  # Weighted scoring algorithm
│   └── data/
│       ├── products.json   # Product database
│       └── feedback.json   # Feedback storage with full analysis
├── package.json
├── README.md
└── .gitignore
```

## 🧮 Scoring Algorithm

### Question Weights
- **Satisfaction**: 30% (Most critical indicator)
- **Quality**: 25% (Product performance)
- **Value**: 20% (Price perception)
- **Recommend**: 15% (Word-of-mouth potential)
- **Improvements**: 10% (Areas needing attention)

### Score Mappings
Each answer receives a raw score (0-100):
- **5-level scales**: 100, 75, 50, 25, 0
- **Improvement areas**: 100 (Perfect), 60-40 (Specific areas)

### Final Calculation
1. Raw score × Weight for each question
2. Sum all weighted scores
3. Convert to percentage (0-100%)
4. Classify: ≥75% Positive, 40-75% Neutral, <40% Negative

### Insights Generation
- Satisfaction alerts
- Quality flags
- Value proposition assessment
- Recommendation analysis
- Improvement area identification
- Usage frequency insights

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-feedback-analyser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Client Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## 📡 API Documentation

### Products API

#### Get All Products
```
GET /api/products
Response: { success: true, products: [...] }
```

#### Create Product
```
POST /api/products
Body: { name, description, image }
Response: { success: true, message, product }
```

#### Update Product
```
PUT /api/products/:id
Body: { name, description, image }
Response: { success: true, message, product }
```

#### Delete Product
```
DELETE /api/products/:id
Response: { success: true, message }
```

### Feedback API

#### Submit Feedback
```
POST /api/feedback
Body: {
  productId: number,
  satisfaction: string,
  likes: string,
  improvements: string,
  additionalComments: string
}
Response: { success: true, message: "Feedback submitted successfully" }
```

### Get Analytics Data
```
GET /api/admin/analytics
Response: {
  success: true,
  analytics: [
    {
      productId: number,
      productName: string,
      totalFeedback: number,
      sentimentCounts: {
        positive: number,
        negative: number,
        neutral: number
      },
      averageSentimentScore: number,
      positivePercentage: number
    },
    ...
  ]
}
```

### Get Product Feedback
```
GET /api/admin/feedback/:productId
Response: { success: true, feedback: [...] }
```

## 🎨 Features in Detail

### Sentiment Analysis
- Analyzes all text responses from the 4 feedback questions
- Uses the `sentiment` library for NLP-based classification
- Classification thresholds:
  - **Positive**: score > 0.1
  - **Negative**: score < -0.1
  - **Neutral**: score between -0.1 and 0.1

### Visualization
- **Pie Charts**: Show sentiment distribution for each product (Green for Positive, Red for Negative, Yellow for Neutral)
- **Bar Chart**: Compare all products based on sentiment counts
- **Performance Badges**:
  - ⭐ Excellent (70%+ positive)
  - 👍 Good (50-69% positive)
  - 😐 Fair (30-49% positive)
  - ⚠️ Needs Improvement (<30% positive)

### Sample Products
The application comes with 5 pre-configured products:
1. Wireless Headphones 🎧
2. Smart Watch ⌚
3. Bluetooth Speaker 🔊
4. Fitness Tracker 📱
5. Laptop Stand 💻

## ✅ Success Criteria

- ✅ Customers can view products and submit feedback easily
- ✅ Feedback is automatically analyzed for sentiment
- ✅ Admin dashboard displays accurate statistics
- ✅ Charts clearly visualize product performance
- ✅ Positive feedback results in higher visualization scores
- ✅ Simple, clean code without complex ML implementation
- ✅ Project runs out of the box after `npm install` and `npm start`

## 🎯 Usage

### For Customers
1. Visit the homepage (http://localhost:3000)
2. Browse available products
3. Click "Give Feedback" on any product
4. Fill out the 4-question feedback form
5. Submit and receive confirmation

### For Administrators
1. Visit the admin dashboard (http://localhost:3000/admin)
2. View overall statistics at the top
3. Analyze the bar chart for product comparison
4. Review individual product pie charts for detailed sentiment distribution
5. Click "Refresh Data" to update analytics

## 📝 Notes

- This is a prototype focused on clarity and usability
- No authentication required
- Data is stored in JSON files (not production-ready for scale)
- Sentiment analysis uses a simple, pre-trained model
- All feedback is automatically analyzed upon submission

### Production Considerations

For production deployment, consider adding:
- Rate limiting on API endpoints to prevent abuse
- Input validation and sanitization
- Database instead of JSON file storage (e.g., MongoDB, PostgreSQL)
- User authentication and authorization
- Error logging and monitoring
- Environment-based configuration
- HTTPS/SSL certificates

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
