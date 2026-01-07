import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../services/api";
import axios from "axios";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Credentials are required to proceed.");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(
        result.error || "Authentication failed. Please check your credentials."
      );
    }
    setLoading(false);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Use the authService you just imported
        // Note: No { data } destructuring here because authService returns the data directly
        const responseData = await authService.googleLogin(
          tokenResponse.access_token
        );

        if (responseData.status === "success") {
          // Update the Global Context State
          setUser(responseData.data.user);

          // Redirect Home
          navigate("/");
        }
      } catch (err) {
        console.error("Google Login Error:", err);
        setError(err.response?.data?.error || "Google Authentication failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setError("Could not connect to Google. Please try again.");
    },
  });
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Branding/Logo Area */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter text-slate-900 uppercase"
          >
            The<span className="text-blue-600">Post</span>
          </Link>
          <div className="h-1 w-12 bg-slate-900 mx-auto mt-4"></div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-none p-10">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Reader Sign In
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Access your personalized news feed.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <p className="text-xs font-bold text-red-700 uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="editor@newspaper.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-[10px] font-black uppercase text-blue-600 hover:text-slate-900"
                >
                  Reset?
                </Link>
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg shadow-slate-200"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">
                Third Party Access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleGoogleLogin()} // Trigger the Google Pop-up
              className="flex items-center justify-center gap-3 py-3 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.136 2.688-6.4 2.688-5.112 0-9.272-4.144-9.272-9.232s4.16-9.232 9.272-9.232c2.8 0 4.944 1.104 6.44 2.528l2.312-2.312C18.424 1.056 15.656 0 12.48 0 5.616 0 0 5.616 0 12.48S5.616 24.96 12.48 24.96c3.752 0 6.592-1.24 8.76-3.52 2.248-2.248 2.952-5.416 2.952-8.032 0-.784-.064-1.528-.184-2.248h-11.536z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <p className="text-center text-xs font-bold text-slate-400 mt-8 uppercase tracking-widest">
          New to the publication?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-slate-900 transition-colors ml-1"
          >
            Create an Account
          </Link>
        </p>

        {/* Demo Credentials - Simplified */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              System Preview
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            DEMO_USER: demo@example.com / demo123
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
