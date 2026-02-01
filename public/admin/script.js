// API Base URL
const API_BASE = '';

// Chart instances
let barChart = null;
let pieCharts = {};

// Load analytics data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
});

// Load analytics data from API
async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/analytics`);
        const data = await response.json();
        
        if (data.success) {
            displayStatistics(data.analytics);
            displayBarChart(data.analytics);
            displayProductAnalysis(data.analytics);
        } else {
            console.error('Failed to load analytics');
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Display overall statistics
function displayStatistics(analytics) {
    const totalFeedback = analytics.reduce((sum, p) => sum + p.totalFeedback, 0);
    const totalPositive = analytics.reduce((sum, p) => sum + p.sentimentCounts.positive, 0);
    const totalNegative = analytics.reduce((sum, p) => sum + p.sentimentCounts.negative, 0);
    const totalNeutral = analytics.reduce((sum, p) => sum + p.sentimentCounts.neutral, 0);
    
    const statsHTML = `
        <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-value">${totalFeedback}</div>
            <div class="stat-label">Total Feedback</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😊</div>
            <div class="stat-value">${totalPositive}</div>
            <div class="stat-label">Positive Feedback</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😐</div>
            <div class="stat-value">${totalNeutral}</div>
            <div class="stat-label">Neutral Feedback</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😟</div>
            <div class="stat-value">${totalNegative}</div>
            <div class="stat-label">Negative Feedback</div>
        </div>
    `;
    
    document.getElementById('stats-overview').innerHTML = statsHTML;
}

// Display bar chart comparing products
function displayBarChart(analytics) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (barChart) {
        barChart.destroy();
    }
    
    // Sort products by positive percentage (descending)
    const sortedAnalytics = [...analytics].sort((a, b) => b.positivePercentage - a.positivePercentage);
    
    const labels = sortedAnalytics.map(p => p.productName);
    const positiveData = sortedAnalytics.map(p => p.sentimentCounts.positive);
    const neutralData = sortedAnalytics.map(p => p.sentimentCounts.neutral);
    const negativeData = sortedAnalytics.map(p => p.sentimentCounts.negative);
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Positive',
                    data: positiveData,
                    backgroundColor: '#28a745',
                    borderColor: '#1e7e34',
                    borderWidth: 1
                },
                {
                    label: 'Neutral',
                    data: neutralData,
                    backgroundColor: '#ffc107',
                    borderColor: '#d39e00',
                    borderWidth: 1
                },
                {
                    label: 'Negative',
                    data: negativeData,
                    backgroundColor: '#dc3545',
                    borderColor: '#bd2130',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// Display individual product analysis with pie charts
function displayProductAnalysis(analytics) {
    const container = document.getElementById('products-analysis');
    container.innerHTML = '';
    
    analytics.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-analysis-card';
        
        const performanceBadge = getPerformanceBadge(product.positivePercentage);
        
        productCard.innerHTML = `
            <div class="product-header">
                <h3 class="product-name">${product.productName}</h3>
                <span class="feedback-count">${product.totalFeedback} feedback${product.totalFeedback !== 1 ? 's' : ''}</span>
            </div>
            
            ${product.totalFeedback > 0 ? `
                <div class="sentiment-stats">
                    <div class="sentiment-item sentiment-positive">
                        <div class="sentiment-value">${product.sentimentCounts.positive}</div>
                        <div class="sentiment-label">Positive</div>
                    </div>
                    <div class="sentiment-item sentiment-neutral">
                        <div class="sentiment-value">${product.sentimentCounts.neutral}</div>
                        <div class="sentiment-label">Neutral</div>
                    </div>
                    <div class="sentiment-item sentiment-negative">
                        <div class="sentiment-value">${product.sentimentCounts.negative}</div>
                        <div class="sentiment-label">Negative</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="pieChart-${product.productId}"></canvas>
                </div>
                
                <div style="text-align: center;">
                    <span class="performance-badge ${performanceBadge.class}">
                        ${performanceBadge.text}
                    </span>
                </div>
            ` : `
                <div class="no-feedback">No feedback received yet for this product.</div>
            `}
        `;
        
        container.appendChild(productCard);
        
        // Create pie chart for this product if it has feedback
        if (product.totalFeedback > 0) {
            createPieChart(product);
        }
    });
}

// Create pie chart for individual product
function createPieChart(product) {
    const ctx = document.getElementById(`pieChart-${product.productId}`).getContext('2d');
    
    // Destroy existing chart if it exists
    if (pieCharts[product.productId]) {
        pieCharts[product.productId].destroy();
    }
    
    pieCharts[product.productId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [
                    product.sentimentCounts.positive,
                    product.sentimentCounts.neutral,
                    product.sentimentCounts.negative
                ],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderColor: ['#1e7e34', '#d39e00', '#bd2130'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Get performance badge based on positive percentage
function getPerformanceBadge(positivePercentage) {
    if (positivePercentage >= 70) {
        return { text: '⭐ Excellent Performance', class: 'badge-excellent' };
    } else if (positivePercentage >= 50) {
        return { text: '👍 Good Performance', class: 'badge-good' };
    } else if (positivePercentage >= 30) {
        return { text: '😐 Fair Performance', class: 'badge-fair' };
    } else {
        return { text: '⚠️ Needs Improvement', class: 'badge-poor' };
    }
}

// Make loadAnalytics globally available
window.loadAnalytics = loadAnalytics;
