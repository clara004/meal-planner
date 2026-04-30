import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Login/Register Page */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* You can add your dashboard here later */}
        <Route path="/dashboard" element={<div>Dashboard Coming Soon...</div>} />
      </Routes>
    </Router>
  );
}

export default App;