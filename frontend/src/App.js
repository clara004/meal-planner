import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';

import Header from './pages/header';
import Footer from './pages/footer';
import Home from './pages/Home';
import About from './pages/about';
import AuthPage from './pages/AuthPage';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import GroceryList from "./pages/GroceryList";
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

function HomeOrDashboard() {
  const token = localStorage.getItem('token');
  return token ? <Dashboard /> : <Home />;
}

function AppContent() {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {!isAuthPage && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/create-recipe" element={<Navigate to="/recipes/create" replace />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/" element={<HomeOrDashboard />} />
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
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <AppContent />
      </Router>
    </FavoritesProvider>
  );
}

export default App;