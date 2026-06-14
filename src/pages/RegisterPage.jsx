import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  User,
  Mail,
  Lock,
  Briefcase,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/onerposlogo.webp";

const BUSINESS_TYPES = [
  "Retail Store",
  "Restaurant / Food Service",
  "Cafe / Coffee Shop",
  "Grocery / Supermarket",
  "Pharmacy",
  "Electronics",
  "Clothing & Apparel",
  "Hardware / Home Improvement",
  "Beauty & Personal Care",
  "Service Business",
  "Wholesale / Distribution",
  "Other",
];

const steps = [
  { id: 1, label: "Business Info" },
  { id: 2, label: "Account Setup" },
];

export function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [k]: "" }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.businessName.trim())
      errs.businessName = "Business name is required";
    if (!form.businessType) errs.businessType = "Please select a business type";
    if (!form.ownerName.trim()) errs.ownerName = "Owner's name is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const result = await register(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white/90 mb-2">
            Registration Successful!
          </h2>
          <p className="text-sm text-white/45">Redirecting you to sign in…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/6 rounded-full blur-3xl" />
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
            Create your account
          </h1>
          <p className="text-sm text-white/35 mt-1">
            Set up your business workspace in minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    step > s.id
                      ? "bg-indigo-500 text-white"
                      : step === s.id
                        ? "bg-indigo-500/20 border border-indigo-500/60 text-indigo-300"
                        : "bg-white/5 border border-white/10 text-white/25"
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    s.id
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${step === s.id ? "text-white/70" : "text-white/25"}`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-1 transition-colors ${step > s.id ? "bg-indigo-500/40" : "bg-white/8"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleNext}
                className="space-y-4"
              >
                {/* Business Name */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Business Name
                  </label>
                  <input
                    value={form.businessName}
                    onChange={set("businessName")}
                    placeholder="e.g. Rivera Enterprises"
                    className={`w-full glass rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-colors ${
                      fieldErrors.businessName
                        ? "border-rose-500/60 focus:border-rose-500/60"
                        : "focus:border-indigo-500/40"
                    }`}
                  />
                  {fieldErrors.businessName && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.businessName}
                    </p>
                  )}
                </div>

                {/* Type of Business */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" /> Type of Business
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTypeOpen((o) => !o)}
                      className={`w-full glass rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors outline-none ${
                        typeOpen ? "border-indigo-500/40" : ""
                      } ${fieldErrors.businessType ? "border-rose-500/60" : ""}`}
                    >
                      <span
                        className={
                          form.businessType ? "text-white/80" : "text-white/20"
                        }
                      >
                        {form.businessType || "Select your business type"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/30 transition-transform ${typeOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {typeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                          style={{ background: "#0f1629" }}
                        >
                          <div className="max-h-52 overflow-y-auto py-1">
                            {BUSINESS_TYPES.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setForm((f) => ({
                                    ...f,
                                    businessType: type,
                                  }));
                                  setFieldErrors((fe) => ({
                                    ...fe,
                                    businessType: "",
                                  }));
                                  setTypeOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                  form.businessType === type
                                    ? "bg-indigo-500/20 text-indigo-300"
                                    : "text-white/65 hover:bg-white/5 hover:text-white/85"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {fieldErrors.businessType && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.businessType}
                    </p>
                  )}
                </div>

                {/* Owner's Name */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Owner's Name
                  </label>
                  <input
                    value={form.ownerName}
                    onChange={set("ownerName")}
                    placeholder="Your full name"
                    className={`w-full glass rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-colors ${
                      fieldErrors.ownerName
                        ? "border-rose-500/60"
                        : "focus:border-indigo-500/40"
                    }`}
                  />
                  {fieldErrors.ownerName && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.ownerName}
                    </p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 mt-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@yourbusiness.com"
                    className={`w-full glass rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-colors ${
                      fieldErrors.email
                        ? "border-rose-500/60"
                        : "focus:border-indigo-500/40"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="Minimum 6 characters"
                      className={`w-full glass rounded-xl px-4 py-2.5 pr-10 text-sm text-white/80 placeholder:text-white/20 outline-none transition-colors ${
                        fieldErrors.password
                          ? "border-rose-500/60"
                          : "focus:border-indigo-500/40"
                      }`}
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
                  {fieldErrors.password && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={`w-full glass rounded-xl px-4 py-2.5 pr-10 text-sm text-white/80 placeholder:text-white/20 outline-none transition-colors ${
                        fieldErrors.confirmPassword
                          ? "border-rose-500/60"
                          : "focus:border-indigo-500/40"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-rose-400 mt-1">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
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

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2.5 glass rounded-xl text-sm text-white/60 hover:bg-white/8 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-white/25 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
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
