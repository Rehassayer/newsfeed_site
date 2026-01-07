import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are mandatory for registration.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Security requirement: Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Verification failed: Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'System error during registration. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            The<span className="text-blue-600">Post</span>
          </Link>
          <div className="h-1 w-12 bg-slate-900 mx-auto mt-4"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-10">
          <header className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Create Reader Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Join 50,000+ daily readers today.</p>
          </header>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Jane Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="jane@example.com"
                required
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-start pt-2">
              <input 
                type="checkbox" 
                required
                className="w-4 h-4 border-slate-300 rounded-none text-slate-900 focus:ring-0 mt-1 cursor-pointer"
              />
              <label className="ml-3 text-[11px] leading-relaxed text-slate-500 font-medium">
                I accept the <Link to="/terms" className="text-slate-900 underline font-bold">Terms of Service</Link> and understand my data is handled per the <Link to="/privacy" className="text-slate-900 underline font-bold">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg shadow-slate-200 mt-4"
            >
              {loading ? 'Creating Account...' : 'Register Now'}
            </button>
          </form>

          {/* Third Party */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest text-center">Quick Social Registration</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-black uppercase text-slate-700">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-black uppercase text-slate-700">
              Facebook
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs font-bold text-slate-400 mt-8 uppercase tracking-widest">
          Already a member?{' '}
          <Link to="/login" className="text-blue-600 hover:text-slate-900 transition-colors ml-1">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;