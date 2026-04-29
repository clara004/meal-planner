const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');

// Create empty weekly plan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const plan = new MealPlan({
      user: req.user.id,
      week: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
    });
    await plan.save();
    res.status(201).json({ message: 'Meal plan created', plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's meal plan
router.get('/', authMiddleware, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ user: req.user.id })
      .populate('week.monday week.tuesday week.wednesday week.thursday week.friday week.saturday week.sunday');
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign recipe to a day
router.put('/:day', authMiddleware, async (req, res) => {
  try {
    const { day } = req.params;
    const { recipeId } = req.body;
    const plan = await MealPlan.findOne({ user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
    if (!plan.week[day]) return res.status(400).json({ message: 'Invalid day' });
    plan.week[day].push(recipeId);
    await plan.save();
    res.json({ message: `Recipe added to ${day}`, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear a day
router.delete('/:day', authMiddleware, async (req, res) => {
  try {
    const { day } = req.params;
    const plan = await MealPlan.findOne({ user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
    plan.week[day] = [];
    await plan.save();
    res.json({ message: `${day} cleared`, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;