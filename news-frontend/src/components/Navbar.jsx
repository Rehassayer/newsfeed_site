import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { categoryService } from "../services/api";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data?.categories || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <nav className="fixed w-full top-0 z-[100] bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter uppercase"
          >
            The<span className="text-blue-600">Post</span>
          </Link>
          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-6 border-l pl-8 border-slate-100">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/create-article"
                className="hidden sm:block bg-slate-900 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-full hover:bg-blue-600 transition-colors"
              >
                Write Story
              </Link>
              <Link
                to="/profile"
                className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-600 hover:bg-blue-50"
              >
                {user?.name?.charAt(0)}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-[10px] font-black text-red-400 uppercase"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white text-[10px] font-black uppercase px-6 py-2.5 rounded-full"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-50 p-6 absolute w-full shadow-xl">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="font-black text-sm uppercase text-slate-600"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
