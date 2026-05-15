import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import ContactUs from './pages/ContactUs'; // 1. Import Contact

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
        <Header /> 

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />   
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* 2. Added Contact Route */}
            <Route path="/contact" element={<ContactUs />} />

            <Route path="/dashboard" element={<div className="pt-40 px-6 text-center font-['Lexend'] text-[#064e3b]">Coming Soon...</div>} />
          </Routes>
        </main>

        <Footer /> 
      </div>
    </Router>
  );
}

export default App;