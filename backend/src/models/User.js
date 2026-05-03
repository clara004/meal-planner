const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  calorie_goal: {
    type: Number,
    default: 2000
  },
  dietary_prefs: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);