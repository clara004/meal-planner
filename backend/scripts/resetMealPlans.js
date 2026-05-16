const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MealPlan = require('../src/models/MealPlan');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await MealPlan.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} meal plan(s).`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
