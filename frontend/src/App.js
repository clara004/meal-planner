import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Recipes from './pages/Recipes'; 
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe'; 

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

         {/* The Create Recipe page*/}
        <Route path="/create-recipe" element={<CreateRecipe />} />   
        {/* This ":id" tells React to catch any recipe name in the URL 
            and send it to the RecipeDetail file */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        {/* ──────────────────────────────────────────────────────── */}

        {/* Dashboard */}
        <Route path="/dashboard" element={<div>Dashboard Coming Soon...</div>} />
      </Routes>
    </Router>
  );
}

export default App;