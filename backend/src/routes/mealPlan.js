const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const MealPlan = require("../models/MealPlan");

const createEmptyWeek = () => {
  const emptyDay = { Breakfast: null, Lunch: null, Dinner: null };
  return {
    monday: { ...emptyDay },
    tuesday: { ...emptyDay },
    wednesday: { ...emptyDay },
    thursday: { ...emptyDay },
    friday: { ...emptyDay },
    saturday: { ...emptyDay },
    sunday: { ...emptyDay },
  };
};

// Normalize to midnight UTC so timezone offsets never cause duplicate documents
const toUTCMidnight = (d) => {
  const date = new Date(d);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
};

// Helper for Levenshtein distance
const getLevenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// Normalize units to a standard form
const normalizeUnit = (unit) => {
  if (!unit) return "";
  const u = unit.toLowerCase().trim();
  if (/^g(ram)?s?$/.test(u)) return "g";
  if (/^kg(ilogram)?s?$/.test(u)) return "kg";
  if (/^ml(illiliter)?s?$/.test(u)) return "ml";
  if (/^l(iter)?s?$/.test(u)) return "l";
  if (/^(peice|piece|pieces|picies|pc|pcs)s?$/.test(u)) return "pieces";
  if (/^tsp|teaspoon[s]?$/.test(u)) return "tsp";
  if (/^tbsp|tablespoon[s]?$/.test(u)) return "tbsp";
  if (/^cup[s]?$/.test(u)) return "cups";
  if (/^clove[s]?$/.test(u)) return "cloves";
  if (/^can[s]?$/.test(u)) return "cans";
  if (/^pinch[es]?$/.test(u)) return "pinches";
  if (/^slice[s]?$/.test(u)) return "slices";
  if (/^pack(age)?s?$/.test(u)) return "packs";
  if (/^bottle[s]?$/.test(u)) return "bottles";
  if (/^head[s]?$/.test(u)) return "heads";
  if (/^bunch[es]?$/.test(u)) return "bunches";
  return u;
};

// Plural to singular standardizations
const singularize = (name) => {
  let n = name.toLowerCase().trim();
  if (n.endsWith("ies")) {
    n = n.slice(0, -3) + "y";
  } else if (
    n.endsWith("es") &&
    (n.endsWith("ches") ||
      n.endsWith("shes") ||
      n.endsWith("xes") ||
      n.endsWith("zes") ||
      n.endsWith("toes") ||
      n.endsWith("goes"))
  ) {
    n = n.slice(0, -2);
  } else if (
    n.endsWith("s") &&
    !n.endsWith("ss") &&
    !n.endsWith("us") &&
    !n.endsWith("is") &&
    !n.endsWith("as")
  ) {
    n = n.slice(0, -1);
  }
  return n;
};

const cleanName = (name) => {
  let n = name.toLowerCase().trim();
  n = n.replace(/\s+/g, " ");
  return singularize(n);
};

const areSimilarIngredients = (name1, name2) => {
  const c1 = cleanName(name1);
  const c2 = cleanName(name2);
  if (c1 === c2) return true;

  const distance = getLevenshteinDistance(c1, c2);
  const minLength = Math.min(c1.length, c2.length);

  if (minLength <= 4) {
    return distance === 0; // exact match for short words
  }
  return distance <= 2; // tolerate small typos/differences for longer words
};

const formatUnit = (quantity, unit) => {
  if (!unit) return "";
  const q = parseFloat(quantity);
  if (q === 1) {
    if (unit === "pieces") return "piece";
    if (unit === "cups") return "cup";
    if (unit === "cloves") return "clove";
    if (unit === "cans") return "can";
    if (unit === "pinches") return "pinch";
    if (unit === "slices") return "slice";
    if (unit === "packs") return "pack";
    if (unit === "bottles") return "bottle";
    if (unit === "heads") return "head";
    if (unit === "bunches") return "bunch";
  } else {
    if (unit === "piece") return "pieces";
    if (unit === "cup") return "cups";
    if (unit === "clove") return "cloves";
    if (unit === "can") return "cans";
    if (unit === "pinch") return "pinches";
    if (unit === "slice") return "slices";
    if (unit === "pack") return "packs";
    if (unit === "bottle") return "bottles";
    if (unit === "head") return "heads";
    if (unit === "bunch") return "bunches";
  }
  return unit;
};

// Create empty weekly plan
router.post("/", authMiddleware, async (req, res) => {
  try {
    const startDate = toUTCMidnight(req.body.startDate);
    if (isNaN(startDate))
      return res.status(400).json({ message: "Valid startDate required" });

    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user.id, startDate },
      {
        $setOnInsert: {
          user: req.user.id,
          startDate,
          week: createEmptyWeek(),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
    res.status(201).json({ message: "Meal plan created", plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's meal plan
router.get("/", authMiddleware, async (req, res) => {
  try {
    const startDate = toUTCMidnight(req.query.startDate);
    if (isNaN(startDate))
      return res.status(400).json({ message: "Valid startDate required" });

    const plan = await MealPlan.findOne({
      user: req.user.id,
      startDate,
    }).populate(
      "week.monday.Breakfast week.monday.Lunch week.monday.Dinner " +
        "week.tuesday.Breakfast week.tuesday.Lunch week.tuesday.Dinner " +
        "week.wednesday.Breakfast week.wednesday.Lunch week.wednesday.Dinner " +
        "week.thursday.Breakfast week.thursday.Lunch week.thursday.Dinner " +
        "week.friday.Breakfast week.friday.Lunch week.friday.Dinner " +
        "week.saturday.Breakfast week.saturday.Lunch week.saturday.Dinner " +
        "week.sunday.Breakfast week.sunday.Lunch week.sunday.Dinner",
    );
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate shopping list from current week's meal plan
router.get("/shopping-list", authMiddleware, async (req, res) => {
  try {
    const startDate = toUTCMidnight(req.query.startDate);
    if (isNaN(startDate))
      return res.status(400).json({ message: "Valid startDate required" });

    const plan = await MealPlan.findOne({
      user: req.user.id,
      startDate,
    }).populate(
      "week.monday.Breakfast week.monday.Lunch week.monday.Dinner " +
        "week.tuesday.Breakfast week.tuesday.Lunch week.tuesday.Dinner " +
        "week.wednesday.Breakfast week.wednesday.Lunch week.wednesday.Dinner " +
        "week.thursday.Breakfast week.thursday.Lunch week.thursday.Dinner " +
        "week.friday.Breakfast week.friday.Lunch week.friday.Dinner " +
        "week.saturday.Breakfast week.saturday.Lunch week.saturday.Dinner " +
        "week.sunday.Breakfast week.sunday.Lunch week.sunday.Dinner",
    );

    if (!plan)
      return res
        .status(404)
        .json({ message: "No meal plan found for this week" });

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const slots = ["Breakfast", "Lunch", "Dinner"];

    // Collect all planned recipes from the week (allowing duplicates)
    const plannedRecipes = [];
    const uniqueRecipes = new Map();
    for (const day of days) {
      for (const slot of slots) {
        const recipe = plan.week[day][slot];
        if (recipe && recipe._id) {
          plannedRecipes.push(recipe);
          uniqueRecipes.set(recipe._id.toString(), recipe);
        }
      }
    }

    // Merge ingredients across all recipes
    const mergedIngredients = [];
    for (const recipe of plannedRecipes) {
      for (const ingredient of recipe.ingredients) {
        if (!ingredient.name) continue;

        const name = ingredient.name;
        const quantity = ingredient.quantity || 0;
        const unit = ingredient.unit || "";
        const normUnit = normalizeUnit(unit);

        let found = false;
        for (const existing of mergedIngredients) {
          if (
            areSimilarIngredients(existing.name, name) &&
            normalizeUnit(existing.unit) === normUnit
          ) {
            existing.quantity = (existing.quantity || 0) + quantity;
            // Keep the longer name (which is usually the correct/complete one)
            if (name.trim().length > existing.name.trim().length) {
              existing.name = name;
            }
            found = true;
            break;
          }
        }

        if (!found) {
          mergedIngredients.push({
            name: name,
            quantity: quantity,
            unit: normUnit || unit,
          });
        }
      }
    }

    // Format all units to singular/plural depending on final quantity
    const ingredients = mergedIngredients.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: formatUnit(item.quantity, item.unit),
    }));

    // Build recipes included summary
    const recipesIncluded = Array.from(uniqueRecipes.values()).map((r) => ({
      title: r.title,
      servings: r.servings,
      image: r.image || null,
    }));

    res.json({
      startDate,
      ingredients,
      recipesIncluded,
      total: ingredients.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign recipe to a slot
router.put("/:day/:slot", authMiddleware, async (req, res) => {
  try {
    const { day, slot } = req.params;
    const { recipeId, startDate } = req.body;

    const parsedDate = toUTCMidnight(startDate);
    if (isNaN(parsedDate))
      return res.status(400).json({ message: "Valid startDate required" });

    const emptyWeek = createEmptyWeek();
    if (!emptyWeek[day])
      return res.status(400).json({ message: "Invalid day" });
    if (emptyWeek[day][slot] === undefined)
      return res.status(400).json({ message: "Invalid slot" });

    let plan = await MealPlan.findOne({
      user: req.user.id,
      startDate: parsedDate,
    });
    if (!plan) {
      plan = new MealPlan({
        user: req.user.id,
        startDate: parsedDate,
        week: emptyWeek,
      });
    }

    // Fix for legacy schema where week days were arrays
    if (Array.isArray(plan.week[day]) || Array.isArray(plan.week.monday)) {
      await MealPlan.findByIdAndDelete(plan._id);
      plan = new MealPlan({
        user: req.user.id,
        startDate: parsedDate,
        week: emptyWeek,
      });
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
router.delete("/:day/:slot", authMiddleware, async (req, res) => {
  try {
    const { day, slot } = req.params;
    const startDate = toUTCMidnight(req.query.startDate);
    if (isNaN(startDate))
      return res.status(400).json({ message: "Valid startDate required" });

    const plan = await MealPlan.findOne({ user: req.user.id, startDate });
    if (!plan) return res.status(404).json({ message: "Meal plan not found" });

    // Fix for legacy schema where week days were arrays
    if (Array.isArray(plan.week[day]) || Array.isArray(plan.week.monday)) {
      await MealPlan.findByIdAndDelete(plan._id);
      plan = new MealPlan({
        user: req.user.id,
        startDate,
        week: createEmptyWeek(),
      });
    }

    if (!plan.week[day])
      return res.status(400).json({ message: "Invalid day" });
    if (plan.week[day][slot] === undefined)
      return res.status(400).json({ message: "Invalid slot" });

    plan.week[day][slot] = null;
    await plan.save();
    res.json({ message: `${day} ${slot} cleared`, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk save entire week plan
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, week } = req.body;
    const parsedDate = toUTCMidnight(startDate);
    if (isNaN(parsedDate))
      return res.status(400).json({ message: "Valid startDate required" });

    let plan = await MealPlan.findOne({
      user: req.user.id,
      startDate: parsedDate,
    });
    if (!plan) {
      plan = new MealPlan({
        user: req.user.id,
        startDate: parsedDate,
        week: createEmptyWeek(),
      });
    }

    const dayKeys = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const slotKeys = ["Breakfast", "Lunch", "Dinner"];

    for (const day of dayKeys) {
      for (const slot of slotKeys) {
        const recipeId = week?.[day]?.[slot] || null;
        plan.week[day][slot] = recipeId;
        plan.markModified(`week.${day}.${slot}`);
      }
    }

    await plan.save();
    res.json({ message: "Meal plan saved", plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
