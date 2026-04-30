const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { validate, recipeRules } = require('../middleware/validate'); 
const Recipe = require('../models/Recipe');

//helper function (reuse logic)
const calculateNutrition = (ingredients, servings) => {
  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

  ingredients.forEach(ing => {
    totalCalories += ing.calories || 0;
    totalProtein += ing.protein || 0;
    totalCarbs += ing.carbs || 0;
    totalFat += ing.fat || 0;
  });

  return {
    totalNutrition: {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    },
    perServing: {
      calories: servings ? totalCalories / servings : 0,
      protein: servings ? totalProtein / servings : 0,
      carbs: servings ? totalCarbs / servings : 0,
      fat: servings ? totalFat / servings : 0
    }
  };
};

// ✅ Create Recipe
router.post('/', authMiddleware, recipeRules, validate, async (req, res) => {
  try {
    const { ingredients = [], servings } = req.body;

    const nutrition = calculateNutrition(ingredients, servings);

    const recipe = new Recipe({
      ...req.body,
      user: req.user.id,
      ...nutrition
    });

    await recipe.save();

    res.status(201).json({ message: 'Recipe created', recipe });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all recipes (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, maxCalories, dietaryTag, minRating, sortBy } = req.query;

    let query = {};

    // search by title OR ingredient name
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }

    // filter by cuisine
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    // filter by max calories per serving
    if (maxCalories) {
      query['perServing.calories'] = { $lte: Number(maxCalories) };
    }

    // filter by dietary tag
    if (dietaryTag) {
      query.dietaryTags = { $in: [dietaryTag] };
    }

    // sorting
    let sort = {};
    if (sortBy === 'rating') sort = { averageRating: -1 };
    else if (sortBy === 'newest') sort = { createdAt: -1 };

    const recipes = await Recipe.find(query).sort(sort);

    // filter by minimum rating AFTER fetching
    if (minRating) {
      const Review = require('../models/Review');
      const filtered = [];

      for (const recipe of recipes) {
        const reviews = await Review.find({ recipe: recipe._id });
        if (reviews.length === 0) continue;
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        if (avg >= Number(minRating)) filtered.push(recipe);
      }

      return res.json({ recipes: filtered });
    }

    res.json({ recipes });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ recipe });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update recipe (recalculate nutrition)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { ingredients, servings } = req.body;

    if (ingredients) {
      const nutrition = calculateNutrition(ingredients, servings || recipe.servings);
      Object.assign(req.body, nutrition);
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Recipe updated', recipe: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete recipe
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;