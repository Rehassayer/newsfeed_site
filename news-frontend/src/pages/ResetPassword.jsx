import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to get the email from the previous "Forgot Password" page state
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP");

    setLoading(true);
    try {
      // ✅ Matches your new backend: { email, otp, password }
      await axios.post(`http://localhost:8003/api/auth/reset-password`, { 
        email, 
        otp, 
        password 
      });
      
      alert('Password updated successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP or session expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="bg-slate-900 p-6 text-white text-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-400 text-sm">Enter the code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">6-Digit OTP</label>
            <input 
              type="text" 
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;