// src/App.jsx
// Main application component using Tailwind CSS

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ArticlePage from './pages/ArticlePage';
import CreateArticlePage from './pages/CreateArticlePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/createArticle" element={<CreateArticlePage />} />
             
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-slate-800 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400">
                © 2024 News Feed. Built with React & Tailwind CSS
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;