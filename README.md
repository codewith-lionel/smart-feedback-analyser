# Smart Feedback Analyzer 📊

A simple web-based application for organizations to understand product quality through customer feedback with automatic sentiment analysis.

## 🌟 Features

### Client Side (Customer Interface)
- **Product Display**: View all available products with descriptions
- **Feedback Submission**: Submit feedback by answering 4 fixed questions:
  1. How satisfied are you with the product?
  2. What do you like about the product?
  3. What should be improved?
  4. Any additional comments?
- **User-Friendly Interface**: Clean, modern design with form validation
- **Success Messages**: Confirmation after successful submission

### Admin Side (Dashboard)
- **Automatic Sentiment Analysis**: Analyze feedback using NLP (Positive, Negative, Neutral)
- **Statistics Overview**: Total feedback count and sentiment distribution
- **Visual Analytics**:
  - Pie Charts: Sentiment distribution for each product
  - Bar Chart: Product comparison based on feedback
- **Performance Badges**: Quick visual indicators of product performance
- **Real-time Updates**: Refresh button to get latest analytics

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Charts**: Chart.js
- **Sentiment Analysis**: Sentiment library (pre-trained NLP)
- **Data Storage**: JSON files (products.json, feedback.json)

## 📁 Project Structure

```
smart-feedback-analyser/
├── public/
│   ├── client/
│   │   ├── index.html      # Product listing & feedback form
│   │   ├── style.css       # Client-side styles
│   │   └── script.js       # Client-side logic
│   └── admin/
│       ├── dashboard.html  # Admin dashboard with charts
│       ├── style.css       # Dashboard styles
│       └── script.js       # Dashboard logic & charts
├── server/
│   ├── server.js           # Express server
│   ├── routes/
│   │   ├── feedback.js     # Feedback submission endpoints
│   │   └── admin.js        # Admin analytics endpoints
│   ├── services/
│   │   └── sentimentAnalysis.js  # Sentiment analysis logic
│   └── data/
│       ├── products.json   # Sample products
│       └── feedback.json   # Stored feedback
├── package.json
├── README.md
└── .gitignore
```

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

### Get All Products
```
GET /api/products
Response: { success: true, products: [...] }
```

### Submit Feedback
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

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
