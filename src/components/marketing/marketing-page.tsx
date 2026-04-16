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

function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("prithvix-splash");
    if (seen) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("prithvix-splash", "1");
      setVisible(false);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,83,0.16),transparent_16%),radial-gradient(circle_at_80%_10%,rgba(38,97,71,0.38),transparent_22%),linear-gradient(180deg,rgba(14,26,20,1),rgba(17,37,28,1))]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 w-full max-w-xl px-6">
            <LazyGlobe />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="mt-10 text-center"
            >
              <p className="text-sm uppercase tracking-[0.55em] text-gold">Prithvix</p>
              <h1 className="mt-4 font-heading text-5xl text-background sm:text-6xl">Rooted In Growth</h1>
              <button
                onClick={() => {
                  window.sessionStorage.setItem("prithvix-splash", "1");
                  setVisible(false);
                }}
                className="mt-6 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Enter Experience
              </button>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

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
          <div className="inline-flex rounded-full bg-gold/12 p-3 text-gold">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-3xl text-forest sm:text-4xl">{feature.title}</h3>
          <p className="text-lg leading-8 text-forest/75">{feature.copy}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {feature.mockup.map((item) => (
              <div key={item} className="rounded-3xl border border-forest/10 bg-white/70 p-4 text-sm font-medium text-forest shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <motion.div
          whileHover={{ y: -6 }}
          className="glass-panel relative overflow-hidden rounded-[2rem] p-5 shadow-ambient"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,168,83,0.22),transparent_28%),linear-gradient(160deg,rgba(255,255,255,0.75),rgba(255,255,255,0.42))]" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-forest/50">Live module preview</p>
                <p className="text-lg font-semibold text-forest">{feature.title}</p>
              </div>
              <div className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-background">Active</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-forest p-5 text-background">
                <p className="text-xs uppercase tracking-[0.24em] text-background/60">Signal</p>
                <p className="mt-3 text-3xl font-semibold">92%</p>
                <p className="mt-2 text-sm text-background/70">Operational confidence in current cycle</p>
              </div>
              <div className="space-y-3 rounded-[1.5rem] bg-background/75 p-5">
                {[72, 44, 88].map((value) => (
                  <div key={value}>
                    <div className="mb-2 flex justify-between text-xs text-forest/60">
                      <span>Workflow completeness</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-forest/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-gold to-forest"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-forest/10 bg-white/70 p-5">
              <div className="flex items-center justify-between text-sm text-forest/60">
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
                    className="rounded-2xl bg-background p-4"
                  >
                    <div className="mb-3 h-2 rounded-full bg-forest/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${step * 28}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-forest"
                      />
                    </div>
                    <p className="text-sm font-semibold text-forest">Flow {step}</p>
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
    <main className="overflow-hidden">
      <SplashScreen />

      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-grain" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(26,60,43,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="section-shell relative grid min-h-screen items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-sm font-semibold uppercase tracking-[0.36em] text-gold"
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
              className="mt-6 max-w-xl text-lg leading-8 text-forest/75"
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-background shadow-ambient transition hover:bg-moss"
              >
                Request Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary">
                <span className="inline-flex items-center gap-2">
                  <CirclePlay className="h-4 w-4" /> Watch How It Works
                </span>
              </Button>
            </motion.div>
            <div className="mt-12 flex flex-wrap gap-3">
              {["Dealer-ready ERP", "Field-first workflows", "AI agronomy guidance"].map((item) => (
                <div key={item} className="rounded-full border border-forest/10 bg-white/70 px-4 py-2 text-sm font-medium text-forest shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 1 }}
            className="relative"
          >
            <LazyGlobe />
            <div className="glass-panel absolute -bottom-6 left-5 rounded-[1.6rem] px-5 py-4 shadow-ambient">
              <p className="text-xs uppercase tracking-[0.24em] text-forest/45">Live network</p>
              <p className="mt-2 text-xl font-semibold text-forest">{formatCurrency(1835000)}</p>
              <p className="text-sm text-forest/60">Season-to-date collections monitored</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="grid gap-4 rounded-[2rem] border border-forest/10 bg-forest px-6 py-8 text-background shadow-ambient sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm uppercase tracking-[0.26em] text-background/60">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="platform" className="section-shell pt-20">
        <SectionHeading
          eyebrow="Platform"
          title="Every seasonal workflow, connected with intention"
          copy="Prithvix blends premium design with grounded agri operations, so every step from registration to recovery feels faster, clearer, and more trusted by the team using it."
        />
      </section>

      {featureSections.map((feature, index) => (
        <FeatureBlock key={feature.title} feature={feature} reverse={index % 2 === 1} />
      ))}

      <section id="pricing" className="section-shell py-20">
        <SectionHeading
          eyebrow="How It Works"
          title="A calm flow for busy dealer operations"
          copy="Built for teams moving between desk, warehouse, and farm visits without losing continuity."
          align="center"
        />
        <div className="relative mt-12 grid gap-6 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent lg:block" />
          {["Register Dealer", "Add Farmers", "Log Visits", "Track Everything"].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-[1.8rem] border border-forest/10 bg-white/75 p-6 shadow-sm"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-base font-semibold text-ink">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-forest">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-forest/65">
                Structured tools guide the team through onboarding, season records, recovery actions, and collections.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

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
              className={`rounded-[2rem] border p-8 shadow-ambient ${plan.featured ? "border-gold/60 bg-forest text-background shadow-glow" : "border-forest/10 bg-white/80 text-forest"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-gold">{plan.name}</p>
                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-5xl font-semibold">{plan.price}</p>
                    <p className={plan.featured ? "text-background/60" : "text-forest/55"}>{plan.period}</p>
                  </div>
                </div>
                {plan.featured ? (
                  <div className="rounded-full border border-gold/30 bg-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                    Most Popular
                  </div>
                ) : null}
              </div>
              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className={`h-4 w-4 ${plan.featured ? "text-gold" : "text-forest"}`} />
                    <span className={plan.featured ? "text-background/85" : "text-forest/75"}>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={plan.featured ? "secondary" : "primary"}
                className={`mt-8 w-full ${plan.featured ? "border-white/15 bg-white/10 text-background hover:bg-white/15" : ""}`}
              >
                Start With {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Trust"
          title="Used by teams close to the field"
          copy="Designed to feel premium in the office and practical in the village."
          align="center"
        />
        <div className="mt-12 rounded-[2rem] border border-forest/10 bg-white/80 p-8 shadow-ambient">
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
                "{testimonials[testimonialIndex].quote}"
              </p>
              <p className="mt-6 text-lg font-semibold text-forest">{testimonials[testimonialIndex].name}</p>
              <p className="text-sm uppercase tracking-[0.24em] text-gold">{testimonials[testimonialIndex].village}</p>
              <div className="mt-8 flex justify-center gap-3">
                {["Dealer Verified", "Village-first Workflow", "AI-enabled Support"].map((badge) => (
                  <span key={badge} className="rounded-full bg-forest/5 px-4 py-2 text-sm font-medium text-forest/70">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="section-shell pb-16 pt-8">
        <div className="rounded-[2.2rem] bg-ink px-8 py-12 text-background shadow-ambient">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Ready to grow</p>
              <h2 className="mt-4 font-heading text-4xl">Bring your dealer operations into one premium system.</h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-background shadow-ambient transition hover:bg-moss"
              >
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary" className="border-white/15 bg-white/10 text-background hover:bg-white/15">
                Book Product Walkthrough
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-forest/10 bg-white/70">
        <div className="section-shell flex flex-col gap-6 py-10 text-sm text-forest/65 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-forest">Prithvix</p>
            <p className="mt-1">Dealer-first AgriTech operations for registrations, inventory, credit, analytics, and AI advisory.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="transition hover:text-forest">
              Dashboard
            </Link>
            <a href="#pricing" className="transition hover:text-forest">
              Pricing
            </a>
            <a href="#platform" className="transition hover:text-forest">
              Platform
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
