import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout, canEdit, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'text-gray-300 hover:bg-slate-700 hover:text-white'}
  `;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-xl py-2' : 'bg-slate-900 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <span className="text-xl">📰</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              News<span className="text-blue-500">Feed</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/categories" className={navLinkClass('/categories')}>Categories</Link>
            
            {canEdit() && (
              <Link to="/create-article" className={navLinkClass('/create-article')}>
                ✍️ Write
              </Link>
            )}

            {isAdmin() && (
              <Link to="/admin" className={navLinkClass('/admin')}>
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4 border-l border-slate-700 ml-4 pl-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Welcome back,</p>
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                </div>
                <Link to="/profile" className="hover:opacity-80 transition-opacity">
                   <div className="h-9 w-9 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                   </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-semibold text-gray-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out`}>
        <div className="bg-slate-900 h-full w-4/5 shadow-2xl p-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-lg font-medium border-b border-slate-800 pb-2">Home</Link>
            <Link to="/categories" className="text-lg font-medium border-b border-slate-800 pb-2">Categories</Link>
            {canEdit() && <Link to="/create-article" className="text-lg font-medium border-b border-slate-800 pb-2 text-blue-400">Write Article</Link>}
            
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/login" className="text-center py-3 border border-slate-700 rounded-xl">Sign In</Link>
                <Link to="/register" className="text-center py-3 bg-blue-600 rounded-xl font-bold">Register</Link>
              </div>
            ) : (
              <div className="pt-4 flex flex-col space-y-4">
                <Link to="/profile" className="flex items-center space-x-3">
                   <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)}
                   </div>
                   <span>My Profile</span>
                </Link>
                <button onClick={handleLogout} className="text-left text-red-500 font-bold py-2">Logout</button>
              </div>
            )}
          </div>
        </div>
        {/* Click outside to close */}
        <div onClick={() => setIsOpen(false)} className="bg-black/50 absolute inset-0 -z-10"></div>
      </div>
    </nav>
  );
}

export default Navbar;