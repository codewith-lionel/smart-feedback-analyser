// API Base URL
const API_BASE = '';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const modal = document.getElementById('feedback-modal');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancel-btn');
const feedbackForm = document.getElementById('feedback-form');
const modalTitle = document.getElementById('modal-title');
const productIdInput = document.getElementById('product-id');
const successMessage = document.getElementById('success-message');

let currentProduct = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        } else {
            console.error('Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p style="text-align: center; color: #666;">Failed to load products. Please try again later.</p>';
    }
}

// Display products in grid
function displayProducts(products) {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-icon">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="btn btn-primary" onclick="openFeedbackForm(${product.id}, '${product.name}')">
                Give Feedback
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Open feedback form modal
function openFeedbackForm(productId, productName) {
    currentProduct = { id: productId, name: productName };
    productIdInput.value = productId;
    modalTitle.textContent = `Feedback for ${productName}`;
    modal.style.display = 'block';
    feedbackForm.reset();
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    feedbackForm.reset();
    currentProduct = null;
}

// Event listeners for closing modal
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

// Handle form submission
feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        productId: productIdInput.value,
        satisfaction: document.getElementById('satisfaction').value,
        likes: document.getElementById('likes').value,
        improvements: document.getElementById('improvements').value,
        additionalComments: document.getElementById('additionalComments').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            showSuccessMessage();
        } else {
            alert('Error submitting feedback: ' + data.message);
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    }
});

// Show success message
function showSuccessMessage() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 4000);
}

// Make openFeedbackForm globally available
window.openFeedbackForm = openFeedbackForm;
