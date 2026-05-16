# Vitality Kitchen (Meal Planner)

## Motivation
Vitality Kitchen is a comprehensive meal planning and recipe management application. The motivation behind this project was to create a centralized platform where users can discover healthy, macro-calculated recipes, organize their weekly meals, and automatically generate grocery lists. We wanted to eliminate the friction of figuring out "what's for dinner" by providing a dynamic, database-driven application focused on nutrition, beautiful design, and seamless user experience.

## Build Status
The application is fully functional. Both the backend API and the frontend React application are stable. The test suite for the API is currently passing (27/27 tests). 

## Code Style
This project adheres to standard JavaScript conventions with an emphasis on functional React components, hooks, and modern ES6+ syntax on the backend.
- **Frontend**: Clean component architecture, custom React hooks, global state management via Context API (e.g., `FavoritesContext`), and strict form validation using Formik & Yup.
- **Backend**: MVC-inspired architecture with separated routes, middleware (JWT authentication), and Mongoose models.

## Tech/Framework Used
### Frontend
* **React.js** (v18)
* **Tailwind CSS** (for styling and animations)
* **React Router DOM** (Routing)
* **Formik & Yup** (Form handling and validation)
* **Axios** (API requests)

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database and ODM)
* **JSON Web Tokens (JWT)** (Authentication)
* **Bcrypt.js** (Password hashing)
* **Jest & Supertest** (Unit and integration testing)

## Features
* **Authentication System**: Secure user registration, login, and profile management with JWT.
* **Recipe Management**: Create, edit, delete, and view recipes. Includes image uploading, custom dietary tags, and automatic total-calorie calculations.
* **Global Favorites**: Users can "heart" their favorite recipes. State is synchronized instantly across the app using React Context.
* **Recipe Ratings**: 5-star rating system to rate recipes and view the community's average scores.
* **Weekly Meal Planner**: Drag-and-drop/select interface to plan meals (Breakfast, Lunch, Dinner, Snacks) for any given week. Persists securely to the database.
* **Grocery List Generator**: Automatically calculates and aggregates the required ingredients for your planned meals in a given date range.
* **Dietary Preferences**: Set personal dietary goals (e.g., Vegan, Keto) that are saved to your user profile.
* **Dashboard/Profile**: Track personal statistics like recipes created, meals planned, and recipes rated.

## Code Example
Here is a quick look at how the application handles robust recipe creation with nested arrays (ingredients):

```javascript
// Payload submitted to POST /recipes
const payload = {
  title: "Tropical Mango Power Bowl",
  category: "Lunch",
  cuisine: "American",
  prepTime: 15,
  servings: 2,
  dietaryTags: ["Vegan", "Gluten-Free"],
  steps: ["Dice the mango.", "Mix with quinoa.", "Serve cold."],
  ingredients: [
    { name: "Mango", quantity: 1, unit: "piece", calories: 150 },
    { name: "Quinoa", quantity: 1, unit: "cup", calories: 220 }
  ],
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." // Compressed Base64
};
```

## Installation
Ensure you have Node.js and MongoDB installed on your system.

1. **Clone the repository** (or download the source code).
2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/vitality-kitchen
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   ```
   Start the development server:
   ```bash
   npm start
   ```

## API Reference
The backend exposes a RESTful API on `http://localhost:5000/api`. Most routes require a Bearer token in the `Authorization` header.

* **Auth**: 
  * `POST /auth/register` - Create a new account
  * `POST /auth/login` - Authenticate and receive JWT
* **User**: 
  * `GET /user/profile` - Get current user profile and stats
  * `PUT /user/profile` - Update user details and dietary preferences
  * `GET /user/favorites` - Get populated favorite recipes
  * `POST /user/favorites/:recipeId` - Add a recipe to favorites
  * `DELETE /user/favorites/:recipeId` - Remove a recipe from favorites
  * `DELETE /user/account` - Permanently delete account and associated data
* **Recipes**: 
  * `GET /recipes` - Fetch all public recipes
  * `GET /recipes/:id` - Get a specific recipe
  * `POST /recipes` - Create a new recipe
  * `PUT /recipes/:id` - Update a recipe
  * `DELETE /recipes/:id` - Delete a recipe
  * `POST /recipes/:id/rate` - Submit a star rating
* **Meal Plans**: 
  * `GET /meal-plans` - Get all meal plans for the user
  * `GET /meal-plans/week` - Get the meal plan for a specific week (`?startDate=YYYY-MM-DD`)
  * `POST /meal-plans` - Save or update a weekly meal plan
  * `GET /meal-plans/grocery-list` - Generate grocery list between two dates

## Tests
The backend features an extensive test suite built with **Jest** and **Supertest** using an in-memory MongoDB server to ensure tests run quickly and cleanly without affecting your actual local database.

To run the backend test suite:
```bash
cd backend
npm test
```

## How to use?
1. Open your browser to `http://localhost:3000`.
2. Click **Get Started** to register for a new account.
3. Browse the **Recipes** tab to explore meals. Click the heart icon to save them to your Favorites.
4. Navigate to the **Meal Planner** tab. Select a week and assign recipes to specific days and mealtimes.
5. Once your week is planned, click **Save Plan**.
6. Go to the **Grocery List** tab, select the date range for your planned meals, and an aggregated shopping list will be generated automatically.
7. Visit the **Profile** tab to manage your dietary preferences, view your saved meal plans, review your favorites, and track your app statistics.

## Credits
Designed and developed as a modern, agentic-assisted coding project utilizing the MERN stack. Icons provided by Google Material Symbols and images sourced via Unsplash.
