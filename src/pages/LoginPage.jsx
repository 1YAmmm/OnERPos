import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Store,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/onerposlogo.webp";
const ROLES = [
  {
    id: "owner",
    label: "Business Owner",
    desc: "Full ERP & analytics access",
    icon: BarChart3,
    hint: "owner@onerpos.com",
  },
  {
    id: "cashier",
    label: "Cashier",
    desc: "POS & transactions",
    icon: Store,
    hint: "cashier@onerpos.com",
  },
  {
    id: "admin",
    label: "System Admin",
    desc: "Platform administration",
    icon: ShieldCheck,
    hint: "admin@onerpos.com",
  },
];

const REDIRECT = { owner: "/owner", cashier: "/cashier", admin: "/admin" };

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.hint);
    setPassword("demo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate(REDIRECT[result.user.role] ?? "/");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="OnERPos"
              className="h-16 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight items-start">
              <span className="text-[32px] font-extrabold text-[#ffffff] tracking-wide">
                OnERPos
              </span>
              <span className="text-[12px] gradient-text tracking-wide">
                All in one Business Management
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white/90 mt-4 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-white/35 mt-1">
            Sign in to your workspace
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 font-medium block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full glass rounded-xl px-4 py-2.5 pr-10 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2 border border-rose-500/20"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-white/40 mt-4">
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </p>
          <p className="text-center text-xs text-white/25 mt-2">
            New business?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-xs text-white/20 mt-4">
          <Link to="/" className="hover:text-white/40 transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
