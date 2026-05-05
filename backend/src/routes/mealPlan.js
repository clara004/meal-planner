const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');

const createEmptyWeek = () => {
  const emptyDay = { Breakfast: null, Lunch: null, Dinner: null };
  return {
    monday: { ...emptyDay }, tuesday: { ...emptyDay }, wednesday: { ...emptyDay },
    thursday: { ...emptyDay }, friday: { ...emptyDay }, saturday: { ...emptyDay }, sunday: { ...emptyDay }
  };
};

// Create empty weekly plan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const startDate = new Date(req.body.startDate);
    if (isNaN(startDate)) return res.status(400).json({ message: 'Valid startDate required' });

    const plan = await MealPlan.findOneAndUpdate({ user: req.user.id, startDate }, {
      $setOnInsert: {
        user: req.user.id,
        startDate,
        week: createEmptyWeek()
      }
    }, {
      new: true,
      upsert: true
    });
    res.status(201).json({ message: 'Meal plan created', plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's meal plan
router.get('/', authMiddleware, async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    if (isNaN(startDate)) return res.status(400).json({ message: 'Valid startDate required' });

    const plan = await MealPlan.findOne({ user: req.user.id, startDate })
      .populate('week.monday.Breakfast week.monday.Lunch week.monday.Dinner ' +
                'week.tuesday.Breakfast week.tuesday.Lunch week.tuesday.Dinner ' +
                'week.wednesday.Breakfast week.wednesday.Lunch week.wednesday.Dinner ' +
                'week.thursday.Breakfast week.thursday.Lunch week.thursday.Dinner ' +
                'week.friday.Breakfast week.friday.Lunch week.friday.Dinner ' +
                'week.saturday.Breakfast week.saturday.Lunch week.saturday.Dinner ' +
                'week.sunday.Breakfast week.sunday.Lunch week.sunday.Dinner');
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign recipe to a slot
router.put('/:day/:slot', authMiddleware, async (req, res) => {
  try {
    const { day, slot } = req.params;
    const { recipeId, startDate } = req.body;

    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate)) return res.status(400).json({ message: 'Valid startDate required' });

    const emptyWeek = createEmptyWeek();
    if (!emptyWeek[day]) return res.status(400).json({ message: 'Invalid day' });
    if (emptyWeek[day][slot] === undefined) return res.status(400).json({ message: 'Invalid slot' });

    let plan = await MealPlan.findOne({ user: req.user.id, startDate: parsedDate });
    if (!plan) {
      plan = new MealPlan({ user: req.user.id, startDate: parsedDate, week: emptyWeek });
    }

    // Fix for legacy schema where week days were arrays
    if (Array.isArray(plan.week[day]) || Array.isArray(plan.week.monday)) {
      await MealPlan.findByIdAndDelete(plan._id);
      plan = new MealPlan({ user: req.user.id, startDate: parsedDate, week: emptyWeek });
    }

    plan.week[day][slot] = recipeId;
    plan.markModified(`week.${day}.${slot}`);
    await plan.save();
    res.json({ message: `Recipe added to ${day} ${slot}`, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear a slot
router.delete('/:day/:slot', authMiddleware, async (req, res) => {
  try {
    const { day, slot } = req.params;
    const startDate = new Date(req.query.startDate);
    if (isNaN(startDate)) return res.status(400).json({ message: 'Valid startDate required' });

    const plan = await MealPlan.findOne({ user: req.user.id, startDate });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
    
    // Fix for legacy schema where week days were arrays
    if (Array.isArray(plan.week[day]) || Array.isArray(plan.week.monday)) {
      await MealPlan.findByIdAndDelete(plan._id);
      plan = new MealPlan({ user: req.user.id, startDate, week: createEmptyWeek() });
    }

    if (!plan.week[day]) return res.status(400).json({ message: 'Invalid day' });
    if (plan.week[day][slot] === undefined) return res.status(400).json({ message: 'Invalid slot' });

    plan.week[day][slot] = null;
    await plan.save();
    res.json({ message: `${day} ${slot} cleared`, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk save entire week plan
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, week } = req.body;
    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate)) return res.status(400).json({ message: 'Valid startDate required' });

    let plan = await MealPlan.findOne({ user: req.user.id, startDate: parsedDate });
    if (!plan) {
      plan = new MealPlan({ user: req.user.id, startDate: parsedDate, week: createEmptyWeek() });
    }

    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const slotKeys = ['Breakfast', 'Lunch', 'Dinner'];

    for (const day of dayKeys) {
      for (const slot of slotKeys) {
        const recipeId = week?.[day]?.[slot] || null;
        plan.week[day][slot] = recipeId;
        plan.markModified(`week.${day}.${slot}`);
      }
    }

    await plan.save();
    res.json({ message: 'Meal plan saved', plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
