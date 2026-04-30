const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// protected route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'User profile fetched',
        user: req.user
    });
});

module.exports = router;