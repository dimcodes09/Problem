"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Activity, Radio, Shield } from "lucide-react";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border border-t-transparent animate-spin"
          style={{ borderColor: "rgba(56,189,248,0.4)", borderTopColor: "transparent" }}
        />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25">
          Initializing Sector Map
        </span>
      </div>
    </div>
  ),
});

/* ── Live UTC Clock ── */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toUTCString().split(" ").slice(4).join(" ").replace("GMT", "UTC"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular">{time}</span>;
}

/* ── Magnetic Button Hook ── */
function useMagnetic(strength = 0.4) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const handleLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);
  return ref;
}

/* ── Animated Stat Card ── */
function HeroStatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center justify-center py-4 px-3 rounded-lg overflow-hidden transition-all duration-500 cursor-default"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        transitionProperty: "box-shadow, transform",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px) scale(1.04)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${color}30, 0 0 1px ${color}60`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* glow bead */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <span
        className="font-mono font-bold text-[22px] sm:text-[26px] leading-none tracking-tight tabular"
        style={{
          color,
          textShadow: `0 0 16px ${color}80`,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {value}
      </span>
      <span className="mt-1.5 font-mono text-[9px] tracking-[0.18em] text-white/30 uppercase text-center">
        {label}
      </span>
    </div>
  );
}

const HERO_STATS = [
  { value: "54",     label: "Active Units",   color: "#38bdf8" },
  { value: "08",     label: "Crisis Zones",   color: "#ff2e4c" },
  { value: "2,847",  label: "Rescued Today",  color: "#22c55e" },
  { value: "99.97%", label: "Uptime",         color: "#f59e0b" },
];

/* ── Word-by-word title reveal ── */
const TITLE_LETTERS = "SENTINEL".split("");

export default function Hero() {
  const btnPrimaryRef = useMagnetic(0.3);
  const btnSecRef = useMagnetic(0.3);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
      style={{ paddingTop: "36px" /* ticker height */ }}
    >
      {/* ── Atmospheric glows ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%", right: "-5%",
          width: "55%", height: "70%",
          background: "radial-gradient(ellipse at top right, rgba(56,189,248,0.09) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-5%", left: "-5%",
          width: "45%", height: "60%",
          background: "radial-gradient(ellipse at bottom left, rgba(255,46,76,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Horizontal scan accent */}
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{
          top: "50%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.08) 30%, rgba(56,189,248,0.08) 70%, transparent)",
        }}
      />

      {/* ── Main content grid ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center px-6 py-12 lg:flex-row lg:items-center lg:gap-0 lg:px-12 xl:px-16">

        {/* ── LEFT COLUMN ── */}
        <div className="flex w-full flex-col justify-center lg:w-[54%]">

          {/* Classification + clock row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{
                color: "#38bdf8",
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.2)",
              }}
            >
              <Shield className="h-2.5 w-2.5" />
              SEC-CLEARANCE LVL-5
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{
                color: "#22c55e",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.18)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              </span>
              LIVE
            </span>
            <span className="font-mono text-[10px] tracking-[0.15em] text-white/20 uppercase">
              <LiveClock />
            </span>
          </motion.div>

          {/* ── GIANT TITLE ── */}
          <div className="mb-3 overflow-hidden">
            <div className="flex" aria-label="SENTINEL">
              {TITLE_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  whileHover={{
                    y: -12,
                    scale: 1.15,
                    color: "#38bdf8",
                    textShadow: "0 0 35px rgba(56,189,248,0.9), 0 0 70px rgba(56,189,248,0.45)",
                  }}
                  transition={{
                    default: { duration: 0.75, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] },
                    y: { type: "spring", stiffness: 450, damping: 12 },
                    scale: { type: "spring", stiffness: 450, damping: 12 }
                  }}
                  className="font-mono font-black leading-none tracking-[-0.03em] text-white cursor-pointer select-none"
                  style={{
                    fontSize: "clamp(64px, 10vw, 128px)",
                    display: "inline-block",
                    textShadow: "0 0 40px rgba(56,189,248,0.15)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16,1,0.3,1] }}
            className="mb-2"
          >
            <p
              className="font-mono text-[11px] tracking-[0.3em] uppercase mb-1"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Global Emergency Operations
            </p>
            <p
              className="font-mono font-light tracking-[0.06em]"
              style={{
                fontSize: "clamp(16px, 2.2vw, 24px)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Command &amp; Coordination Center
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16,1,0.3,1] }}
            className="mb-7 mt-5 max-w-[520px]"
            style={{ transformOrigin: "left" }}
          >
            <div
              className="h-px"
              style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.4), rgba(56,189,248,0.05), transparent)" }}
            />
          </motion.div>

          {/* ── Stat strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.16,1,0.3,1] }}
            className="mb-8 grid grid-cols-4 gap-2 max-w-[520px]"
          >
            {HERO_STATS.map((s) => (
              <HeroStatCard key={s.label} {...s} />
            ))}
          </motion.div>

          {/* ── Description ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-8 max-w-[430px] font-mono text-[13px] leading-[1.8] text-white/35"
          >
            Multi-theatre coordination across{" "}
            <span className="text-white/65">8 concurrent disaster zones</span>.
            Tactical resource deployment, satellite comms relay, and
            real-time field unit tracking across 24 nations.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.16,1,0.3,1] }}
            className="flex items-center gap-3 flex-wrap"
          >
            <button
              id="cta-active-ops"
              ref={btnPrimaryRef}
              onClick={() => scrollTo("incidents")}
              className="btn-magnetic group relative overflow-hidden rounded-sm px-6 py-3 font-mono text-[11px] tracking-[0.15em] text-white uppercase"
              style={{
                background: "rgba(255,46,76,0.12)",
                border: "1px solid rgba(255,46,76,0.4)",
                boxShadow: "0 0 20px rgba(255,46,76,0.08)",
                transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,46,76,0.22)";
                el.style.borderColor = "rgba(255,46,76,0.7)";
                el.style.boxShadow = "0 0 32px rgba(255,46,76,0.28), 0 0 8px rgba(255,46,76,0.2)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,46,76,0.12)";
                el.style.borderColor = "rgba(255,46,76,0.4)";
                el.style.boxShadow = "0 0 20px rgba(255,46,76,0.08)";
              }}
            >
              {/* Shine sweep on hover */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                }}
              />
              <Activity className="h-3.5 w-3.5" style={{ color: "#ff2e4c" }} />
              Active Operations
            </button>

            <button
              id="cta-crisis-feed"
              ref={btnSecRef}
              onClick={() => scrollTo("comms")}
              className="btn-magnetic group relative overflow-hidden rounded-sm px-6 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-white/50"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = "rgba(56,189,248,0.07)";
                el.style.borderColor = "rgba(56,189,248,0.35)";
                el.style.color = "#38bdf8";
                el.style.boxShadow = "0 0 24px rgba(56,189,248,0.1)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,255,255,0.02)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.color = "rgba(255,255,255,0.5)";
                el.style.boxShadow = "";
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.05) 50%, transparent 60%)",
                }}
              />
              <Radio className="h-3.5 w-3.5" />
              Crisis Feed
            </button>
          </motion.div>

          {/* ── System footer strip ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8 flex flex-wrap items-center gap-4 border-t pt-4 max-w-[520px]"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {[
              { label: "SENTINEL v4.2", color: "rgba(255,255,255,0.2)" },
              { label: "PROTOCOL DELTA-9", color: "rgba(255,255,255,0.2)" },
              { label: "LAST SYNC 0.3s", color: "rgba(255,255,255,0.2)" },
              { label: "ALL SYSTEMS NOMINAL", color: "#22c55e", glow: true },
            ].map(item => (
              <span
                key={item.label}
                className="font-mono text-[9px] tracking-[0.16em] uppercase"
                style={{
                  color: item.color,
                  textShadow: item.glow ? "0 0 10px rgba(34,197,94,0.5)" : undefined,
                }}
              >
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — Globe ── */}
        <div className="relative flex w-full items-center justify-center lg:w-[46%] mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16,1,0.3,1] }}
            className="float-up relative"
            style={{
              width: "clamp(320px, 46vw, 560px)",
              height: "clamp(320px, 46vw, 560px)",
            }}
          >
            {/* Outer rings */}
            <div
              className="spin-slow pointer-events-none absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(255,255,255,0.035)", transform: "scale(1.1)" }}
            />
            <div
              className="spin-medium pointer-events-none absolute inset-0 rounded-full"
              style={{ border: "1px dashed rgba(56,189,248,0.08)", transform: "scale(1.05)" }}
            />

            {/* Outer glow */}
            <div
              className="glow-pulse pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 80px rgba(56,189,248,0.1), 0 0 160px rgba(56,189,248,0.04)" }}
            />

            {/* Corner accents */}
            {[
              { top: 0, left: 0, borderTop: "1px solid", borderLeft: "1px solid" },
              { top: 0, right: 0, borderTop: "1px solid", borderRight: "1px solid" },
              { bottom: 0, left: 0, borderBottom: "1px solid", borderLeft: "1px solid" },
              { bottom: 0, right: 0, borderBottom: "1px solid", borderRight: "1px solid" },
            ].map((style, i) => (
              <div
                key={i}
                className="pointer-events-none absolute"
                style={{
                  ...style,
                  width: 20,
                  height: 20,
                  borderColor: "rgba(56,189,248,0.3)",
                }}
              />
            ))}

            {/* HUD label top */}
            <div
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.22em] uppercase text-white/20"
            >
              GLOBAL SECTOR MAP — LIVE
            </div>

            {/* HUD label bottom */}
            <div
              className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.18em] uppercase"
              style={{ color: "#22c55e", textShadow: "0 0 8px rgba(34,197,94,0.5)" }}
            >
              ● 8 ACTIVE ZONES TRACKED
            </div>

            <GlobeCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
