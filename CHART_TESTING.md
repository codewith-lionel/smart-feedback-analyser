# 🧪 Chart Testing Script

## Test Plan for Admin Dashboard Charts

### Test 1: Initial Load Test
**Objective**: Verify all 4 charts render correctly on page load

**Steps**:
1. Open http://localhost:3000/admin/dashboard.html
2. Wait for page to fully load
3. Check each chart appears

**Expected Results**:
- ✅ Doughnut chart displays at top center
- ✅ Bar chart displays below (left side)
- ✅ Line chart displays below (right side)
- ✅ Horizontal bar chart displays at bottom
- ✅ No console errors
- ✅ All charts have data

**Status**: ⏳ Pending

---

### Test 2: Data Accuracy Test
**Objective**: Verify charts display correct data

**Test Data**: Current feedback.json has 1 entry:
- Product: Wireless Headphones (ID: 1)
- Score: 100%
- Sentiment: Positive

**Expected Chart Values**:

**Doughnut Chart**:
- Positive: 1
- Neutral: 0
- Negative: 0

**Bar Chart**:
- Wireless Headphones: 1 positive, 0 neutral, 0 negative

**Line Chart**:
- Wireless Headphones: 100% score

**Horizontal Bar Chart**:
- Wireless Headphones: 100% (green bar)

**Status**: ⏳ Pending

---

### Test 3: Multiple Products Test
**Objective**: Test charts with diverse data across multiple products

**Action**: Submit feedback for different products with varying sentiments

**Test Scenarios**:
1. Product 1 (Wireless Headphones): Very Satisfied → 100%
2. Product 2 (Smart Watch): Dissatisfied → Low score
3. Product 3 (Bluetooth Speaker): Satisfied → ~75%
4. Product 4 (Fitness Tracker): Neutral responses → ~50%

**Expected Results**:
- ✅ Doughnut shows distribution across all feedback
- ✅ Bar chart shows all 4 products with their counts
- ✅ Line chart shows 4 data points
- ✅ Horizontal bar ranks products by score (Product 1 at top)

**Status**: ⏳ Pending

---

### Test 4: Auto-Refresh Test
**Objective**: Verify charts update when auto-refresh is enabled

**Steps**:
1. Enable auto-refresh (30 second interval)
2. Open client page in new tab
3. Submit new feedback
4. Wait 30 seconds
5. Check if charts update

**Expected Results**:
- ✅ Charts refresh automatically
- ✅ New data appears without page reload
- ✅ No flickering or errors
- ✅ Smooth transition

**Status**: ⏳ Pending

---

### Test 5: Interactive Elements Test
**Objective**: Test chart interactivity

**Doughnut Chart**:
- [ ] Hover over segments shows tooltip
- [ ] Tooltip displays: Label, Count, Percentage
- [ ] Legend items are visible

**Bar Chart**:
- [ ] Hover shows exact count for each bar
- [ ] Legend toggle works (click to hide/show dataset)
- [ ] Tooltip shows product name and count

**Line Chart**:
- [ ] Hover highlights data point
- [ ] Tooltip shows product name and percentage
- [ ] Line is smooth and curved

**Horizontal Bar Chart**:
- [ ] Hover shows score and status (Excellent/Good/etc.)
- [ ] Bars are color-coded correctly
- [ ] Products sorted by score (highest to lowest)

**Status**: ⏳ Pending

---

### Test 6: Responsive Design Test
**Objective**: Verify charts adapt to different screen sizes

**Desktop (>768px)**:
- [ ] 2-column grid layout
- [ ] Doughnut chart spans full width
- [ ] Other charts in 2 columns

**Mobile (<768px)**:
- [ ] Single column layout
- [ ] All charts stack vertically
- [ ] Charts remain readable
- [ ] Touch interactions work

**Testing Method**: Use browser DevTools responsive mode

**Status**: ⏳ Pending

---

### Test 7: Edge Cases Test

**Empty Data**:
- [ ] Charts handle zero feedback gracefully
- [ ] No errors in console
- [ ] Shows "No data" or empty state

**Single Product**:
- [ ] All charts work with 1 product
- [ ] Line chart shows single point
- [ ] Bar chart shows single group

**Large Dataset**:
- [ ] Charts handle 100+ feedback items
- [ ] Performance remains smooth
- [ ] Labels don't overlap

**Status**: ⏳ Pending

---

### Test 8: Color Coding Test
**Objective**: Verify correct colors are applied

**Color Verification**:
- [ ] Positive = Green (#10b981)
- [ ] Neutral = Amber (#f59e0b)
- [ ] Negative = Red (#ef4444)
- [ ] Line chart = Blue (#2563eb)

**Horizontal Bar Color Coding**:
- [ ] 75-100% = Green
- [ ] 60-74% = Cyan (#0891b2)
- [ ] 40-59% = Amber
- [ ] 0-39% = Red

**Status**: ⏳ Pending

---

### Test 9: Performance Test
**Objective**: Ensure charts render quickly and smoothly

**Metrics to Check**:
- [ ] Initial load time < 1 second
- [ ] Chart render time < 500ms
- [ ] Auto-refresh doesn't cause lag
- [ ] No memory leaks (check DevTools memory tab)
- [ ] Smooth animations

**Status**: ⏳ Pending

---

### Test 10: Browser Compatibility Test
**Objective**: Verify charts work across browsers

**Browsers to Test**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

**Expected**: All charts render identically

**Status**: ⏳ Pending

---

## Automated Test Execution

Run these commands to test the system:

### Check Server Status
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

### Test Analytics API
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/admin/analytics").Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Open Dashboard
```powershell
Start-Process "http://localhost:3000/admin/dashboard.html"
```

### Open Client (for submitting test feedback)
```powershell
Start-Process "http://localhost:3000"
```

---

## Test Results Log

| Test # | Test Name | Status | Pass/Fail | Notes |
|--------|-----------|--------|-----------|-------|
| 1 | Initial Load | ⏳ Pending | - | - |
| 2 | Data Accuracy | ⏳ Pending | - | - |
| 3 | Multiple Products | ⏳ Pending | - | - |
| 4 | Auto-Refresh | ⏳ Pending | - | - |
| 5 | Interactivity | ⏳ Pending | - | - |
| 6 | Responsive | ⏳ Pending | - | - |
| 7 | Edge Cases | ⏳ Pending | - | - |
| 8 | Color Coding | ⏳ Pending | - | - |
| 9 | Performance | ⏳ Pending | - | - |
| 10 | Browser Compat | ⏳ Pending | - | - |

---

## Known Issues to Check

- [ ] Chart.js library loaded correctly
- [ ] Canvas elements have correct IDs
- [ ] Chart instances properly destroyed on refresh
- [ ] No duplicate chart renders
- [ ] Tooltips display correctly formatted data

---

## Quick Visual Test

**Open Developer Tools (F12) and run**:

```javascript
// Check if Chart.js is loaded
console.log('Chart.js version:', Chart.version);

// Check if chart instances exist
console.log('Doughnut chart:', doughnutChart);
console.log('Bar chart:', barChart);
console.log('Line chart:', lineChart);
console.log('Horizontal bar:', horizontalBarChart);

// Check canvas elements
console.log('Canvas elements:', document.querySelectorAll('canvas').length);
```

**Expected Output**: 
- Chart.js version displayed
- 4 chart instances (or null if not yet created)
- 4+ canvas elements found

---

## Test Data Generator

Use this to create diverse test feedback:

### Excellent Feedback (Score ~90%+)
```
Product: Any
Satisfaction: Very Satisfied
Quality: Excellent
Value: Strongly Agree
Recommend: Definitely Yes
Improvements: Nothing - It's Perfect
Usage: Daily
```

### Poor Feedback (Score ~20%-)
```
Product: Any
Satisfaction: Very Dissatisfied
Quality: Poor
Value: Strongly Disagree
Recommend: Definitely Not
Improvements: Durability & Build Quality
Usage: Rarely
```

### Average Feedback (Score ~50%)
```
Product: Any
Satisfaction: Neutral
Quality: Average
Value: Neutral
Recommend: Not Sure
Improvements: Functionality & Features
Usage: Occasionally
```

---

## Troubleshooting Guide

### Issue: Charts not displaying
**Check**:
1. Browser console for errors
2. Chart.js library loaded (`/lib/chart.js`)
3. Canvas elements exist in HTML
4. API returns data

**Fix**: Hard refresh (Ctrl+Shift+R)

### Issue: Charts show wrong data
**Check**:
1. API response in Network tab
2. `feedback.json` file contents
3. Console logs in chart functions

**Fix**: Verify data calculation in `admin.js` route

### Issue: Charts don't update on refresh
**Check**:
1. Auto-refresh is enabled
2. Chart destroy functions are called
3. New Chart() is being called

**Fix**: Check `loadAnalytics()` function calls all chart display functions

### Issue: Charts overlap or look broken
**Check**:
1. CSS grid layout
2. Chart height settings
3. Responsive media queries

**Fix**: Adjust `.charts-container` CSS

---

**Testing Date**: __________  
**Tested By**: __________  
**Overall Result**: ⏳ Pending

