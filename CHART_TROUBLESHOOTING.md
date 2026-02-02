# 🔧 Chart Troubleshooting Guide

## ✅ Verifiedworking Components

1. **✓ Chart.js Library**: v4.5.1 loaded (208KB)
2. **✓ API Endpoint**: Returns valid data
3. **✓ Data Available**: 2 products with 3 total feedback entries
4. **✓ Canvas Elements**: 4 canvas tags in HTML
5. **✓ Chart Functions**: All 4 functions correctly implemented
6. **✓ CSS Styling**: Grid layout and styling applied

## 📊 Current Data

- **Product 1 (knkk)**: 2 feedback → 86.5% avg → 2 Positive
- **Product 2 (k,j)**: 1 feedback → 45% avg → 1 Neutral

**Expected Charts:**
- Doughnut: 2 Positive (green), 1 Neutral (amber), 0 Negative
- Bar Chart: 2 products with colored bars
- Line Chart: 2 data points (87%, 45%)
- Horizontal Bar: 2 horizontal bars (green and amber)

## 🔍 If Charts Are Empty

### Step 1: Hard Refresh Browser
**Windows**: `Ctrl + Shift + R`  
**Mac**: `Cmd + Shift + R`

This clears cached JavaScript files.

### Step 2: Clear Browser Cache
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

### Step 3: Check Browser Console
1. Press `F12`
2. Click "Console" tab
3. Look for RED error messages

**Common Errors:**
- `Chart is not defined` → Chart.js not loaded
- `Cannot read property 'getContext' of null` → Canvas not found
- `Unexpected token` → JavaScript syntax error

### Step 4: Verify Chart.js Loaded
In Browser Console, type:
```javascript
typeof Chart
```
**Expected**: Should return `"function"`  
**If "undefined"**: Chart.js failed to load

### Step 5: Check Canvas Elements
In Browser Console, type:
```javascript
document.querySelectorAll('canvas').length
```
**Expected**: Should return `4` or more  
**If less**: Canvas elements missing from HTML

### Step 6: Test Individual Chart
In Browser Console, run:
```javascript
const canvas = document.getElementById('doughnutChart');
console.log('Canvas:', canvas);
if (canvas) {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Test'],
            datasets: [{
                data: [1],
                backgroundColor: ['red']
            }]
        }
    });
}
```

If this shows a chart, the library works.

## 🛠️ Manual Fix Commands

### Restart Server
```powershell
cd "d:\Projects\aparna\smart-feedback-analyser"
# Press Ctrl+C if server running
npm start
```

### Verify API
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/admin/analytics" -UseBasicParsing).Content
```

Should return JSON with `"success":true`

### Check Files Exist
```powershell
Test-Path "d:\Projects\aparna\smart-feedback-analyser\public\lib\chart.js"
Test-Path "d:\Projects\aparna\smart-feedback-analyser\public\admin\dashboard.html"
Test-Path "d:\Projects\aparna\smart-feedback-analyser\public\admin\script.js"
```

All should return `True`

## 🎯 Quick Test

Open: http://localhost:3000/test-chart.html

This is a simple test page. If this shows a chart:
- ✅ Chart.js works
- ✅ Server serves files correctly
- ❌ Issue is in dashboard.html or script.js

If test page also empty:
- ❌ Chart.js not loading
- ❌ Server issue

## 📝 Code Verification

### Check dashboard.html has:
```html
<script src="/lib/chart.js"></script>
<canvas id="doughnutChart"></canvas>
<canvas id="barChart"></canvas>
<canvas id="lineChart"></canvas>
<canvas id="horizontalBarChart"></canvas>
<script src="/admin/script.js"></script>
```

### Check script.js has:
```javascript
// Chart instances at top
let doughnutChart = null;
let lineChart = null;
let horizontalBarChart = null;

// In loadAnalytics()
displayDoughnutChart(data.analytics);
displayLineChart(data.analytics);
displayHorizontalBarChart(data.analytics);

// Chart functions exist
function displayDoughnutChart(analytics) { ... }
function displayLineChart(analytics) { ... }
function displayHorizontalBarChart(analytics) { ... }
```

## 🚨 Common Issues

### Issue: "Charts were there, now gone"
**Cause**: Browser cached old JavaScript  
**Fix**: Hard refresh (Ctrl+Shift+R)

### Issue: "Loading spinner never stops"
**Cause**: JavaScript error preventing completion  
**Fix**: Check console for errors

### Issue: "Only some charts show"
**Cause**: Individual chart function error  
**Fix**: Check which canvas IDs are missing

### Issue: "Charts flash then disappear"
**Cause**: Chart being created then immediately destroyed  
**Fix**: Check for duplicate function calls

### Issue: "White space where charts should be"
**Cause**: Canvas exists but chart not rendering  
**Fix**: Check Chart.js loaded before script.js

## ✅ Working Example

If all else fails, here's a minimal working example:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/lib/chart.js"></script>
</head>
<body>
    <canvas id="myChart" width="400" height="200"></canvas>
    <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['A', 'B'],
                datasets: [{
                    data: [10, 20],
                    backgroundColor: ['red', 'blue']
                }]
            }
        });
    </script>
</body>
</html>
```

Save as `test.html` in `/public/` and visit:
http://localhost:3000/test.html

---

## 📞 Need Help?

**Check these in order:**
1. ✓ Server running on port 3000
2. ✓ Browser console has no errors
3. ✓ Chart.js loaded (`typeof Chart` returns "function")
4. ✓ Canvas elements exist (4 total)
5. ✓ API returns data
6. ✓ Hard refresh attempted

**If all above pass but still empty:**
- Try different browser (Chrome/Firefox)
- Disable browser extensions
- Check firewall/antivirus isn't blocking

---

**Dashboard URL**: http://localhost:3000/admin/dashboard.html  
**Test Page URL**: http://localhost:3000/test-chart.html  
**API URL**: http://localhost:3000/api/admin/analytics
