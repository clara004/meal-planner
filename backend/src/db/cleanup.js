require('dotenv').config();
const Recipe = require('../models/Recipe');
const connectDB = require('./connection');

const cleanup = async () => {
  try {
    await connectDB();
    await Recipe.deleteMany({ category: { $exists: false } });
    console.log('✅ Deleted old recipes without category');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();