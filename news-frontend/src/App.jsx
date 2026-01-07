
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import  {AuthProvider}  from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ArticlePage from './pages/ArticlePage';
import CreateArticlePage from './pages/CreateArticlePage';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';


const MainLayout = () => {
  return(

    <>
  <Navbar/>
  <main>
    <Outlet/>
  </main>
  </>
  );
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar/>
          
          <main className="flex-1">
            <Routes>
              {/* public routes */}
               <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* protected routes */}

              <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/create-article" element={<CreateArticlePage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path ="/profile" element={<ProfilePage/>}/>
              </Route>
             
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-slate-800 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400">
                © 2025 News Feed. 
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;