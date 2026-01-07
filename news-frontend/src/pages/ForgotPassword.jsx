import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Hits your backend OTP generator
      await api.post("/api/auth/forgot-password", { email });

      // Redirect to Reset Password page and pass the email in 'state'
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Account synchronization failed. Please verify your email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter text-slate-900 uppercase"
          >
            The<span className="text-blue-600">Post</span>
          </Link>
          <div className="h-1 w-12 bg-slate-900 mx-auto mt-4"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-10">
          <header className="mb-8 text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Account Recovery
            </h2>
            <p className="text-slate-500 text-sm mt-2 italic">
              "Enter your registered email to receive a secure access
              credential."
            </p>
          </header>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Subscriber Email
              </label>
              <input
                type="email"
                placeholder="editor@newspaper.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg shadow-slate-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-3 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  ></svg>
                  Processing...
                </span>
              ) : (
                "Request Access Code"
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 text-center">
          <Link
            to="/login"
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>

        {/* Support Note */}
        <p className="mt-12 text-center text-[10px] text-slate-400 font-medium leading-loose max-w-xs mx-auto">
          For further assistance with account recovery, please contact our
          <span className="text-slate-900 font-bold underline cursor-pointer ml-1">
            Editorial Support Desk
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
