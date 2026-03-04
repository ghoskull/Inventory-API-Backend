// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // <-- Fungsi ini harus dipasang ke rute
const passport = require('passport');

// ==========================================
// 1. RUTE LOGIN MANUAL (TAMBAHKAN INI!)
// ==========================================

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login 
// Ini yang dipanggil oleh fetch() di login.ejs kamu
router.post('/login', login); 


// ==========================================
// 2. RUTE GOOGLE OAUTH
// ==========================================

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Cukup pakai satu saja rute callback-nya (kamu tadi punya dua yang duplikat)
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    res.cookie('token', req.user.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    res.redirect('/dashboard');
  }
);

module.exports = router;