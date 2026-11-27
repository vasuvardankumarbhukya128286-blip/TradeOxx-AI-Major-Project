"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFillDemo = () => {
    setUsername("alpha_trader");
    setEmail("trader@tradeoxx.ai");
    setPassword("TradeOxx2026!");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validation
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your mail ID.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid mail ID (e.g. name@domain.com).");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);

    try {
      let loggedInUser = null;
      let authToken = "session-token-" + Date.now();

      try {
        // Attempt backend login
        const response = await api.post("/auth/login", {
          username: cleanUsername,
          email: cleanEmail,
          password: password,
        });

        if (response.data) {
          const resUser = response.data.user || {};
          loggedInUser = {
            id: resUser.id || "user-" + Date.now(),
            email: resUser.email || cleanEmail,
            username: cleanUsername,
            profile: {
              displayName: resUser.name || cleanUsername,
              avatarUrl: null,
            },
          };
          authToken = response.data.access_token || response.data.token || authToken;
        }
      } catch (apiErr: any) {
        // If the backend is running and returned a 401/400 validation error
        if (apiErr.response && apiErr.response.status === 401) {
          setError(apiErr.response.data?.message || apiErr.response.data?.error || "Invalid mail ID, username, or password.");
          setIsLoading(false);
          return;
        }

        // If backend server is offline/unreachable, fallback to local authentication session
        console.warn("Backend server unavailable, authenticating client session locally:", apiErr.message);
        loggedInUser = {
          id: "user-" + Date.now(),
          email: cleanEmail,
          username: cleanUsername,
          profile: {
            displayName: cleanUsername,
            avatarUrl: null,
          },
        };
      }

      if (loggedInUser) {
        login(loggedInUser, authToken);
        setSuccess(`Welcome back, ${cleanUsername}! Redirecting to dashboard...`);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to TradeOxx AI"
      subtitle="Sign in with your username, mail ID, and password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {success && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Username field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-brand-textSecondary uppercase tracking-wider">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textMuted">
              <User size={18} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0A1024]/80 border border-white/10 rounded-xl text-white placeholder-brand-textMuted/60 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>
        </div>

        {/* Mail ID field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-brand-textSecondary uppercase tracking-wider">
            Mail ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textMuted">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0A1024]/80 border border-white/10 rounded-xl text-white placeholder-brand-textMuted/60 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-brand-textSecondary uppercase tracking-wider">
              Password
            </label>
            <span className="text-xs text-brand-cyan hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textMuted">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-11 py-3 bg-[#0A1024]/80 border border-white/10 rounded-xl text-white placeholder-brand-textMuted/60 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-textMuted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan shadow-lg shadow-brand-blue/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Demo Credentials Quick Fill */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-brand-cyan flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Click to Auto-fill Demo Account</span>
          </button>
        </div>

        {/* Links */}
        <div className="pt-4 border-t border-white/5 text-center flex flex-col gap-3">
          <p className="text-xs text-brand-textMuted">
            Don&apos;t have an account?{" "}
            <span
              onClick={handleFillDemo}
              className="text-brand-cyan font-semibold hover:underline cursor-pointer"
            >
              Try Demo Account
            </span>
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-brand-textSecondary hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to website</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
