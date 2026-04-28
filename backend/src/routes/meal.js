const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Meal = require('../models/Meal');

// CREATE MEAL
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, ingredients, calories } = req.body;
    const meal = new Meal({
      name,
      description,
      ingredients,
      calories,
      user: req.user.id  // comes from the JWT token
    });
    await meal.save();
    res.status(201).json({ message: 'Meal created', meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get All Meals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }); // only this user's meals
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE MEAL
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Meal updated', meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE MEAL
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;