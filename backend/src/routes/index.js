//The Route manager file
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const mealRoutes = require('./meal');
const recipeRoutes = require ('./recipe');
const mealPlanRoutes = require('./mealPlan');


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/meals', mealRoutes);
router.use('/recipes',recipeRoutes);
router.use('/mealplan', mealPlanRoutes);

module.exports = router;