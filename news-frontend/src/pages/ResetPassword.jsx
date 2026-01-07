import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Verification failed: Passwords do not match");
    if (otp.length !== 6) return setError("Invalid Input: OTP must be 6 digits");

    setLoading(true);
    try {
      await api.post(`/api/auth/reset-password`, { 
        email, 
        otp, 
        password 
      });
      
      // Using a custom alert style logic or simple redirect
      navigate('/login', { state: { message: 'Password updated successfully.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed: Invalid OTP or session expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            The<span className="text-blue-600">Post</span>
          </Link>
          <div className="h-1 w-12 bg-slate-900 mx-auto mt-4"></div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-10">
          <header className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Security Verification</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter the 6-digit credential sent to your inbox.</p>
          </header>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Account Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@newspaper.com"
                required
              />
            </div>

            {/* OTP Field */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Security Code (OTP)</label>
              <input 
                type="text" 
                maxLength="6"
                className="w-full px-4 py-4 border-2 border-slate-100 bg-white text-center text-3xl font-black tracking-[0.5em] focus:border-blue-600 outline-none transition-all text-slate-900"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg shadow-slate-200"
            >
              {loading ? 'Verifying...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <p className="text-center text-xs font-bold text-slate-400 mt-8 uppercase tracking-widest">
          Remembered your access?{' '}
          <Link to="/login" className="text-blue-600 hover:text-slate-900 transition-colors ml-1">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;