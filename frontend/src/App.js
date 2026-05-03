import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Recipes from './pages/Recipes'; 
import RecipeDetail from './pages/RecipeDetail';
import GroceryList from "./pages/GroceryList";
import MealPlanner from './pages/MealPlanner';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Login/Register Page */}
        <Route path="/login" element={<AuthPage />} />

        {/* The Recipes Gallery Page */}
        <Route path="/recipes" element={<Recipes />} />

        {/* ── THE MISSING PIECE ──────────────────────────────────── */}
        {/* This ":id" tells React to catch any recipe name in the URL 
            and send it to the RecipeDetail file */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        {/* ──────────────────────────────────────────────────────── */}

        <Route path="/grocery" element={<GroceryList />} />

        <Route path="/meal-planner" element={<MealPlanner />} />

        <Route path="/profile" element={<Profile />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<div>Dashboard Coming Soon...</div>} />
      </Routes>
    </Router>
  );
}

export default App;