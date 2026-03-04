const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const { setServers } = require('node:dns/promises');

// 1. LOAD ENVIRONMENT VARIABLES
dotenv.config();

// 2. IMPOR PASSPORT
const passport = require('./config/passport');

// 3. IMPOR ROUTES
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const viewRoutes = require('./routes/viewRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 4. MIDDLEWARE DASAR
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// 5. SESSION & PASSPORT
app.use(session({
    secret: process.env.JWT_SECRET || 'secret_sneaker',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));
app.use(passport.initialize());
app.use(passport.session());

// 6. FILE STATIS
app.use(express.static(path.join(__dirname, 'public')));

// 7. VIEW ENGINE (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 8. GLOBAL VARIABLES FOR VIEWS
// Ini memastikan 'user' selalu ada di setiap file EJS agar tidak error
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// 9. ROUTES API
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// 10. ROUTES UNTUK HALAMAN WEB (EJS)
app.use('/', viewRoutes);

// 11. HANDLER 404 UNTUK API
app.use('/api/*path', (req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// 12. ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// 13. KONEKSI DATABASE
setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });