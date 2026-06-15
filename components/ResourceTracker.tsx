"use client";

import React from "react";
import { motion } from "framer-motion";
import { Helicopter, HeartPulse, Truck, Tent, Package, Ship } from "lucide-react";
import { RESOURCES } from "../lib/mockData";

const RESOURCE_COLORS = {
  helicopters: { color: "#38bdf8", rgb: "56,189,248"   },
  medics:      { color: "#ff2e4c", rgb: "255,46,76"    },
  vehicles:    { color: "#f59e0b", rgb: "245,158,11"   },
  shelters:    { color: "#22c55e", rgb: "34,197,94"    },
  pallets:     { color: "#a78bfa", rgb: "167,139,250"  },
  boats:       { color: "#38bdf8", rgb: "56,189,248"   },
} as const;

const iconMap = {
  helicopters: Helicopter,
  medics:      HeartPulse,
  vehicles:    Truck,
  shelters:    Tent,
  pallets:     Package,
  boats:       Ship,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function ResourceTracker() {
  const keys = Object.keys(RESOURCES) as Array<keyof typeof RESOURCES>;

  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-20 z-20">

      {/* Header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#38bdf8]">
            GLOBAL LOGISTICS
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
          Resource{" "}
          <span style={{ color: "#38bdf8", textShadow: "0 0 24px rgba(56,189,248,0.4)" }}>
            Deployment
          </span>{" "}
          Status
        </motion.h2>
        <p className="mt-2 font-mono text-[13px] text-white/30">
          Tactical asset tracking and availability across all active sectors.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {keys.map(key => {
          const resource = RESOURCES[key];
          const Icon = iconMap[key];
          const { color, rgb } = RESOURCE_COLORS[key];
          const percent = (resource.deployed / resource.total) * 100;
          const remaining = resource.total - resource.deployed;

          return (
            <motion.div
              key={key}
              variants={itemVariants}
              className="group relative flex flex-col overflow-hidden rounded-xl p-5"
              style={{
                background: "rgba(12,12,20,0.85)",
                backdropFilter: "blur(12px)",
                border: `1px solid rgba(${rgb},0.12)`,
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
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px) scale(1.015)`;
                card.style.boxShadow = `0 0 0 1px rgba(${rgb},0.3), 0 12px 36px rgba(${rgb},0.15)`;
              }}
              onMouseLeave={e => {
                const card = e.currentTarget;
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
                card.style.boxShadow = "";
              }}
            >
              {/* Top accent stripe */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${color}80, ${color}20, transparent)` }}
              />

              {/* Corner detail */}
              <div
                className="pointer-events-none absolute bottom-0 right-0"
                style={{ width: 20, height: 20, borderBottom: `1px solid rgba(${rgb},0.25)`, borderRight: `1px solid rgba(${rgb},0.25)` }}
              />

              {/* Icon + label row */}
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <span className="font-mono font-semibold text-[13px] text-white/80 tracking-wide">
                  {resource.label}
                </span>
              </div>

              {/* Big numbers */}
              <div className="mb-5 flex items-baseline gap-1.5">
                <span
                  className="font-mono font-black leading-none"
                  style={{ fontSize: "clamp(32px, 3.5vw, 44px)", color, textShadow: `0 0 16px rgba(${rgb},0.5)` }}
                >
                  {resource.deployed}
                </span>
                <span className="font-mono text-xl text-white/15">/</span>
                <span className="font-mono text-xl text-white/40">{resource.total}</span>
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/25 ml-1">
                  DEPLOYED
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div
                  className="relative h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px rgba(${rgb},0.7)` }}
                  />
                </div>

                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-white/25 uppercase tracking-wide">STATUS: ACTIVE DEMAND</span>
                  <span className="text-white/45">
                    <span className="text-white font-medium">{remaining}</span> remaining
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
