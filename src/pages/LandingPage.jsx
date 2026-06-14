import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  BarChart3,
  Package,
  BookOpen,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Shield,
  Globe,
  TrendingUp,
  ShoppingCart,
  Truck,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { PLANS, TESTIMONIALS, FAQS } from "../data/mockData";
import { ContainerScroll } from "../components/common/ContainerScroll";
import { UIOwnerDashboard } from "../components/ui/UIOwnerDashboard";
import { UiPOSPage } from "../components/ui/UIPOSPage";
import UIInventoryPage from "../components/ui/UIInventoryPage";
import logo from "../assets/onerposlogo.webp";
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useRef(() => {
    if (inView) {
      let start = 0;
      const step = Math.ceil(target / 60);
      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else setCount(start);
      }, 16);
      return () => clearInterval(interval);
    }
  });

  // Simple static display for SSR-safe rendering
  return (
    <span ref={ref}>
      {inView ? target : 0}
      {suffix}
    </span>
  );
}

const features = [
  {
    icon: ShoppingCart,
    title: "Sales & POS",
    desc: "Lightning-fast point-of-sale with offline support, multi-payment types, and instant receipt generation.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    desc: "Real-time stock tracking, automated reorder alerts, and multi-warehouse management in one view.",
  },
  {
    icon: BookOpen,
    title: "Accounting Suite",
    desc: "Automated bookkeeping, P&L statements, tax-ready reports, and cash-flow forecasting.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Drill-down dashboards, custom KPIs, and AI-powered sales trend predictions.",
  },
  {
    icon: Users,
    title: "Team Management",
    desc: "Role-based access, shift scheduling, performance tracking, and payroll exports.",
  },
  {
    icon: Building2,
    title: "Multi-Branch",
    desc: "Centralize operations across unlimited locations with consolidated reporting.",
  },
  {
    icon: Truck,
    title: "Purchase Orders",
    desc: "Streamline procurement with supplier management, PO approval flows, and delivery tracking.",
  },
  {
    icon: Activity,
    title: "System Health",
    desc: "Live infrastructure monitoring, uptime SLAs, and automated incident alerts.",
  },
];

const solutions = [
  {
    title: "Retail Stores",
    desc: "Omnichannel inventory sync, loyalty programs, and fast checkout for high-volume retail.",
  },
  {
    title: "Restaurants",
    desc: "Table management, kitchen display systems, and menu engineering analytics.",
  },
  {
    title: "Distribution",
    desc: "Route planning, bulk order processing, and supplier invoice reconciliation.",
  },
  {
    title: "Service Businesses",
    desc: "Appointment scheduling, service contracts, and recurring billing automation.",
  },
];

const stats = [
  { value: "12,000", label: "Businesses powered", suffix: "+" },
  { value: "99.9", label: "Uptime SLA", suffix: "%" },
  { value: "4.8", label: "Average rating", suffix: "/5" },
  { value: "180", label: "Countries supported", suffix: "+" },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06080f] via-[#0f1729] to-[#1a0a2e] text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-[#080c14]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="OnERPos"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-[#f5f5f5] tracking-tight">
                OnERPos
              </span>
              <span className="text-[11px] gradient-text font-medium">
                All in one Business Management
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            {["Features", "Solutions", "Pricing", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-white/80 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-white/55 hover:text-white/80 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
            >
              Start for free
            </Link>
          </div>
          <button
            className="md:hidden p-1.5 text-white/50"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/6 bg-[#080c14] px-4 py-4 flex flex-col gap-3"
            >
              {["Features", "Solutions", "Pricing", "FAQ"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-white/55 hover:text-white/80 py-1.5"
                >
                  {l}
                </a>
              ))}
              <Link
                to="/login"
                className="mt-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg text-center font-medium"
              >
                Start for free
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Landing page front ui */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            {/* MOBILE — logo on top, centered */}
            <div className="flex lg:hidden items-center justify-center w-full">
              <div className="relative flex items-center justify-center">
                {/* Rotating ring */}
                <div className="absolute w-56 h-56 rounded-full border border-indigo-500/10 animate-spin-slow" />

                {/* Pulsing glow */}
                <div className="absolute w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl animate-pulse pointer-events-none" />

                {/* Floating logo */}
                <div
                  className="relative w-44 h-44 rounded-[28px] overflow-hidden flex items-center justify-center"
                  style={{ animation: "float 4s ease-in-out infinite" }}
                >
                  <img
                    src={logo}
                    alt="OnERPos"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* LEFT — text content */}
            <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-indigo-300 border border-indigo-500/20 mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                Version 1.0
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white/95 leading-[1.1] ">
                OnERPos
              </h1>
              <span className="gradient-text text-2xl font-semibold mb-3">
                All in one Business Management
              </span>

              <p className="text-base lg:text-lg text-white/45 max-w-xl mb-8 leading-relaxed">
                One platform for sales, inventory, purchasing, accounting, and
                team management. Purpose-built for businesses that move fast and
                demand precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20"
                >
                  Start for free
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("demo-preview")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 glass hover:bg-white/8 text-white/70 px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/8"
                >
                  See how it works
                </button>
              </div>
            </div>

            {/* RIGHT — big logo, desktop only */}

            <div className="hidden lg:flex flex-shrink-0 items-center justify-center relative">
              {/* Rotating ring */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-indigo-500/10 animate-spin-slow" />

              {/* Pulsing glow */}
              <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse pointer-events-none" />

              {/* Floating logo */}
              <div
                className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-[36px] overflow-hidden flex items-center justify-center"
                style={{ animation: "float 4s ease-in-out infinite" }}
              >
                <img
                  src={logo}
                  alt="OnERPos"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </FadeIn>
        <div id="demo-preview">
          {/* Dashboard preview */}
          <FadeIn delay={0.2} className="mt-6 relative">
            <ContainerScroll>
              <UIOwnerDashboard />
            </ContainerScroll>
          </FadeIn>
        </div>
        {/* POS preview */}
        <FadeIn delay={0.2} className="mt-6 relative">
          <ContainerScroll>
            <UiPOSPage />
          </ContainerScroll>
        </FadeIn>
        <FadeIn delay={0.2} className="mt-6 relative">
          <ContainerScroll>
            <UIInventoryPage />
          </ContainerScroll>
        </FadeIn>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08} className="text-center">
              <p className="text-3xl font-bold gradient-text">
                {s.value}
                {s.suffix}
              </p>
              <p className="text-sm text-white/35 mt-1">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
            Platform capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
            Everything in one place
          </h2>
          <p className="text-white/40 mt-3 max-w-lg mx-auto">
            No integrations needed. No data silos. Every module speaks the same
            language.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.06}>
              <div className="glass rounded-2xl p-5 h-full hover:bg-white/6 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-colors">
                  <f.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-white/85 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="py-24 px-4 sm:px-6 bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
              Built for your industry
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
              One platform, every vertical
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutions.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full hover:bg-white/5 transition-colors border border-white/6 hover:border-indigo-500/20">
                  <h3 className="text-sm font-semibold text-white/85 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-4 text-xs text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
            What our customers say
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
            Trusted by operators who demand excellence
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 h-full flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300 border border-indigo-500/20">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/80">
                      {t.name}
                    </p>
                    <p className="text-xs text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-[#0a0f1a]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
              Transparent pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
              Scale without surprises
            </h2>
            <p className="text-white/40 mt-3">
              Annual billing saves 20% on all plans.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.id} delay={i * 0.1}>
                <div
                  className={`rounded-2xl p-6 h-full flex flex-col gap-5 relative overflow-hidden
                  ${
                    plan.highlighted
                      ? "bg-indigo-600/10 border border-indigo-500/30"
                      : "glass border border-white/6"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-4 right-4 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Most popular
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white/80">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/35 mt-1">
                      {plan.description}
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white/90">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-white/35">
                        /{plan.period}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-xs text-white/55"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${plan.highlighted ? "text-indigo-400" : "text-emerald-400"}`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/login"
                    className={`text-center text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200
                      ${
                        plan.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                          : "glass hover:bg-white/8 text-white/70"
                      }`}
                  >
                    Get started
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 max-w-3xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
            Common questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
            Everything you need to know
          </h2>
        </FadeIn>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white/80">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-white/35 shrink-0 ml-4" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-white/45 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <FadeIn>
          <div className="glass-strong rounded-3xl p-12 border border-indigo-500/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-violet-500/8 pointer-events-none" />

            <img
              src={logo}
              alt="OnERPos"
              className="h-16 w-auto object-contain mx-auto mb-5"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4 tracking-tight">
              Ready to run your business better?
            </h2>
            <p className="text-white/40 max-w-xl mx-auto mb-8">
              Join thousands of businesses that use OnERPos to close their books
              faster, stock smarter, and serve customers better.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              Get Started Free
            </Link>
            <p className="text-xs text-white/25 mt-4">
              No credit card required · Free to get started · Cancel anytime
            </p>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/6 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={logo}
                  alt="OnERPos"
                  className="h-16 w-auto object-contain"
                />
                <div className="flex flex-col leading-tight items-start">
                  <span className="text-[24px] font-extrabold text-[#ffffff] tracking-wide">
                    OnERPos
                  </span>
                  <span className="text-[12px] gradient-text tracking-wide">
                    All in one Business Management
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                The complete business management platform for modern operators.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Roadmap"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-xs text-white/30 hover:text-white/60 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25">
              © 2025 OnERPos. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-3.5 h-3.5 text-white/25" />
              <span className="text-xs text-white/25">English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
