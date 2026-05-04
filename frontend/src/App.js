import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Dashboard from './pages/Dashboard';
import GroceryList from "./pages/GroceryList";
import MealPlanner from './pages/MealPlanner';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/grocery" element={<GroceryList />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/CreateRecipe" element={<CreateRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-recipe" element={
          <ProtectedRoute>
            <CreateRecipe />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;