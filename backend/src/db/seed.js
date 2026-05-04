require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const connectDB = require('./connection');

const seed = async () => {
  try {
    await connectDB();

    let user = await User.findOne();
    if (!user) {
      console.log('❌ No users found! Please register an account first, then run seed again.');
      process.exit(1);
    }

    const recipes = [
      {
        user: user._id,
        title: "Avocado Toast with Poached Eggs",
        description: "A healthy breakfast packed with good fats and protein.",
        category: "Breakfast",
        cuisine: "American",
        dietaryTags: ["Vegetarian", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800",
        prepTime: 15,
        servings: 2,
        ingredients: [
          { name: "Sourdough bread", calories: 120, protein: 4, carbs: 24, fat: 1 },
          { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15 },
          { name: "Eggs", calories: 140, protein: 12, carbs: 1, fat: 10 },
          { name: "Cherry tomatoes", calories: 30, protein: 1, carbs: 6, fat: 0 },
        ],
        steps: [
          "Toast sourdough slices until golden and crispy.",
          "Mash avocado with lemon juice, salt and pepper.",
          "Poach eggs in simmering water for 3 minutes.",
          "Spread avocado on toast and top with poached egg."
        ],
        totalNutrition: { calories: 450, protein: 19, carbs: 40, fat: 26 },
        perServing: { calories: 225, protein: 10, carbs: 20, fat: 13 }
      },
      {
        user: user._id,
        title: "Grilled Salmon with Quinoa",
        description: "High protein dinner with omega-3 rich salmon and quinoa.",
        category: "Dinner",
        cuisine: "Mediterranean",
        dietaryTags: ["Gluten-Free", "Keto"],
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
        prepTime: 25,
        servings: 2,
        ingredients: [
          { name: "Salmon fillet", calories: 280, protein: 39, carbs: 0, fat: 13 },
          { name: "Quinoa", calories: 220, protein: 8, carbs: 39, fat: 4 },
          { name: "Lemon", calories: 10, protein: 0, carbs: 3, fat: 0 },
          { name: "Olive oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
        ],
        steps: [
          "Rinse and cook quinoa in water for 15 minutes.",
          "Season salmon with lemon, garlic, salt and pepper.",
          "Grill salmon on medium heat for 4 minutes each side.",
          "Plate quinoa and top with grilled salmon."
        ],
        totalNutrition: { calories: 630, protein: 47, carbs: 42, fat: 31 },
        perServing: { calories: 315, protein: 24, carbs: 21, fat: 16 }
      },
      {
        user: user._id,
        title: "Acai Berry Smoothie Bowl",
        description: "Antioxidant-packed smoothie bowl topped with fresh fruits.",
        category: "Breakfast",
        cuisine: "Brazilian",
        dietaryTags: ["Vegan", "Vegetarian"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
        prepTime: 10,
        servings: 1,
        ingredients: [
          { name: "Frozen acai", calories: 100, protein: 2, carbs: 10, fat: 6 },
          { name: "Banana", calories: 90, protein: 1, carbs: 23, fat: 0 },
          { name: "Almond milk", calories: 30, protein: 1, carbs: 1, fat: 3 },
          { name: "Granola", calories: 120, protein: 3, carbs: 22, fat: 3 },
        ],
        steps: [
          "Blend acai, banana, and almond milk until smooth.",
          "Pour into a bowl — it should be thick.",
          "Top with granola, berries, and honey."
        ],
        totalNutrition: { calories: 340, protein: 7, carbs: 56, fat: 12 },
        perServing: { calories: 340, protein: 7, carbs: 56, fat: 12 }
      },
      {
        user: user._id,
        title: "Chicken Caesar Salad",
        description: "Classic Caesar salad with grilled chicken and parmesan.",
        category: "Lunch",
        cuisine: "Italian",
        dietaryTags: ["Gluten-Free"],
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
        prepTime: 20,
        servings: 2,
        ingredients: [
          { name: "Chicken breast", calories: 220, protein: 42, carbs: 0, fat: 5 },
          { name: "Romaine lettuce", calories: 20, protein: 1, carbs: 4, fat: 0 },
          { name: "Parmesan", calories: 80, protein: 7, carbs: 1, fat: 5 },
          { name: "Caesar dressing", calories: 150, protein: 1, carbs: 2, fat: 16 },
        ],
        steps: [
          "Season and grill chicken breast for 6 minutes each side.",
          "Let rest 5 minutes then slice into strips.",
          "Toss romaine lettuce with Caesar dressing.",
          "Top with sliced chicken and parmesan."
        ],
        totalNutrition: { calories: 470, protein: 51, carbs: 7, fat: 26 },
        perServing: { calories: 235, protein: 26, carbs: 4, fat: 13 }
      },
      {
        user: user._id,
        title: "Veggie Buddha Bowl",
        description: "Colorful bowl with roasted veggies, chickpeas, and tahini.",
        category: "Lunch",
        cuisine: "Asian",
        dietaryTags: ["Vegan", "Vegetarian", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
        prepTime: 30,
        servings: 2,
        ingredients: [
          { name: "Chickpeas", calories: 180, protein: 10, carbs: 30, fat: 3 },
          { name: "Sweet potato", calories: 130, protein: 2, carbs: 30, fat: 0 },
          { name: "Kale", calories: 35, protein: 2, carbs: 7, fat: 0 },
          { name: "Brown rice", calories: 220, protein: 5, carbs: 46, fat: 2 },
        ],
        steps: [
          "Roast sweet potato and chickpeas at 200C for 25 minutes.",
          "Cook brown rice according to package instructions.",
          "Mix tahini with lemon juice and garlic for dressing.",
          "Layer rice, kale, roasted veggies and drizzle with tahini."
        ],
        totalNutrition: { calories: 565, protein: 19, carbs: 113, fat: 5 },
        perServing: { calories: 283, protein: 10, carbs: 57, fat: 3 }
      },
      {
        user: user._id,
        title: "Keto Beef Stir Fry",
        description: "Low-carb beef stir fry with colorful vegetables.",
        category: "Dinner",
        cuisine: "Asian",
        dietaryTags: ["Keto", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
        prepTime: 20,
        servings: 2,
        ingredients: [
          { name: "Beef strips", calories: 300, protein: 35, carbs: 0, fat: 18 },
          { name: "Bell peppers", calories: 40, protein: 1, carbs: 9, fat: 0 },
          { name: "Broccoli", calories: 55, protein: 4, carbs: 11, fat: 0 },
          { name: "Soy sauce", calories: 20, protein: 2, carbs: 2, fat: 0 },
        ],
        steps: [
          "Slice bell peppers and cut broccoli into florets.",
          "Stir fry beef strips on high heat for 3 minutes.",
          "Add vegetables and stir fry for 4 more minutes.",
          "Add soy sauce and sesame oil, toss and serve."
        ],
        totalNutrition: { calories: 415, protein: 42, carbs: 22, fat: 18 },
        perServing: { calories: 208, protein: 21, carbs: 11, fat: 9 }
      },
      {
        user: user._id,
        title: "Overnight Oats",
        description: "Easy make-ahead breakfast with oats, chia seeds, and fresh fruit.",
        category: "Breakfast",
        cuisine: "American",
        dietaryTags: ["Vegetarian", "Vegan"],
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800",
        prepTime: 5,
        servings: 1,
        ingredients: [
          { name: "Rolled oats", calories: 150, protein: 5, carbs: 27, fat: 3 },
          { name: "Almond milk", calories: 30, protein: 1, carbs: 1, fat: 3 },
          { name: "Chia seeds", calories: 60, protein: 3, carbs: 5, fat: 4 },
          { name: "Banana", calories: 90, protein: 1, carbs: 23, fat: 0 },
        ],
        steps: [
          "Combine oats, chia seeds, and almond milk in a jar.",
          "Cover and refrigerate overnight or at least 4 hours.",
          "Top with banana slices and drizzle with honey."
        ],
        totalNutrition: { calories: 330, protein: 10, carbs: 56, fat: 10 },
        perServing: { calories: 330, protein: 10, carbs: 56, fat: 10 }
      },
      {
        user: user._id,
        title: "Mediterranean Quinoa Salad",
        description: "Fresh salad with quinoa, feta, olives, and vegetables.",
        category: "Lunch",
        cuisine: "Mediterranean",
        dietaryTags: ["Vegetarian", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=800",
        prepTime: 20,
        servings: 2,
        ingredients: [
          { name: "Quinoa", calories: 220, protein: 8, carbs: 39, fat: 4 },
          { name: "Feta cheese", calories: 100, protein: 5, carbs: 2, fat: 8 },
          { name: "Cucumber", calories: 20, protein: 1, carbs: 4, fat: 0 },
          { name: "Olives", calories: 80, protein: 1, carbs: 4, fat: 7 },
        ],
        steps: [
          "Cook quinoa and let cool to room temperature.",
          "Dice cucumber and halve cherry tomatoes.",
          "Combine quinoa, veggies, olives and feta.",
          "Drizzle with olive oil and lemon juice, season to taste."
        ],
        totalNutrition: { calories: 420, protein: 15, carbs: 49, fat: 19 },
        perServing: { calories: 210, protein: 8, carbs: 25, fat: 10 }
      }
    ];

    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');
    await Recipe.insertMany(recipes);
    console.log('✅ Seeded 8 recipes successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();