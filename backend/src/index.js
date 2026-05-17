const connectDB = require('./db/connection');
const routes = require('./routes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

connectDB();

app.use(cors());

app.use(express.json({ limit: '15mb' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      message: 'Recipe image is too large. Please choose a smaller image.'
    });
  }

  return next(err);
});

app.use('/api', routes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) =>
  res.status(200).json({ message: 'MealPlanner API running' })
);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;