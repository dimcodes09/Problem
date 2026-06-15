"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, HeartHandshake, Navigation2, AlertTriangle, Activity } from "lucide-react";
import { INCIDENTS } from "../lib/mockData";

/* ── Severity config ── */
const SEV = {
  CRITICAL: {
    label: "CRITICAL",
    color: "#ff2e4c",
    rgb: "255,46,76",
    bg: "rgba(255,46,76,0.08)",
    border: "rgba(255,46,76,0.25)",
    glow: "rgba(255,46,76,0.18)",
    pulse: true,
  },
  HIGH: {
    label: "HIGH",
    color: "#f59e0b",
    rgb: "245,158,11",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    glow: "rgba(245,158,11,0.15)",
    pulse: false,
  },
  MEDIUM: {
    label: "MEDIUM",
    color: "#38bdf8",
    rgb: "56,189,248",
    bg: "rgba(56,189,248,0.06)",
    border: "rgba(56,189,248,0.2)",
    glow: "rgba(56,189,248,0.12)",
    pulse: false,
  },
} as const;

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE:     { color: "#ff2e4c", bg: "rgba(255,46,76,0.08)",    border: "rgba(255,46,76,0.3)"    },
  MONITORING: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.3)"   },
  CONTAINED:  { color: "#22c55e", bg: "rgba(34,197,94,0.08)",    border: "rgba(34,197,94,0.3)"    },
};

const TARGET_RESCUED: Record<string, number> = {
  "INC-2847": 1000,
  "INC-2846":  500,
  "INC-2845":  200,
  "INC-2844": 2500,
  "INC-2843":  600,
  "INC-2842": 4000,
  "INC-2841":  100,
  "INC-2840":  800,
};

/* ── Animated scroll-fill progress bar ── */
function ProgressBar({ percent, color, rgb }: { percent: number; color: string; rgb: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.width = `${percent}%`;
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [percent]);

  return (
    <div
      className="relative h-[3px] w-full overflow-hidden rounded-full"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div
        ref={barRef}
        className="progress-fill absolute left-0 top-0 h-full rounded-full"
        style={{
          width: 0,
          backgroundColor: color,
          boxShadow: `0 0 8px rgba(${rgb},0.8)`,
          transition: "width 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
    </div>
  );
}

/* ── Severity badge ── */
function SevBadge({ severity }: { severity: keyof typeof SEV }) {
  const s = SEV[severity];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {s.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: s.color }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
        </span>
      )}
      {!s.pulse && <AlertTriangle className="h-2.5 w-2.5" />}
      {s.label}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function IncidentGrid() {
  return (
    <section id="incidents" className="relative mx-auto max-w-[1400px] px-6 py-20 z-20">

      {/* Background bloom */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(255,46,76,0.04) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* ── Header ── */}
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {/* Section eyebrow */}
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#ff2e4c] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff2e4c]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#ff2e4c]">
              ACTIVE INCIDENTS
            </span>
          </div>

          {/* Big heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-black leading-none tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(28px, 4.5vw, 60px)" }}
          >
            8 Crises{" "}
            <span
              className="font-mono"
              style={{
                color: "#ff2e4c",
                textShadow: "0 0 24px rgba(255,46,76,0.4)",
              }}
            >
              Requiring
            </span>
            <br />
            Immediate Coordination
          </motion.h2>
        </div>

        {/* Ops tag */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-xs"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <Navigation2 className="h-3.5 w-3.5" style={{ color: "#38bdf8" }} />
          OPS FREQ: G SECTOR — PRIORITY ALPHA
          <Activity className="h-3.5 w-3.5 text-[#22c55e] animate-pulse" />
        </motion.div>
      </div>

      {/* ── Divider ── */}
      <div className="mb-10 h-px" style={{ background: "linear-gradient(90deg, rgba(255,46,76,0.3), rgba(56,189,248,0.15), transparent)" }} />

      {/* ── Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2"
      >
        {INCIDENTS.map((inc) => {
          const target = TARGET_RESCUED[inc.id] ?? 1000;
          const percent = Math.min((inc.rescued / target) * 100, 100);
          const sev = SEV[inc.severity as keyof typeof SEV] ?? SEV.MEDIUM;
          const status = STATUS_COLORS[inc.status.toUpperCase()] ?? STATUS_COLORS.ACTIVE;

          return (
            <motion.div
              key={inc.id}
              variants={cardVariants}
              className="incident-card group relative overflow-hidden rounded-xl"
              style={{
                background: "rgba(12,12,20,0.8)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${sev.border}`,
              }}
              onMouseMove={e => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const angleX = (yc - y) / 16;
                const angleY = (x - xc) / 24;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px) scale(1.012)`;
                card.style.boxShadow = `0 12px 48px ${sev.glow}, 0 0 0 1px ${sev.color}44, 0 0 80px rgba(0,0,0,0.35)`;
                card.style.borderColor = sev.color + "77";
              }}
              onMouseLeave={e => {
                const card = e.currentTarget;
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
                card.style.boxShadow = "";
                card.style.borderColor = sev.border;
              }}
            >
              {/* Top severity stripe */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${sev.color}90, ${sev.color}20, transparent)` }}
              />

              {/* Corner accent */}
              <div
                className="pointer-events-none absolute top-0 right-0"
                style={{ width: 28, height: 28, borderTop: `1px solid ${sev.color}40`, borderRight: `1px solid ${sev.color}40` }}
              />

              {/* Scanline overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
                  opacity: 0.4,
                }}
              />

              {/* Card content */}
              <div className="relative z-10 p-5">
                {/* Top row: severity + timestamp */}
                <div className="mb-4 flex items-center justify-between">
                  <SevBadge severity={inc.severity as keyof typeof SEV} />
                  <span className="font-mono text-[11px] tracking-wider text-white/30">{inc.timestamp}</span>
                </div>

                {/* Incident ID + Title */}
                <div className="mb-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-white/25">
                    {inc.id}
                  </span>
                  <h3
                    className="mt-1 font-mono font-bold leading-snug text-white transition-colors duration-200 group-hover:text-white"
                    style={{ fontSize: "clamp(15px, 1.8vw, 18px)" }}
                  >
                    {inc.title}
                  </h3>
                </div>

                {/* Location */}
                <div className="mb-5 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#38bdf8" }} />
                    <span className="font-mono text-[13px] text-white/70">{inc.location}</span>
                  </div>
                  <div className="pl-5">
                    <span className="font-mono text-[10px] text-white/25">GPS: {inc.coords}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div
                  className="mb-4 flex flex-wrap items-center justify-between border-t pt-4 gap-2"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-white/30" />
                      <span className="font-mono text-[12px] text-white/50">
                        Teams: <span className="text-white font-medium">{inc.teams}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HeartHandshake className="h-3.5 w-3.5 text-white/30" />
                      <span className="font-mono text-[12px] text-white/50">
                        Rescued: <span className="text-white font-medium">{inc.rescued.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status chip */}
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.15em] uppercase"
                    style={{ color: status.color, background: status.bg, borderColor: status.border }}
                  >
                    {inc.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] text-white/25">
                    <span>RES PROTOCOL ACTIVE</span>
                    <span>{percent.toFixed(0)}% REACHED</span>
                  </div>
                  <ProgressBar percent={percent} color={sev.color} rgb={sev.rgb} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
