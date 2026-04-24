const connectDB = require('./db/connection');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ message: 'MealPlanner API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));