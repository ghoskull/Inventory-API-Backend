const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
require('./config/mongoconnection'); // koneksi dengan setServers

const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const viewRoutes = require('./routes/viewRoutes'); // <-- route untuk halaman
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // untuk membaca cookie
app.use(methodOverride('_method')); // untuk method PUT/DELETE dari form

// Static files (CSS, images, dll)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes API
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Routes untuk halaman web (EJS)
app.use('/', viewRoutes);

// 404 handler untuk API
app.use('/api/*path', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handler (untuk API)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connection.once('connected', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});