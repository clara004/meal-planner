const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  week: {
    monday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    tuesday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    wednesday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    thursday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    friday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    saturday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    },
    sunday: {
      Breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      Dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    }
  }
}, { timestamps: true });

mealPlanSchema.index({ user: 1, startDate: 1 }, { unique: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);