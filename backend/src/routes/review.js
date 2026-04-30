const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

// CREATE REVIEW
router.post('/:recipeId', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { recipeId } = req.params;

    // does recipe exist?
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // is it your own recipe?
    if (recipe.user.toString() === req.user.id)
      return res.status(403).json({ message: 'You cannot review your own recipe' });

    // already reviewed?
    const existing = await Review.findOne({ user: req.user.id, recipe: recipeId });
    if (existing)
      return res.status(400).json({ message: 'You already reviewed this recipe' });

    // save review
    const review = new Review({
      recipe: recipeId,
      user: req.user.id,
      rating,
      comment
    });
    await review.save();

    // calculate new average
    const allReviews = await Review.find({ recipe: recipeId });
    const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    res.status(201).json({ 
      message: 'Review added', 
      review,
      averageRating: average.toFixed(1)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL REVIEWS FOR A RECIPE
router.get('/:recipeId', async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'name'); // show user's name not just ID

    // calculate average
    const average = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ 
      reviews,
      averageRating: average.toFixed(1),
      totalReviews: reviews.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE REVIEW
router.put('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // is it your review?
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating: req.body.rating, comment: req.body.comment },
      { new: true }
    );

    res.json({ message: 'Review updated', review: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE REVIEW
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // is it your review?
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;