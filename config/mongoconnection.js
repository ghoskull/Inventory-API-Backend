const mongoose = require('mongoose');
const { setServers } = require('node:dns/promises');
const dotenv = require('dotenv');

dotenv.config();

setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const app = require('../server'); // <-- panggil server.js setelah koneksi
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });