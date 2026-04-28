const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: {
    monday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    tuesday:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    thursday:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    friday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    saturday:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    sunday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);