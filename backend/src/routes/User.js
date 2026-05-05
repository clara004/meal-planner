const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');

// GET /user/profile — return user data + aggregated stats
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Aggregate stats
    const recipesCreated = await Recipe.countDocuments({ user: req.user.id });

    // Count meals currently planned
    const plan = await MealPlan.findOne({ user: req.user.id });
    let mealsPlanned = 0;
    if (plan && plan.week) {
      const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
      const slots = ['Breakfast','Lunch','Dinner'];
      days.forEach(day => {
        if (plan.week[day]) {
          slots.forEach(slot => {
            if (plan.week[day][slot]) mealsPlanned++;
          });
        }
      });
    }

    // Count recipes this user has rated
    const recipesRated = await Recipe.countDocuments({ 'ratings.user': req.user.id });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        calorie_goal: user.calorie_goal,
        dietary_prefs: user.dietary_prefs,
        avatar: user.avatar,
        favorites: user.favorites || [],
        createdAt: user.createdAt || user._id.getTimestamp(),
      },
      stats: {
        recipesCreated,
        mealsPlanned,
        recipesRated,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /user/profile — update name, email, calorie_goal, dietary_prefs
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, calorie_goal, dietary_prefs } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (calorie_goal !== undefined) user.calorie_goal = calorie_goal;
    if (dietary_prefs !== undefined) user.dietary_prefs = dietary_prefs;

    await user.save();

    // Update localStorage-compatible response
    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        calorie_goal: user.calorie_goal,
        dietary_prefs: user.dietary_prefs,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /user/profile/avatar — upload avatar as base64 string
router.put('/profile/avatar', authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'No avatar data provided' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = avatar;
    await user.save();

    res.json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /user/favorites/:recipeId — toggle favorite
router.post('/favorites/:recipeId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipeId = req.params.recipeId;
    const index = user.favorites.indexOf(recipeId);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from favorites', favorites: user.favorites, isFavorite: false });
    } else {
      user.favorites.push(recipeId);
      await user.save();
      res.json({ message: 'Added to favorites', favorites: user.favorites, isFavorite: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /user/favorites — get user's favorite recipes (populated)
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;