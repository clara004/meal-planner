import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import GroceryList from "./pages/GroceryList";
import MealPlanner from './pages/MealPlanner';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

function HomeOrDashboard() {
  const token = localStorage.getItem('token');
  return token ? <Dashboard /> : <Home />;
}

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeOrDashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/grocery" element={<GroceryList />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/recipes/create" element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          } />
          <Route path="/recipes/edit/:id" element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          } />
          <Route path="/create-recipe" element={<Navigate to="/recipes/create" replace />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
