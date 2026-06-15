"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Globe2, Zap } from "lucide-react";

/* ── Count-up with intersection observer ── */
interface CountUpProps {
  end: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function CountUp({ end, decimals = 0, duration = 2200, suffix = "", prefix = "" }: CountUpProps) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setValue(ease * end);
      if (p < 1) requestAnimationFrame(tick);
      else setValue(end);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tabular">
      {prefix}{formatted}{suffix}
    </span>
  );
}

/* ── Stat card ── */
interface StatDef {
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  color: string;
  glowRgba: string;
  value: React.ReactNode;
  trend: string;
}

const STATS: StatDef[] = [
  {
    label: "LIVES PROTECTED",
    sublabel: "Cumulative since activation",
    Icon: Shield,
    color: "#22c55e",
    glowRgba: "34,197,94",
    value: <CountUp end={7854} />,
    trend: "+284 last hour",
  },
  {
    label: "ACTIVE TEAMS",
    sublabel: "Field units deployed globally",
    Icon: Users,
    color: "#38bdf8",
    glowRgba: "56,189,248",
    value: <CountUp end={54} />,
    trend: "8 nations",
  },
  {
    label: "CRISIS ZONES",
    sublabel: "Active emergency theatres",
    Icon: Globe2,
    color: "#ff2e4c",
    glowRgba: "255,46,76",
    value: <CountUp end={8} duration={1200} />,
    trend: "2 escalating",
  },
  {
    label: "AVG RESPONSE TIME",
    sublabel: "Target: sub 5 min",
    Icon: Zap,
    color: "#f59e0b",
    glowRgba: "245,158,11",
    value: <CountUp end={4.2} decimals={1} suffix=" min" />,
    trend: "−0.8 from baseline",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function StatCounters() {
  return (
    <section
      id="stats"
      className="relative w-full py-16 z-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(56,189,248,0.02) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.3))" }} />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
            Mission Metrics
          </span>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.1), transparent)" }} />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map((stat) => {
            const Icon = stat.Icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="group relative flex flex-col rounded-xl p-5 overflow-hidden cursor-default"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s cubic-bezier(0.23,1,0.32,1)",
                }}
                onMouseMove={e => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const xc = rect.width / 2;
                  const yc = rect.height / 2;
                  const angleX = (yc - y) / 10;
                  const angleY = (x - xc) / 15;
                  
                  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px) scale(1.025)`;
                  card.style.boxShadow = `0 0 0 1px rgba(${stat.glowRgba},0.3), 0 12px 36px rgba(${stat.glowRgba},0.22)`;
                }}
                onMouseLeave={e => {
                  const card = e.currentTarget;
                  card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
                  card.style.boxShadow = "";
                }}
              >
                {/* Top glow line */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                />

                {/* Subtle corner accent */}
                <div
                  className="pointer-events-none absolute top-0 left-0"
                  style={{ width: 14, height: 14, borderTop: `1px solid ${stat.color}55`, borderLeft: `1px solid ${stat.color}55` }}
                />

                {/* Icon */}
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    background: `rgba(${stat.glowRgba},0.1)`,
                    border: `1px solid rgba(${stat.glowRgba},0.2)`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>

                {/* Big number */}
                <div
                  className="mb-1 font-mono font-black leading-none"
                  style={{
                    fontSize: "clamp(36px, 4vw, 52px)",
                    color: stat.color,
                    textShadow: `0 0 20px rgba(${stat.glowRgba},0.5)`,
                  }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <span className="mb-1 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  {stat.label}
                </span>

                {/* Sublabel */}
                <span className="font-mono text-[10px] text-white/20">
                  {stat.sublabel}
                </span>

                {/* Trend */}
                <div className="mt-3 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span
                    className="font-mono text-[10px] tracking-wide"
                    style={{ color: `rgba(${stat.glowRgba},0.7)` }}
                  >
                    ↑ {stat.trend}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
