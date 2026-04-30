const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');
const Review = require('../models/Review');

// protected route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'User profile fetched',
        user: req.user
    });
});

// GET /api/user/dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const recipes = await Recipe.find({ user: userId });
    const mealPlan = await MealPlan.findOne({ user: userId });
    const reviews = await Review.find({ user: userId }).populate('recipe', 'title');

    res.json({
      recipes,
      mealPlan,
      reviews
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;