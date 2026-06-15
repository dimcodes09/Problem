"use client";

import React, { useEffect, useState } from "react";
import AlertTicker from "@/components/AlertTicker";
import Hero from "@/components/Hero";
import StatCounters from "@/components/StatCounters";
import IncidentGrid from "@/components/IncidentGrid";
import CrisisTimeline from "@/components/CrisisTimeline";
import ResourceTracker from "@/components/ResourceTracker";
import CommsHub from "@/components/CommsHub";
import CustomCursor from "@/components/CustomCursor";

function LiveSyncTime() {
  const [sync, setSync] = useState("0.0s");
  useEffect(() => {
    let s = 0;
    const id = setInterval(() => {
      s = Math.random() * 1.5;
      setSync(`${s.toFixed(1)}s`);
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return <span>{sync}</span>;
}

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen w-full bg-transparent text-white">
      <CustomCursor />

      {/* ── Alert Ticker (Sticky Top) ── */}
      <AlertTicker />

      {/* ── Hero Section ── */}
      <Hero />

      {/* ── Section divider ── */}
      <div className="section-divider mx-auto max-w-[1400px] px-6" />

      {/* ── Stat Counters ── */}
      <StatCounters />

      {/* ── Section divider ── */}
      <div className="section-divider mx-auto max-w-[1400px] px-6" />

      {/* ── Incidents Grid ── */}
      <IncidentGrid />

      {/* ── Section divider ── */}
      <div className="section-divider mx-auto max-w-[1400px] px-6" />

      {/* ── Crisis Timeline ── */}
      <CrisisTimeline />

      {/* ── Section divider ── */}
      <div className="section-divider mx-auto max-w-[1400px] px-6" />

      {/* ── Resource Tracker ── */}
      <ResourceTracker />

      {/* ── Section divider ── */}
      <div className="section-divider mx-auto max-w-[1400px] px-6" />

      {/* ── Comms Hub ── */}
      <CommsHub />

      {/* ── Footer ── */}
      <footer
        className="relative z-20 py-8"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(6,6,12,0.95)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Top row */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] font-black tracking-[0.15em] text-white/70"
                style={{ letterSpacing: "0.2em" }}
              >
                SENTINEL
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-[10px] tracking-[0.15em] text-white/25">v4.2</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-[10px] tracking-[0.15em] text-white/25">PROTOCOL DELTA-9</span>
            </div>

            {/* Pulsing nominal indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              </span>
              <span
                className="font-mono text-[10px] tracking-[0.22em] uppercase"
                style={{ color: "#22c55e", textShadow: "0 0 10px rgba(34,197,94,0.5)" }}
              >
                ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>

          {/* Bottom row */}
          <div
            className="mt-5 flex flex-col items-center justify-between gap-2 border-t pt-5 text-[10px] sm:flex-row"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}
          >
            <span className="font-mono tracking-[0.12em] text-white/20 uppercase">
              {"SEC-CLEARANCE LEVEL-5 // GLOBAL OPERATIONS ACTIVE // MULTI-THEATRE COORDINATION"}
            </span>
            <div className="flex items-center gap-3 font-mono text-white/15">
              <span>LAST SYNC <LiveSyncTime /> AGO</span>
              <span className="text-white/10">{"//"}</span>
              <span>© {new Date().getFullYear()} SENTINEL INTERNATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
