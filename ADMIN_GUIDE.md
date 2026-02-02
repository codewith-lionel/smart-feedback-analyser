# Admin Panel User Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Navigation](#navigation)
3. [Dashboard Page](#dashboard-page)
4. [Products Management](#products-management)
5. [Feedback Management](#feedback-management)
6. [Tips & Best Practices](#tips--best-practices)

---

## 🎯 Overview

The Smart Feedback Analyzer Admin Panel is divided into three main pages, each designed for specific management tasks:

- **📊 Dashboard**: Analytics overview and performance metrics
- **📦 Products**: Product catalog management
- **💬 Feedback**: Customer feedback review and management

### Accessing the Admin Panel

Visit: `http://localhost:3000/admin/dashboard.html`

---

## 🧭 Navigation

The navigation bar is consistent across all admin pages with four main links:

| Icon | Link | Purpose |
|------|------|---------|
| 📊 | **Dashboard** | View analytics and performance metrics |
| 📦 | **Products** | Manage product catalog |
| 💬 | **Feedback** | Review and manage customer feedback |
| 🏠 | **Client View** | See the customer-facing interface |

The active page is highlighted in blue.

---

## 📊 Dashboard Page

**Location**: `/admin/dashboard.html`

### Purpose
The Dashboard provides a comprehensive overview of all products' performance with automatic sentiment analysis and visual charts.

### Features

#### 1. Auto-Refresh Controls
- **Enable/Disable**: Toggle checkbox to activate automatic data refresh
- **Refresh Interval**: Choose from 15s, 30s, 1m, 2m, or 5m
- **Last Updated**: Shows timestamp of last data fetch

#### 2. Quick Action Cards
Three clickable cards for fast navigation:
- **Manage Products**: Jump to products page
- **View Feedback**: Jump to feedback page
- **Client View**: See customer interface

#### 3. Statistics Overview
Four key metrics displayed in cards:
- **Total Feedback**: Total number of responses received
- **Positive**: Count of positive feedback (green)
- **Neutral**: Count of neutral feedback (amber)
- **Negative**: Count of negative feedback (red)

Each card animates with a counting effect when loaded.

#### 4. Product Performance Comparison
- **Bar Chart**: Visual comparison of all products
- Shows positive feedback percentage for each product
- Color-coded bars (green = high, amber = medium, red = low)

#### 5. Individual Product Analysis Cards
Each product gets its own detailed card showing:

**Header Section:**
- Product name
- Total feedback count

**Average Score:**
- Large percentage display (0-100%)
- Color-coded background
  - Blue gradient for good scores (≥75%)
  - Yellow for neutral (40-74%)
  - Red for concerning (<40%)

**Sentiment Distribution:**
- Three boxes: Positive, Neutral, Negative
- Count and percentage for each
- Color-coded indicators

**Progress Bars:**
- Animated horizontal bars
- Visual representation of sentiment breakdown

**Pie Chart:**
- Interactive Chart.js visualization
- Hover to see exact counts
- Color-coded segments

**Performance Badge:**
- Quick status indicator:
  - 🌟 **Excellent** (≥80%)
  - 😊 **Good** (60-79%)
  - 😐 **Needs Attention** (40-59%)
  - ⚠️ **Critical** (<40%)

### Loading States
- Spinner animation when fetching data
- Smooth fade-in animations for all elements
- Staggered card animations (each card appears with a slight delay)

---

## 📦 Products Management

**Location**: `/admin/products.html`

### Purpose
Manage your product catalog - add, edit, or remove products from the system.

### Page Layout

#### Header Section
- **Title**: "Products Management"
- **Description**: Brief explanation of page purpose
- **Action Buttons**:
  - `➕ Add New Product`: Opens creation modal
  - `🔄 Refresh`: Reloads product list

#### Statistics Mini Cards
Three quick stats:
- **Total Products**: Count of all products
- **With Feedback**: Products that have received feedback
- **No Feedback Yet**: Products without feedback

#### Products Table

**Columns:**
1. **ID**: Unique product identifier
2. **Icon**: Product emoji/icon (large display)
3. **Product Name**: Product title
4. **Description**: Product details
5. **Feedback Count**: Number of feedback items with badge
6. **Avg Score**: Average percentage score or "N/A"
7. **Actions**: Edit and Delete buttons

**Features:**
- Responsive table with horizontal scroll on small screens
- Animated row appearance (staggered)
- Color-coded average scores
- Empty state message when no products exist

### Adding a New Product

1. Click **"➕ Add New Product"** button
2. Modal appears with form fields:
   - **Product Name** (required)
   - **Description** (required)
   - **Icon/Emoji** (optional, defaults to 📦)
3. Fill in details
4. Click **"Save Product"**
5. Success notification appears
6. Product added to table

**Validation:**
- Name and description are required
- Emoji limited to 2 characters
- Real-time error messages

### Editing a Product

1. Click **✏️ Edit** button on product row
2. Modal opens pre-filled with product data
3. Modify desired fields
4. Click **"Save Product"**
5. Changes saved and table refreshes

### Deleting a Product

1. Click **🗑️ Delete** button on product row
2. Confirmation dialog appears with warning:
   - Shows product name
   - Warns about feedback deletion
   - Shows count of feedback items that will be deleted
3. Confirm or cancel
4. If confirmed:
   - Product removed
   - All associated feedback deleted
   - Success notification shown
   - Table refreshed

**⚠️ Warning**: Deleting a product is permanent and removes all associated feedback data.

---

## 💬 Feedback Management

**Location**: `/admin/feedbacks.html`

### Purpose
Review, analyze, edit, and manage customer feedback responses.

### Page Layout

#### Header Section
- **Title**: "Feedback Management"
- **Description**: "View, edit, and analyze customer feedback responses"
- **Filter Controls**:
  - Product dropdown (filter by product)
  - Sentiment dropdown (Positive, Neutral, Negative)
  - Refresh button

#### Statistics Mini Cards
Four metrics with color-coded cards:
- **Total Feedback**: All feedback count
- **Positive**: Positive feedback count (green card)
- **Neutral**: Neutral feedback count (yellow card)
- **Negative**: Negative feedback count (red card)

#### Feedback Table

**Columns:**
1. **ID**: Feedback identifier
2. **Product**: Associated product name
3. **Satisfaction**: Overall satisfaction level
4. **Score**: Percentage score with large font
5. **Sentiment**: Badge with category (Positive/Neutral/Negative)
6. **Date**: Submission date
7. **Actions**: View, Edit, Delete buttons

**Features:**
- Real-time filtering
- Animated rows
- Color-coded sentiment badges
- Responsive layout

### Filtering Feedback

#### By Product
1. Click **"All Products"** dropdown
2. Select specific product
3. Table updates instantly showing only that product's feedback

#### By Sentiment
1. Click **"All Sentiments"** dropdown
2. Select Positive, Neutral, or Negative
3. Table filters to show only matching feedback

#### Combined Filters
- Both filters work together
- Example: Show only "Smartphone X" + "Positive" feedback
- Clear by selecting "All" in dropdowns

### Viewing Feedback Details

1. Click **👁️ View** button on feedback row
2. Large modal opens with two-column layout:

#### Left Column: Response Data
All answers displayed in form fields (disabled):
- Overall Satisfaction
- Product Quality
- Value for Money
- Would Recommend?
- Primary Improvement Area
- Usage Frequency
- Additional Comments

#### Right Column: AI Analysis

**Score Display:**
- Large percentage badge
- Category label (Highly Positive, Positive, etc.)
- Color-coded background

**Score Breakdown:**
- Each question's contribution shown
- Answer selected
- Raw score out of 100
- Visual cards with left border

**💡 Insights Section:**
- AI-generated actionable insights
- Bullet points with emojis:
  - ✓ Positive indicators
  - ⚠ Warning signs
  - → Focus areas
  - 🌟 Exceptional feedback
  - 🚨 Critical issues

**📋 Metadata:**
- Product name
- Submission timestamp
- Update timestamp (if edited)
- Feedback ID

### Editing Feedback

1. Click **✏️ Edit** button
2. Modal opens with same layout as View
3. Form fields are now **enabled** for editing
4. Modify any dropdown or text area
5. Click **"Save Changes"**
6. System recalculates:
   - Sentiment score
   - Classification
   - Insights
7. Success notification appears
8. Table refreshes with new data

**Note**: Editing feedback triggers a complete re-analysis using the scoring algorithm.

### Deleting Feedback

1. Click **🗑️ Delete** button
2. Confirmation dialog: "Are you sure you want to delete this feedback? This action cannot be undone."
3. Confirm or cancel
4. If confirmed:
   - Feedback permanently removed
   - Analytics automatically updated
   - Success notification shown
   - Table refreshed

---

## 💡 Tips & Best Practices

### Dashboard Usage

1. **Enable Auto-Refresh** when monitoring live feedback during events or campaigns
2. **Use 30s interval** for balanced performance and freshness
3. **Disable Auto-Refresh** when reviewing detailed analytics to avoid interruptions
4. Check the **"Last Updated"** timestamp to know data freshness

### Product Management

1. **Use descriptive names**: Make products easily identifiable
2. **Add clear descriptions**: Help customers understand what they're rating
3. **Choose relevant emojis**: Visual icons improve user experience
4. **Review feedback count** before deleting products
5. **Export data** (if feature available) before major deletions

### Feedback Management

1. **Filter by product** to analyze product-specific issues
2. **Filter by sentiment** to prioritize critical feedback (negative)
3. **Read AI insights carefully** - they highlight actionable points
4. **Check score breakdown** to understand specific problem areas
5. **Monitor improvement areas** to identify patterns
6. **Review usage frequency** alongside satisfaction for context

### Performance Optimization

1. **Use filters** instead of scrolling through large tables
2. **Let animations complete** before performing multiple actions
3. **Close modals** after viewing to keep interface clean
4. **Refresh strategically** - not every few seconds

### Data Analysis Workflow

**Weekly Review Process:**
1. Open Dashboard to see overall trends
2. Identify products with declining scores
3. Navigate to Feedback page
4. Filter by problematic product + negative sentiment
5. Read AI insights for common themes
6. Document action items
7. Return to Dashboard after improvements to track changes

**Crisis Response:**
1. Set auto-refresh to 15s
2. Monitor negative feedback in real-time
3. Review detailed feedback immediately
4. Identify critical issues from insights
5. Take corrective action
6. Follow up by tracking sentiment shift

### Common Questions

**Q: Can I undo a deletion?**
A: No, deletions are permanent. Always confirm before deleting.

**Q: How is the score calculated?**
A: See [ALGORITHM_DOCUMENTATION.md](ALGORITHM_DOCUMENTATION.md) for detailed explanation.

**Q: Why is my average score different from sentiment count?**
A: Average score uses the 0-100% scale from the algorithm. Sentiment counts classify based on thresholds (≥75% = Positive, etc.).

**Q: Can I export data?**
A: Currently, data is stored in JSON files. Check `server/data/` directory for raw data.

**Q: What if feedback is submitted while I'm viewing it?**
A: Use the Refresh button or enable auto-refresh to see new submissions.

**Q: Can I edit the scoring algorithm?**
A: Yes, see [ALGORITHM_DOCUMENTATION.md](ALGORITHM_DOCUMENTATION.md) section "Customization Options".

---

## 🎨 UI Color Guide

### Sentiment Colors
- **Positive**: Green (#10b981)
- **Neutral**: Amber (#f59e0b)
- **Negative**: Red (#ef4444)

### Action Colors
- **Primary** (View): Blue (#2563eb)
- **Success** (Save): Green (#10b981)
- **Warning** (Edit): Amber (#f59e0b)
- **Danger** (Delete): Red (#ef4444)
- **Secondary** (Cancel): Gray (#64748b)

### Score Ranges
- **75-100%**: Dark Blue (#1e40af) - Excellent
- **40-74%**: Cyan (#0891b2) - Neutral
- **0-39%**: Red (#ef4444) - Needs Attention

---

## 🔒 Security Notes

- Admin panel has no authentication (add if deploying publicly)
- Direct file system access (JSON files)
- No audit logging currently implemented
- Consider adding user roles for team environments

---

## 📞 Support & Troubleshooting

### Common Issues

**Server not responding:**
- Check if server is running: `npm start`
- Verify port 3000 is available
- Check console for errors

**Data not loading:**
- Check `server/data/` directory exists
- Verify `products.json` and `feedback.json` files are valid JSON
- Refresh browser cache

**Charts not displaying:**
- Ensure Chart.js library loaded: check `/public/lib/chart.js`
- Check browser console for JavaScript errors
- Try different browser

**Modals not opening:**
- Check for JavaScript errors in console
- Ensure proper event handlers attached
- Clear browser cache and reload

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Documentation**: Smart Feedback Analyzer Team
