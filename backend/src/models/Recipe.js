const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  cuisine: String,
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
  },
  dietaryTags: [String],
  servings: {
    type: Number,
    required: true
  },
  prepTime: Number,
  cookTime: Number,
  image: String,
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: Number,
      unit: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  ],
  steps: [String],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  perServing: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);