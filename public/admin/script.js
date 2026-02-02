// API Base URL
const API_BASE = '';

// Chart instances
let barChart = null;
let pieCharts = {};

// Auto-refresh settings
let autoRefreshInterval = null;
let autoRefreshEnabled = false;
let refreshIntervalSeconds = 30;
let lastUpdateTime = null;

// Load analytics data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
    initializeAutoRefresh();
    updateLastRefreshTime();
});

// Load analytics data from API
async function loadAnalytics(showLoading = true) {
    try {
        if (showLoading) {
            showLoadingIndicator();
        }
        
        const response = await fetch(`${API_BASE}/api/admin/analytics`);
        const data = await response.json();
        
        if (data.success) {
            displayStatistics(data.analytics);
            displayBarChart(data.analytics);
            displayProductAnalysis(data.analytics);
            lastUpdateTime = new Date();
            updateLastRefreshTime();
            showUpdateNotification('Data refreshed successfully!');
        } else {
            console.error('Failed to load analytics');
            showUpdateNotification('Failed to load analytics', 'error');
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        showUpdateNotification('Error loading data', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// Show loading indicator
function showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

// Hide loading indicator
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 300);
    }
}

// Show update notification
function showUpdateNotification(message, type = 'success') {
    const notification = document.getElementById('update-notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `update-notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Update last refresh time display
function updateLastRefreshTime() {
    const timeDisplay = document.getElementById('last-update-time');
    if (timeDisplay && lastUpdateTime) {
        const timeString = lastUpdateTime.toLocaleTimeString();
        timeDisplay.textContent = `Last updated: ${timeString}`;
    }
}

// Initialize auto-refresh functionality
function initializeAutoRefresh() {
    const toggleBtn = document.getElementById('auto-refresh-toggle');
    const intervalInput = document.getElementById('refresh-interval');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAutoRefresh);
    }
    
    if (intervalInput) {
        intervalInput.addEventListener('change', (e) => {
            refreshIntervalSeconds = parseInt(e.target.value) || 30;
            if (autoRefreshEnabled) {
                stopAutoRefresh();
                startAutoRefresh();
            }
        });
    }
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    const toggleBtn = document.getElementById('auto-refresh-toggle');
    
    if (autoRefreshEnabled) {
        stopAutoRefresh();
        if (toggleBtn) {
            toggleBtn.textContent = '▶️ Enable Auto-Refresh';
            toggleBtn.classList.remove('active');
        }
    } else {
        startAutoRefresh();
        if (toggleBtn) {
            toggleBtn.textContent = '⏸️ Disable Auto-Refresh';
            toggleBtn.classList.add('active');
        }
    }
}

// Start auto-refresh
function startAutoRefresh() {
    autoRefreshEnabled = true;
    autoRefreshInterval = setInterval(() => {
        loadAnalytics(false);
    }, refreshIntervalSeconds * 1000);
}

// Stop auto-refresh
function stopAutoRefresh() {
    autoRefreshEnabled = false;
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Display overall statistics
function displayStatistics(analytics) {
    const totalFeedback = analytics.reduce((sum, p) => sum + p.totalFeedback, 0);
    const totalPositive = analytics.reduce((sum, p) => sum + p.sentimentCounts.positive, 0);
    const totalNegative = analytics.reduce((sum, p) => sum + p.sentimentCounts.negative, 0);
    const totalNeutral = analytics.reduce((sum, p) => sum + p.sentimentCounts.neutral, 0);
    
    const statsHTML = `
        <div class="stat-card animate-in">
            <div class="stat-icon">📝</div>
            <div class="stat-value" data-value="${totalFeedback}">${totalFeedback}</div>
            <div class="stat-label">Total Feedback</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay: 0.1s">
            <div class="stat-icon">😊</div>
            <div class="stat-value" data-value="${totalPositive}">${totalPositive}</div>
            <div class="stat-label">Positive Feedback</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay: 0.2s">
            <div class="stat-icon">😐</div>
            <div class="stat-value" data-value="${totalNeutral}">${totalNeutral}</div>
            <div class="stat-label">Neutral Feedback</div>
        </div>
        <div class="stat-card animate-in" style="animation-delay: 0.3s">
            <div class="stat-icon">😟</div>
            <div class="stat-value" data-value="${totalNegative}">${totalNegative}</div>
            <div class="stat-label">Negative Feedback</div>
        </div>
    `;
    
    const container = document.getElementById('stats-overview');
    container.style.opacity = '0';
    container.innerHTML = statsHTML;
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease';
        container.style.opacity = '1';
        animateNumbers();
    }, 50);
}

// Animate numbers counting up
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value[data-value]');
    
    statValues.forEach(element => {
        const target = parseInt(element.getAttribute('data-value'));
        const duration = 1000;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    });
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
    
    analytics.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-analysis-card animate-in';
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        const performanceBadge = getPerformanceBadge(product.positivePercentage);
        
        const positivePercent = product.totalFeedback > 0 ? ((product.sentimentCounts.positive / product.totalFeedback) * 100).toFixed(1) : 0;
        const neutralPercent = product.totalFeedback > 0 ? ((product.sentimentCounts.neutral / product.totalFeedback) * 100).toFixed(1) : 0;
        const negativePercent = product.totalFeedback > 0 ? ((product.sentimentCounts.negative / product.totalFeedback) * 100).toFixed(1) : 0;
        
        // Calculate average percentage score if available
        const avgScoreDisplay = product.averageSentimentScore 
            ? `<div style="text-align: center; margin: 15px 0; padding: 12px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; border-left: 4px solid #0891b2;">
                <div style="font-size: 0.85em; color: #0891b2; font-weight: 600; margin-bottom: 4px;">AVERAGE SCORE</div>
                <div style="font-size: 2em; font-weight: 700; color: #1e40af;">${Math.round(product.averageSentimentScore)}%</div>
              </div>` 
            : '';
        
        productCard.innerHTML = `
            <div class="product-header">
                <h3 class="product-name">${product.productName}</h3>
                <span class="feedback-count">${product.totalFeedback} feedback${product.totalFeedback !== 1 ? 's' : ''}</span>
            </div>
            
            ${product.totalFeedback > 0 ? `
                ${avgScoreDisplay}
                
                <div class="sentiment-stats">
                    <div class="sentiment-item sentiment-positive">
                        <div class="sentiment-value">${product.sentimentCounts.positive}</div>
                        <div class="sentiment-label">Positive</div>
                        <div class="sentiment-percent">${positivePercent}%</div>
                    </div>
                    <div class="sentiment-item sentiment-neutral">
                        <div class="sentiment-value">${product.sentimentCounts.neutral}</div>
                        <div class="sentiment-label">Neutral</div>
                        <div class="sentiment-percent">${neutralPercent}%</div>
                    </div>
                    <div class="sentiment-item sentiment-negative">
                        <div class="sentiment-value">${product.sentimentCounts.negative}</div>
                        <div class="sentiment-label">Negative</div>
                        <div class="sentiment-percent">${negativePercent}%</div>
                    </div>
                </div>
                
                <div class="progress-bars">
                    <div class="progress-bar-container">
                        <div class="progress-bar progress-positive" style="width: 0%" data-width="${positivePercent}%"></div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar progress-neutral" style="width: 0%" data-width="${neutralPercent}%"></div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar progress-negative" style="width: 0%" data-width="${negativePercent}%"></div>
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
            
            // Animate progress bars
            setTimeout(() => {
                animateProgressBars(productCard);
            }, 100);
        }
    });
}

// Animate progress bars
function animateProgressBars(container) {
    const progressBars = container.querySelectorAll('.progress-bar[data-width]');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = bar.getAttribute('data-width');
        }, index * 100);
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

// Section Management
// ============ AUTO-REFRESH AND UI CONTROLS ============

// Toggle auto-refresh
function toggleAutoRefresh() {
    const toggle = document.getElementById('auto-refresh-toggle');
    const intervalSelect = document.getElementById('refresh-interval');
    
    if (toggle.checked) {
        intervalSelect.disabled = false;
        startAutoRefresh();
    } else {
        intervalSelect.disabled = true;
        stopAutoRefresh();
    }
}

// Start auto-refresh
function startAutoRefresh() {
    const intervalSelect = document.getElementById('refresh-interval');
    const seconds = parseInt(intervalSelect.value);
    
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        loadAnalytics();
    }, seconds * 1000);
}

// Stop auto-refresh
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Change refresh interval
document.addEventListener('DOMContentLoaded', () => {
    const intervalSelect = document.getElementById('refresh-interval');
    if (intervalSelect) {
        intervalSelect.addEventListener('change', () => {
            const toggle = document.getElementById('auto-refresh-toggle');
            if (toggle && toggle.checked) {
                stopAutoRefresh();
                startAutoRefresh();
            }
        });
    }
});

// Display products in table
function displayProductsTable(products) {
    const tbody = document.getElementById('products-table-body');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No products found</td></tr>';
        return;
    }
    
    tbody.style.opacity = '0';
    tbody.innerHTML = products.map((product, index) => `
        <tr class="animate-in" style="animation-delay: ${index * 0.05}s">
            <td>${product.id}</td>
            <td style="font-size: 2em;">${product.image}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id}, '${product.name.replace(/'/g, "\\'")}')">Delete</button>
            </td>
        </tr>
    `).join('');
    
    setTimeout(() => {
        tbody.style.transition = 'opacity 0.3s ease';
        tbody.style.opacity = '1';
    }, 50);
}

// Show product modal
function showProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    
    form.reset();
    
    if (productId) {
        title.textContent = 'Edit Product';
        // Load product data
        fetch(`${API_BASE}/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('product-id').value = data.product.id;
                    document.getElementById('product-name').value = data.product.name;
                    document.getElementById('product-description').value = data.product.description;
                    document.getElementById('product-image').value = data.product.image;
                }
            });
    } else {
        title.textContent = 'Add New Product';
        document.getElementById('product-id').value = '';
    }
    
    modal.style.display = 'block';
}

// Close product modal
function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Edit product
function editProduct(productId) {
    showProductModal(productId);
}

// Save product (create or update)
async function saveProduct(event) {
    event.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value || '📦';
    
    const productData = { name, description, image };
    
    try {
        showLoadingIndicator();
        let response;
        if (productId) {
            // Update existing product
            response = await fetch(`${API_BASE}/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(`${API_BASE}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showUpdateNotification(data.message, 'success');
            closeProductModal();
            loadProducts();
        } else {
            showUpdateNotification('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showUpdateNotification('Error saving product', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// Delete product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"? This will also delete all associated feedback.`)) {
        return;
    }
    
    try {
        showLoadingIndicator();
        const response = await fetch(`${API_BASE}/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showUpdateNotification(data.message, 'success');
            loadProducts();
        } else {
            showUpdateNotification('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showUpdateNotification('Error deleting product', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// ============ FEEDBACK MANAGEMENT ============

let allProducts = [];

// Load all feedback
async function loadAllFeedback() {
    try {
        showLoadingIndicator();
        
        // Load products first for display
        const productsResponse = await fetch(`${API_BASE}/api/products`);
        const productsData = await productsResponse.json();
        if (productsData.success) {
            allProducts = productsData.products;
        }
        
        // Load feedback
        const response = await fetch(`${API_BASE}/api/feedback`);
        const data = await response.json();
        
        if (data.success) {
            displayFeedbackTable(data.feedback);
        } else {
            console.error('Failed to load feedback');
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
    } finally {
        hideLoadingIndicator();
    }
}

// Display feedback in table
function displayFeedbackTable(feedbackList) {
    const tbody = document.getElementById('feedback-table-body');
    
    if (feedbackList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No feedback found</td></tr>';
        return;
    }
    
    tbody.style.opacity = '0';
    tbody.innerHTML = feedbackList.map((feedback, index) => {
        const product = allProducts.find(p => p.id === feedback.productId);
        const productName = product ? product.name : `Product ${feedback.productId}`;
        const date = new Date(feedback.timestamp).toLocaleDateString();
        
        // Get sentiment data
        const sentimentData = feedback.sentimentData || feedback.sentiment;
        let sentimentClass, sentimentText, scoreDisplay;
        
        if (typeof sentimentData === 'object' && sentimentData.percentageScore !== undefined) {
            const score = sentimentData.percentageScore;
            scoreDisplay = `${score}%`;
            sentimentText = sentimentData.category || sentimentData.classification;
            
            if (score >= 75) sentimentClass = 'sentiment-positive';
            else if (score >= 40) sentimentClass = 'sentiment-neutral';
            else sentimentClass = 'sentiment-negative';
        } else {
            // Fallback for old format
            sentimentClass = feedback.sentiment === 'positive' ? 'sentiment-positive' : 
                            feedback.sentiment === 'negative' ? 'sentiment-negative' : 'sentiment-neutral';
            sentimentText = feedback.sentiment;
            scoreDisplay = 'N/A';
        }
        
        return `
            <tr class="animate-in" style="animation-delay: ${index * 0.03}s">
                <td>${feedback.id}</td>
                <td>${productName}</td>
                <td>${feedback.satisfaction}</td>
                <td>
                    <span class="badge ${sentimentClass}">${sentimentText}</span>
                    <small style="display: block; margin-top: 4px; color: #64748b;">${scoreDisplay}</small>
                </td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewFeedback(${feedback.id})">View</button>
                    <button class="btn btn-sm btn-warning" onclick="editFeedback(${feedback.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFeedback(${feedback.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
    
    setTimeout(() => {
        tbody.style.transition = 'opacity 0.3s ease';
        tbody.style.opacity = '1';
    }, 50);
}

// View feedback details
async function viewFeedback(feedbackId) {
    try {
        const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}`);
        const data = await response.json();
        
        if (data.success) {
            const feedback = data.feedback;
            const product = allProducts.find(p => p.id === feedback.productId);
            const productName = product ? product.name : `Product ${feedback.productId}`;
            
            alert(`Feedback Details:
            
Product: ${productName}
Satisfaction: ${feedback.satisfaction}
Sentiment: ${feedback.sentiment} (Score: ${feedback.sentimentScore.toFixed(2)})

What they like:
${feedback.likes || 'N/A'}

What should be improved:
${feedback.improvements || 'N/A'}

Additional Comments:
${feedback.additionalComments || 'N/A'}

Date: ${new Date(feedback.timestamp).toLocaleString()}`);
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Edit feedback
async function editFeedback(feedbackId) {
    try {
        const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}`);
        const data = await response.json();
        
        if (data.success) {
            const feedback = data.feedback;
            
            document.getElementById('feedback-id').value = feedback.id;
            document.getElementById('feedback-satisfaction').value = feedback.satisfaction;
            document.getElementById('feedback-quality').value = feedback.quality || '';
            document.getElementById('feedback-value').value = feedback.value || '';
            document.getElementById('feedback-recommend').value = feedback.recommend || '';
            document.getElementById('feedback-improvements').value = feedback.improvements || '';
            document.getElementById('feedback-usage').value = feedback.usage || '';
            document.getElementById('feedback-comments').value = feedback.additionalComments || '';
            
            // Display insights if available
            if (feedback.sentiment && feedback.sentiment.insights && feedback.sentiment.insights.length > 0) {
                const insightsGroup = document.getElementById('insights-group');
                const insightsDisplay = document.getElementById('feedback-insights');
                insightsDisplay.innerHTML = feedback.sentiment.insights.map(insight => `<p>${insight}</p>`).join('');
                insightsGroup.style.display = 'block';
            } else {
                document.getElementById('insights-group').style.display = 'none';
            }
            
            document.getElementById('feedback-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
        showUpdateNotification('Error loading feedback', 'error');
    }
}

// Close feedback modal
function closeFeedbackModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

// Save feedback
async function saveFeedback(event) {
    event.preventDefault();
    
    const feedbackId = document.getElementById('feedback-id').value;
    const feedbackData = {
        satisfaction: document.getElementById('feedback-satisfaction').value,
        quality: document.getElementById('feedback-quality').value,
        value: document.getElementById('feedback-value').value,
        recommend: document.getElementById('feedback-recommend').value,
        improvements: document.getElementById('feedback-improvements').value,
        usage: document.getElementById('feedback-usage').value,
        additionalComments: document.getElementById('feedback-comments').value
    };
    
    try {
        showLoadingIndicator();
        const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showUpdateNotification(data.message, 'success');
            closeFeedbackModal();
            loadAllFeedback();
        } else {
            showUpdateNotification('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error saving feedback:', error);
        showUpdateNotification('Error saving feedback', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// Delete feedback
async function deleteFeedback(feedbackId) {
    if (!confirm('Are you sure you want to delete this feedback?')) {
        return;
    }
    
    try {
        showLoadingIndicator();
        const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showUpdateNotification(data.message, 'success');
            loadAllFeedback();
        } else {
            showUpdateNotification('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting feedback:', error);
        showUpdateNotification('Error deleting feedback', 'error');
    } finally {
        hideLoadingIndicator(
    } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback');
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('product-modal');
    const feedbackModal = document.getElementById('feedback-modal');
    
    if (event.target === productModal) {
        closeProductModal();
    }
    if (event.target === feedbackModal) {
        closeFeedbackModal();
    }
}

