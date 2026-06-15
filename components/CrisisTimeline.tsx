"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Radio, Truck, HeartPulse, Plane, ShieldCheck } from "lucide-react";
import { CRISIS_TIMELINE } from "../lib/mockData";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  AlertTriangle,
  Radio,
  Truck,
  HeartPulse,
  Plane,
  ShieldCheck,
};

const EVENT_COLORS = [
  { color: "#22c55e", rgb: "34,197,94"   },  // 0 seismic
  { color: "#ff2e4c", rgb: "255,46,76"   },  // 1 command
  { color: "#ff2e4c", rgb: "255,46,76"   },  // 2 deploy
  { color: "#f59e0b", rgb: "245,158,11"  },  // 3 survivor
  { color: "#38bdf8", rgb: "56,189,248"  },  // 4 international
  { color: "#22c55e", rgb: "34,197,94"   },  // 5 complete
];

export default function CrisisTimeline() {
  return (
    <section className="relative w-full py-20 z-20" style={{ background: "rgba(8,8,14,0.6)" }}>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#38bdf8]">
              CRISIS PROGRESSION
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-black leading-none tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(26px, 4vw, 52px)" }}
          >
            The{" "}
            <span style={{ color: "#38bdf8", textShadow: "0 0 24px rgba(56,189,248,0.4)" }}>
              72-Hour
            </span>{" "}
            Operation
          </motion.h2>
          <p className="mt-2 font-mono text-[13px] text-white/30">
            Scroll horizontally to track execution milestones from T+0 to resolution.
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="w-full overflow-x-auto pb-6">
          <div className="relative min-w-[1100px] px-4 pt-2">

            {/* Connecting rail */}
            <div
              className="pointer-events-none absolute left-8 right-8"
              style={{
                top: "52px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 10%, rgba(56,189,248,0.2) 90%, transparent)",
              }}
            />

            {/* Progress fill on rail */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-8 right-8"
              style={{
                top: "52px",
                height: "1px",
                transformOrigin: "left",
                background: "linear-gradient(90deg, rgba(56,189,248,0.6), rgba(34,197,94,0.4))",
                boxShadow: "0 0 8px rgba(56,189,248,0.4)",
              }}
            />

            {/* Nodes */}
            <div className="flex items-start justify-between relative z-10">
              {CRISIS_TIMELINE.map((step, idx) => {
                const { color, rgb } = EVENT_COLORS[idx] ?? EVENT_COLORS[0];
                const IconComponent = iconMap[step.icon] || AlertTriangle;
                return (
                  <motion.div
                    key={step.event}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-[175px] flex-col items-center"
                  >
                    {/* Time chip above rail */}
                    <div
                      className="mb-4 rounded px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider"
                      style={{
                        color,
                        background: `rgba(${rgb},0.1)`,
                        border: `1px solid rgba(${rgb},0.2)`,
                        textShadow: `0 0 8px rgba(${rgb},0.5)`,
                      }}
                    >
                      {step.time}
                    </div>

                    {/* Dot on rail */}
                    <div className="relative mb-6 flex h-8 w-8 items-center justify-center">
                      <span
                        className="pulse-ring absolute inline-flex h-5 w-5 rounded-full opacity-40"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="relative h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: color, boxShadow: `0 0 10px rgba(${rgb},0.8)` }}
                      />
                    </div>

                    {/* Card below rail */}
                    <div
                      className="w-full rounded-xl p-4 transition-all duration-300 group"
                      style={{
                        background: "rgba(12,12,20,0.85)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid rgba(${rgb},0.15)`,
                        cursor: "default",
                        transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s cubic-bezier(0.23,1,0.32,1)",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = "translateY(-4px)";
                        el.style.boxShadow = `0 8px 24px rgba(${rgb},0.15), 0 0 0 1px rgba(${rgb},0.25)`;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = "";
                        el.style.boxShadow = "";
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] rounded-t-xl"
                        style={{ background: `linear-gradient(90deg, ${color}60, ${color}20, transparent)` }}
                      />

                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="inline-flex h-6 w-6 items-center justify-center rounded"
                          style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
                        >
                          <div style={{ color }}><IconComponent className="h-3.5 w-3.5" /></div>
                        </div>
                        <h4 className="font-mono text-[11px] font-bold text-white leading-tight">
                          {step.event}
                        </h4>
                      </div>
                      <p className="font-mono text-[11px] leading-relaxed text-white/40">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
