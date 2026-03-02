const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
}, { timestamps: true });

// Hash password sebelum disimpan (tanpa parameter next)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // jika password tidak diubah, lanjutkan
  this.password = await bcrypt.hash(this.password, 10);
});

// Method untuk membandingkan password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
module.exports = mongoose.model('User', userSchema);