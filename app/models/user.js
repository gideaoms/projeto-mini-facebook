const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function test(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
  return next();
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
  generateToken() {
    return jwt.sign({ id: this.id }, secret, { expiresIn: 86400 });
  },
};

module.exports = mongoose.model('User', UserSchema);
