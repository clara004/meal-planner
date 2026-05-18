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

## Screenshots

<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/1e83c789-17ea-4655-81e0-737905385f7d" />
<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/59b3214e-1e8d-4819-8806-d9dfd1a66f9e" />
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/7397017b-4197-4054-abf3-1bd379938d31" />
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/1f548d84-3f41-46b4-8159-9a6296225a8d" />

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

**Description**: The Vitality Kitchen REST API enables full interaction with user accounts, recipes, favorites, and weekly meal planning logic.
**Base URL**: `http://localhost:5000/api`

### Common Error Codes
* **400 Bad Request**: Missing or invalid parameters.
* **401 Unauthorized**: Missing or invalid JWT Bearer token.
* **404 Not Found**: The requested resource (e.g., Recipe ID) does not exist.
* **500 Internal Server Error**: A server-side error occurred.

---

### 1. Authentication
#### `POST /auth/login`
* **Description**: Authenticates a user and returns a JWT token.
* **Parameters (Body)**:
  * `email` (string, required): User's email address.
  * `password` (string, required): User's password.
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": { "id": "60d5ec...", "name": "John Doe", "email": "john@example.com" }
  }
  ```

---

### 2. User & Profile
#### `GET /user/profile`
* **Description**: Retrieves the current logged-in user's profile and application statistics.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters**: None.
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "user": { "name": "John Doe", "dietary_prefs": ["Vegan"] },
    "stats": { "recipesCreated": 5, "mealsPlanned": 12, "recipesRated": 3 },
    "mealPlans": [ /* Array of saved plans */ ]
  }
  ```

#### `POST /user/favorites/:recipeId`
* **Description**: Adds a specific recipe to the user's favorites list.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters (Path)**:
  * `recipeId` (string, required): The MongoDB ID of the recipe.
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "message": "Added to favorites",
    "favorites": ["60d5ec...", "60d5ed..."],
    "isFavorite": true
  }
  ```

#### `DELETE /user/favorites/:recipeId`
* **Description**: Removes a specific recipe from the user's favorites list unconditionally.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters (Path)**:
  * `recipeId` (string, required): The MongoDB ID of the recipe.
* **Response**: `200 OK`

---

### 3. Recipes
#### `POST /recipes`
* **Description**: Creates a new user-generated recipe with automatically calculated nutritional values.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters (Body)**:
  * `title` (string, required)
  * `category` (string, required)
  * `cuisine` (string, required)
  * `ingredients` (array of objects, required): Must contain `name`, `quantity`, `unit`, and `calories`.
  * `steps` (array of strings, required)
* **Response**: `201 Created`
* **Example**:
  ```json
  {
    "message": "Recipe created successfully",
    "recipe": { "_id": "60d5ef...", "title": "Mango Bowl", "totalNutrition": { "calories": 450 } }
  }
  ```

#### `GET /recipes`
* **Description**: Fetches a list of all available recipes (both system-seeded and public user-created).
* **Parameters**: None.
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "recipes": [
      { "_id": "60d5ef...", "title": "Mango Bowl", "averageRating": 4.5 }
    ]
  }
  ```

---

### 4. Meal Planning
#### `POST /meal-plans`
* **Description**: Saves or updates a weekly meal plan for the user.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters (Body)**:
  * `startDate` (string, required): ISO date string representing Monday of the given week.
  * `days` (array, required): Array of 7 day objects, each containing arrays for `breakfast`, `lunch`, `dinner`, and `snacks` with corresponding recipe IDs.
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "message": "Meal plan updated successfully",
    "mealPlan": { "startDate": "2026-05-18T00:00:00.000Z", "days": [ ... ] }
  }
  ```

#### `GET /meal-plans/grocery-list`
* **Description**: Aggregates all ingredients required for meals planned within a specific date range.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters (Query)**:
  * `start` (string, required): Start date (YYYY-MM-DD).
  * `end` (string, required): End date (YYYY-MM-DD).
* **Response**: `200 OK`
* **Example**:
  ```json
  {
    "startDate": "2026-05-18",
    "endDate": "2026-05-24",
    "groceryList": [
      { "name": "Mango", "totalQuantity": 2, "unit": "piece" },
      { "name": "Quinoa", "totalQuantity": 3, "unit": "cup" }
    ]
  }
  ```

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
Designed and developed as a modern, coding project utilizing the MERN stack by students at Ain Shams University - Faculty of Computer and Information Science 2026. Icons provided by Google Material Symbols and images sourced via Unsplash.

