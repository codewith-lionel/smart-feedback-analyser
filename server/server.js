const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Import routes
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

// API Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  try {
    const productsPath = path.join(__dirname, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ success: false, message: 'Error loading products' });
  }
});

// Serve client pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/client/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Client interface: http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});
