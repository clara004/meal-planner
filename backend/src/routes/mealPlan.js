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
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const calorieGoal = user.calorieGoal || 2000;

    const plan = await MealPlan.findOne({ user: req.user.id })
      .populate('week.monday week.tuesday week.wednesday week.thursday week.friday week.saturday week.sunday');

    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    let weeklyTotal = 0;
    const dailySummary = {};

    days.forEach(day => {
      const dayCalories = plan.week[day].reduce((sum, recipe) => {
        return sum + (recipe.totalNutrition?.calories || 0);
      }, 0);

      weeklyTotal += dayCalories;

      dailySummary[day] = {
        calories: dayCalories,
        exceeded: dayCalories > calorieGoal
      };
    });

    res.json({
      plan,
      calorieGoal,
      dailySummary,
      weeklyTotal
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shopping list — MUST be before /:day
router.get('/shopping-list', authMiddleware, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ user: req.user.id })
      .populate({
        path: 'week.monday week.tuesday week.wednesday week.thursday week.friday week.saturday week.sunday',
        select: 'ingredients'
      });

    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });

    const shoppingMap = {};

    const convertToBaseUnit = (quantity, unit) => {
      const u = unit?.toLowerCase();
      if (['cup', 'cups'].includes(u))           return quantity * 240;
      if (u === 'ml')                             return quantity;
      if (['liter', 'liters', 'l'].includes(u))  return quantity * 1000;
      if (['kg', 'kilogram'].includes(u))         return quantity * 1000;
      if (['g', 'gram', 'grams'].includes(u))     return quantity;
      return quantity;
    };

    const getBaseUnit = (unit) => {
      const u = unit?.toLowerCase();
      if (['cup', 'cups', 'ml', 'liter', 'liters', 'l'].includes(u)) return 'ml';
      if (['kg', 'kilogram', 'g', 'gram', 'grams'].includes(u))       return 'grams';
      return unit;
    };

    const days = Object.values(plan.week);
    days.forEach(day => {
      day.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();
          const baseUnit = getBaseUnit(ing.unit);
          const convertedQty = convertToBaseUnit(ing.quantity || 0, ing.unit);

          if (!shoppingMap[key]) {
            shoppingMap[key] = { name: ing.name, quantity: 0, unit: baseUnit };
          }
          shoppingMap[key].quantity += convertedQty;
        });
      });
    });

    const formatForShopping = (item) => {
      if (item.unit === 'ml') {
        const qty = item.quantity;
        if (qty >= 1000) return { name: item.name, quantity: Math.ceil(qty / 1000), unit: 'liter bottle' };
        if (qty >= 500)  return { name: item.name, quantity: Math.ceil(qty / 500),  unit: 'bottle (500ml)' };
        if (qty >= 250)  return { name: item.name, quantity: Math.ceil(qty / 250),  unit: 'bottle (250ml)' };
        return { name: item.name, quantity: Math.ceil(qty), unit: 'ml' };
      }

      if (item.unit === 'grams') {
        const qty = item.quantity;
        if (qty >= 5000) return { name: item.name, quantity: Math.ceil(qty / 5000), unit: 'large bag (5kg)' };
        if (qty >= 1000) return { name: item.name, quantity: Math.ceil(qty / 1000), unit: 'bag (1kg)' };
        if (qty >= 500)  return { name: item.name, quantity: Math.ceil(qty / 500),  unit: 'pack (500g)' };
        if (qty >= 250)  return { name: item.name, quantity: Math.ceil(qty / 250),  unit: 'pack (250g)' };
        if (qty >= 100)  return { name: item.name, quantity: Math.ceil(qty / 100),  unit: 'pack (100g)' };
        return { name: item.name, quantity: Math.ceil(qty), unit: 'grams' };
      }

      if (['whole', 'piece', 'pieces'].includes(item.unit?.toLowerCase())) {
        const qty = Math.ceil(item.quantity);
        if (qty >= 12) return { name: item.name, quantity: Math.ceil(qty / 12), unit: 'box (12 pieces)' };
        if (qty >= 6)  return { name: item.name, quantity: Math.ceil(qty / 6),  unit: 'pack (6 pieces)' };
        return { name: item.name, quantity: qty, unit: 'pieces' };
      }

      return { name: item.name, quantity: Math.ceil(item.quantity), unit: item.unit || 'unit' };
    };

    const shoppingList = Object.values(shoppingMap).map(formatForShopping);
    res.json({ shoppingList });

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