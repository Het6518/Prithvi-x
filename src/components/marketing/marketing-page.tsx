"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeIndianRupee, Check, CirclePlay, Languages, MapPinned, QrCode, Sparkles, Tractor } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LazyGlobe } from "@/components/shared/lazy-globe";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/data/mock";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const featureSections = [
  {
    title: "Farmer Registration + QR ID",
    copy: "Onboard growers in minutes with village metadata, crop cycle, preferred language, and QR-based retrieval for field teams.",
    icon: QrCode,
    mockup: ["Smart onboarding form", "QR identity card", "Village-first search"]
  },
  {
    title: "Field Visits + AI Recommendations",
    copy: "Capture visit notes, disease indicators, and agronomy next-steps with multilingual AI support that feels grounded in real field work.",
    icon: Tractor,
    mockup: ["Visit timeline", "Stress alerts", "Suggested treatment"]
  },
  {
    title: "Udhaar / Credit Ledger",
    copy: "Track dues, collections, payment modes, and follow-up discipline without spreadsheet drift.",
    icon: BadgeIndianRupee,
    mockup: ["Highest dues list", "UPI + cash entries", "Recovery reminders"]
  },
  {
    title: "Inventory + Stock Alerts",
    copy: "Stay ahead of stock-outs with product health signals, threshold warnings, and warehouse-ready inventory visibility.",
    icon: Sparkles,
    mockup: ["Stock health bars", "Reorder warnings", "SKU visibility"]
  },
  {
    title: "Analytics + Map",
    copy: "Visualize revenue, farmer growth, collection rate, and regional intensity through chart-rich operational intelligence.",
    icon: MapPinned,
    mockup: ["Revenue charts", "Village clusters", "Heatmap focus"]
  },
  {
    title: "AI Agronomist Chat",
    copy: "Support your teams in English, Hindi, Gujarati, Marathi, and Rajasthani with a guided agronomy assistant that stores context.",
    icon: Languages,
    mockup: ["Language switcher", "Typing indicator", "Session history"]
  }
];

const pricing = [
  {
    name: "Basic",
    price: "Rs 4,999",
    period: "/month",
    features: ["Farmer management", "Inventory & credit tracking", "Field visit logging", "Email support"]
  },
  {
    name: "Premium",
    price: "Rs 12,999",
    period: "/month",
    featured: true,
    features: ["Everything in Basic", "AI Agronomist chat", "Advanced analytics & map", "Priority onboarding"]
  }
];

/* ============================================================
   PART 1 — CINEMATIC SPLASH SCREEN (4-5s, Earth animation)
   ============================================================ */
function SplashScreen() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Starry background layers (dark sky) */}
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        backgroundPosition: "0 0"
      }} />
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1.5px, transparent 1.5px)",
        backgroundSize: "100px 100px",
        backgroundPosition: "30px 40px"
      }} />

      {/* Full screen Earth Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        <motion.img
          src="/earth.png"
          alt="Planet Earth from space"
          className="h-full w-full object-cover opacity-60"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Atmospheric gradients to ensure text visibility and deep contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent" />
        {/* Subtle radial shadow to frame the center */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.7) 100%)"
        }} />
      </motion.div>

      {/* Overlay Text & Button */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.8em] drop-shadow-md" style={{ color: "#D4A853" }}>
            Prithvix
          </p>
          <h1 className="mt-6 font-heading text-5xl sm:text-7xl lg:text-8xl drop-shadow-2xl" style={{ color: "#F5F0E8" }}>
            Rooted In Growth
          </h1>
          <p className="mt-6 font-medium text-white/70 max-w-2xl text-base sm:text-lg drop-shadow-lg leading-relaxed">
            Leading the future of agrarian networks. Step into a world where premium tools meet foundational growth.
          </p>
          
          <button
            onClick={() => setVisible(false)}
            className="mt-12 group relative inline-flex items-center justify-center border-2 border-white/20 bg-black/40 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/60 hover:scale-105"
            style={{ borderRadius: "4px" }}
          >
            Enter Experience
            <div className="absolute inset-0 -z-10 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{
              boxShadow: "0 0 20px rgba(255,255,255,0.15)"
            }} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURE BLOCK — neobrutalist
   ============================================================ */
function FeatureBlock({
  feature,
  reverse = false
}: {
  feature: (typeof featureSections)[number];
  reverse?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useGsapReveal(ref);
  const Icon = feature.icon;

  return (
    <section ref={ref} className="section-shell py-12 sm:py-20">
      <div className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="space-y-5">
          <div className="inline-flex border-3 border-black bg-gold/20 p-3 text-gold shadow-neo-sm" style={{ borderRadius: "6px" }}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-3xl text-forest sm:text-4xl">{feature.title}</h3>
          <p className="text-lg font-medium leading-8 text-forest/75">{feature.copy}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {feature.mockup.map((item) => (
              <div key={item} className="border-3 border-black bg-white p-4 text-sm font-bold text-forest shadow-neo-sm" style={{ borderRadius: "6px" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <motion.div
          whileHover={{ y: -4, x: -2 }}
          className="neo-card relative overflow-hidden p-5"
        >
          <div className="absolute inset-0" style={{
            background: "linear-gradient(160deg, rgba(212,168,83,0.08), transparent 40%)"
          }} />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-forest/50 uppercase tracking-wider">Live module preview</p>
                <p className="text-lg font-bold text-forest">{feature.title}</p>
              </div>
              <div className="neo-pill bg-forest text-background">Active</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="neo-card-dark p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Signal</p>
                <p className="mt-3 text-3xl font-bold">92%</p>
                <p className="mt-2 text-sm text-background/70">Operational confidence in current cycle</p>
              </div>
              <div className="space-y-3 border-3 border-black bg-white p-5" style={{ borderRadius: "8px" }}>
                {[72, 44, 88].map((value) => (
                  <div key={value}>
                    <div className="mb-2 flex justify-between text-xs font-bold text-forest/60">
                      <span>Workflow completeness</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-white" style={{ borderRadius: "2px" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1 }}
                        className="h-full bg-forest"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-3 border-black bg-white p-5" style={{ borderRadius: "8px" }}>
              <div className="flex items-center justify-between text-xs font-bold text-forest/60 uppercase tracking-wider">
                <span>Animated UI panel</span>
                <span>Realtime status</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.5, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: step * 0.1 }}
                    className="border-2 border-black bg-background p-4" style={{ borderRadius: "6px" }}
                  >
                    <div className="mb-3 h-3 border border-black bg-white" style={{ borderRadius: "2px" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${step * 28}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full bg-forest"
                      />
                    </div>
                    <p className="text-sm font-bold text-forest">Flow {step}</p>
                    <p className="mt-2 text-xs leading-5 text-forest/60">Dealer operations, mapped and paced with the season.</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   MAIN MARKETING PAGE
   ============================================================ */
export function MarketingPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const stats = useMemo(
    () => [
      { label: "Farmers", value: "2000+" },
      { label: "Languages", value: "5" },
      { label: "Transactions", value: formatCompact(5000000) + "+" }
    ],
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="overflow-hidden bg-background">
      <SplashScreen />

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-grain" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, rgba(26,60,43,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }} />

        <div className="section-shell relative grid min-h-screen items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="neo-eyebrow"
            >
              Premium AgriTech OS
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.9 }}
              className="mt-6 font-heading text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl"
            >
              Manage Farmers. Track Growth. Increase Yield.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.9 }}
              className="mt-6 max-w-xl text-lg font-medium leading-8 text-forest/75"
            >
              Prithvix helps agri dealers unify farmer onboarding, field intelligence, inventory, udhaar collections, and multilingual agronomy guidance in one elegant workflow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.9 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/login"
                className="neo-btn-primary inline-flex items-center justify-center gap-2"
              >
                Request Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary">
                <span className="inline-flex items-center gap-2">
                  <CirclePlay className="h-4 w-4" /> Watch How It Works
                </span>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.9 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              {["Dealer-ready ERP", "Field-first workflows", "AI agronomy guidance"].map((item) => (
                <div key={item} className="neo-pill bg-white text-forest">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 1 }}
            className="relative"
          >
            <LazyGlobe />
            <div className="neo-card absolute -bottom-6 left-5 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-forest/45">Live network</p>
              <p className="mt-2 text-xl font-bold text-forest">{formatCurrency(1835000)}</p>
              <p className="text-sm font-medium text-forest/60">Season-to-date collections monitored</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="section-shell py-8">
        <div className="grid gap-4 neo-card-dark px-6 py-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="border-3 border-white/15 bg-white/5 p-5" style={{ borderRadius: "6px" }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLATFORM HEADING */}
      <section id="platform" className="section-shell pt-20">
        <SectionHeading
          eyebrow="Platform"
          title="Every seasonal workflow, connected with intention"
          copy="Prithvix blends premium design with grounded agri operations, so every step from registration to recovery feels faster, clearer, and more trusted by the team using it."
        />
      </section>

      {/* FEATURE BLOCKS */}
      {featureSections.map((feature, index) => (
        <FeatureBlock key={feature.title} feature={feature} reverse={index % 2 === 1} />
      ))}

      {/* HOW IT WORKS */}
      <section id="pricing" className="section-shell py-20">
        <SectionHeading
          eyebrow="How It Works"
          title="A calm flow for busy dealer operations"
          copy="Built for teams moving between desk, warehouse, and farm visits without losing continuity."
          align="center"
        />
        <div className="relative mt-12 grid gap-6 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-1 bg-black lg:block" />
          {["Register Dealer", "Add Farmers", "Log Visits", "Track Everything"].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="neo-card relative p-6"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-3 border-black bg-gold text-base font-bold text-ink shadow-neo-sm" style={{ borderRadius: "4px" }}>
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-forest">{step}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-forest/65">
                Structured tools guide the team through onboarding, season records, recovery actions, and collections.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the operating rhythm that fits your dealership"
          copy="Both plans ship with the same visual polish. Premium unlocks deeper intelligence and AI-supported workflows."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`border-3 border-black p-8 ${plan.featured ? "bg-forest text-background shadow-neo-gold" : "bg-white text-forest shadow-neo"}`}
              style={{ borderRadius: "8px" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="neo-eyebrow">{plan.name}</p>
                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-5xl font-bold">{plan.price}</p>
                    <p className={plan.featured ? "text-background/60 font-medium" : "text-forest/55 font-medium"}>{plan.period}</p>
                  </div>
                </div>
                {plan.featured ? (
                  <div className="neo-pill border-gold bg-gold/20 text-gold">
                    Most Popular
                  </div>
                ) : null}
              </div>
              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className={`h-4 w-4 ${plan.featured ? "text-gold" : "text-forest"}`} />
                    <span className={`font-medium ${plan.featured ? "text-background/85" : "text-forest/75"}`}>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={plan.featured ? "secondary" : "primary"}
                className={`mt-8 w-full ${plan.featured ? "border-white/20 bg-white/10 text-background hover:bg-white/20" : ""}`}
              >
                Start With {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Trust"
          title="Used by teams close to the field"
          copy="Designed to feel premium in the office and practical in the village."
          align="center"
        />
        <div className="neo-card mt-12 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[testimonialIndex].name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
              className="text-center"
            >
              <p className="mx-auto max-w-3xl font-heading text-3xl leading-tight text-forest">
                &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
              </p>
              <p className="mt-6 text-lg font-bold text-forest">{testimonials[testimonialIndex].name}</p>
              <p className="neo-eyebrow mt-1">{testimonials[testimonialIndex].village}</p>
              <div className="mt-8 flex justify-center gap-3">
                {["Dealer Verified", "Village-first Workflow", "AI-enabled Support"].map((badge) => (
                  <span key={badge} className="neo-pill bg-forest/5 text-forest">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell pb-16 pt-8">
        <div className="neo-card-dark px-8 py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="neo-eyebrow">Ready to grow</p>
              <h2 className="mt-4 font-heading text-4xl text-background">Bring your dealer operations into one premium system.</h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="neo-btn-accent inline-flex items-center justify-center gap-2"
              >
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary" className="border-white/20 bg-white/10 text-background hover:bg-white/20">
                Book Product Walkthrough
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-3 border-black bg-white">
        <div className="section-shell flex flex-col gap-6 py-10 text-sm font-medium text-forest/65 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-bold text-forest">Prithvix</p>
            <p className="mt-1">Dealer-first AgriTech operations for registrations, inventory, credit, analytics, and AI advisory.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="font-bold transition hover:text-forest">
              Dashboard
            </Link>
            <a href="#pricing" className="font-bold transition hover:text-forest">
              Pricing
            </a>
            <a href="#platform" className="font-bold transition hover:text-forest">
              Platform
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
