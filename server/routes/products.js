const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

// Helper function to read products
function readProducts() {
  try {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write products
function writeProducts(products) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

/**
 * GET /api/products - Get all products
 */
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ success: false, message: 'Error loading products' });
  }
});

/**
 * GET /api/products/:id - Get a single product
 */
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ success: false, message: 'Error loading product' });
  }
});

/**
 * POST /api/products - Create a new product
 */
router.post('/', (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product name and description are required' 
      });
    }
    
    const products = readProducts();
    
    // Generate new ID
    const newId = products.length > 0 
      ? Math.max(...products.map(p => p.id)) + 1 
      : 1;
    
    // Create new product
    const newProduct = {
      id: newId,
      name,
      description,
      image: image || '📦'
    };
    
    products.push(newProduct);
    writeProducts(products);
    
    res.json({ 
      success: true, 
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
});

/**
 * PUT /api/products/:id - Update a product
 */
router.put('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, image } = req.body;
    
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Update product fields
    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (image) products[productIndex].image = image;
    
    writeProducts(products);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
});

/**
 * DELETE /api/products/:id - Delete a product
 */
router.delete('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Remove product
    const deletedProduct = products.splice(productIndex, 1)[0];
    writeProducts(products);
    
    // Also delete all feedback for this product
    const feedbackPath = path.join(__dirname, '../data/feedback.json');
    if (fs.existsSync(feedbackPath)) {
      const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
      const updatedFeedback = feedbackData.filter(f => f.productId !== productId);
      fs.writeFileSync(feedbackPath, JSON.stringify(updatedFeedback, null, 2));
    }
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

module.exports = router;
