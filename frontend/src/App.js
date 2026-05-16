import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';

// Global Components
import Header from './pages/header';
import Footer from './pages/footer';
// Page Components
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

// 1. Create a wrapper component to handle the conditional logic
function AppContent() {
  const location = useLocation();
  
  // Define which paths should NOT have header and footer
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* 2. Only show Header if we are NOT on the auth page */}
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

      {/* 3. Only show Footer if we are NOT on the auth page */}
      {!isAuthPage && <Footer />} 
    </div>
  );
}

// The main App component now just provides the Router and Favorites context
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