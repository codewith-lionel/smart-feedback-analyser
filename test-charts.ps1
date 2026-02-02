# Chart Test Data Generator
# Run this script to populate diverse test data for chart visualization

# Test data scenarios
$testScenarios = @(
    # Excellent feedback for Product 1
    @{
        productId = 1
        satisfaction = "Very Satisfied"
        quality = "Excellent"
        value = "Strongly Agree"
        recommend = "Definitely Yes"
        improvements = "Nothing - It's Perfect"
        usage = "Daily"
        additionalComments = "Amazing product! Exceeded expectations."
    },
    # Good feedback for Product 2
    @{
        productId = 2
        satisfaction = "Satisfied"
        quality = "Good"
        value = "Agree"
        recommend = "Probably Yes"
        improvements = "Design & Appearance"
        usage = "Several times a week"
        additionalComments = "Very good overall, minor design improvements needed."
    },
    # Neutral feedback for Product 3
    @{
        productId = 3
        satisfaction = "Neutral"
        quality = "Average"
        value = "Neutral"
        recommend = "Not Sure"
        improvements = "Functionality & Features"
        usage = "Once a week"
        additionalComments = "It's okay, nothing special."
    },
    # Poor feedback for Product 4
    @{
        productId = 4
        satisfaction = "Dissatisfied"
        quality = "Below Average"
        value = "Disagree"
        recommend = "Probably Not"
        improvements = "Durability & Build Quality"
        usage = "Occasionally"
        additionalComments = "Not worth the price, quality issues."
    },
    # Very poor feedback for Product 5
    @{
        productId = 5
        satisfaction = "Very Dissatisfied"
        quality = "Poor"
        value = "Strongly Disagree"
        recommend = "Definitely Not"
        improvements = "Price & Value"
        usage = "Rarely"
        additionalComments = "Terrible experience, would not recommend."
    },
    # Mixed feedback for Product 1 (second entry)
    @{
        productId = 1
        satisfaction = "Satisfied"
        quality = "Good"
        value = "Agree"
        recommend = "Probably Yes"
        improvements = "Customer Support"
        usage = "Daily"
        additionalComments = "Good product but customer service could be better."
    },
    # Excellent feedback for Product 3
    @{
        productId = 3
        satisfaction = "Very Satisfied"
        quality = "Excellent"
        value = "Strongly Agree"
        recommend = "Definitely Yes"
        improvements = "Nothing - It's Perfect"
        usage = "Daily"
        additionalComments = "Best speaker I've ever owned!"
    }
)

Write-Host "🧪 Chart Test Data Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($i in 0..($testScenarios.Count - 1)) {
    $scenario = $testScenarios[$i]
    
    Write-Host "[$($i + 1)/$($testScenarios.Count)] Submitting feedback for Product $($scenario.productId)..." -NoNewline
    
    try {
        $body = $scenario | ConvertTo-Json
        $response = Invoke-WebRequest `
            -Uri "http://localhost:3000/api/feedback" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing
        
        $result = $response.Content | ConvertFrom-Json
        
        if ($result.success) {
            Write-Host " ✅ Success (Score: $($result.feedback.sentimentData.percentageScore)%)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " ❌ Failed: $($result.message)" -ForegroundColor Red
            $failCount++
        }
        
        Start-Sleep -Milliseconds 200
    }
    catch {
        Write-Host " ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Successful: $successCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host ""

# Test the analytics API
Write-Host "📊 Testing Analytics API..." -ForegroundColor Yellow
try {
    $analytics = (Invoke-WebRequest -Uri "http://localhost:3000/api/admin/analytics" -UseBasicParsing).Content | ConvertFrom-Json
    
    if ($analytics.success) {
        Write-Host "✅ Analytics API working!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Product Summary:" -ForegroundColor Cyan
        foreach ($product in $analytics.analytics) {
            if ($product.totalFeedback -gt 0) {
                $avgScore = [math]::Round($product.averageSentimentScore)
                Write-Host "  📦 $($product.productName): $($product.totalFeedback) feedback, Avg Score: $avgScore%" -ForegroundColor White
                Write-Host "     Positive: $($product.sentimentCounts.positive) | Neutral: $($product.sentimentCounts.neutral) | Negative: $($product.sentimentCounts.negative)" -ForegroundColor Gray
            }
        }
    }
}
catch {
    Write-Host "❌ Analytics API Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open dashboard: http://localhost:3000/admin/dashboard.html" -ForegroundColor White
Write-Host "2. Check all 4 charts are displayed" -ForegroundColor White
Write-Host "3. Verify data matches the summary above" -ForegroundColor White
Write-Host "4. Test hover interactions on each chart" -ForegroundColor White
Write-Host "5. Enable auto-refresh and submit more feedback" -ForegroundColor White
Write-Host ""

# Open dashboard in browser
$openBrowser = Read-Host "Open dashboard in browser? (Y/N)"
if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Start-Process "http://localhost:3000/admin/dashboard.html"
    Write-Host "✅ Dashboard opened!" -ForegroundColor Green
}
