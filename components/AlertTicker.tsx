"use client";

import React, { useEffect, useRef } from "react";
import { TICKER_ALERTS } from "../lib/mockData";

export default function AlertTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);

  const alertsString = TICKER_ALERTS.map((a, i) => {
    const isAlert = a.includes("CRITICAL");
    return `<span class="${isAlert ? "text-[#ff2e4c]" : "text-[#38bdf8]/70"} font-semibold mr-1">${isAlert ? "⬤" : "◆"}</span><span class="${isAlert ? "text-[#ff2e4c]/90" : "text-white/50"}">${a}</span>`;
  }).join(`<span class="mx-6 text-white/15">///</span>`);

  const doubleString = alertsString + `<span class="mx-6 text-white/15">///</span>` + alertsString;

  return (
    <div
      className="sticky top-0 z-50 flex h-9 w-full items-center overflow-hidden"
      style={{
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,46,76,0.18)",
        boxShadow: "0 1px 20px rgba(255,46,76,0.06)",
      }}
    >
      {/* LIVE badge */}
      <div
        className="z-10 flex h-full shrink-0 items-center gap-2 px-4"
        style={{
          borderRight: "1px solid rgba(255,46,76,0.2)",
          background: "rgba(255,46,76,0.06)",
        }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#ff2e4c] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff2e4c]" />
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "#ff2e4c" }}
        >
          LIVE ALERTS
        </span>
      </div>

      {/* Scrolling marquee */}
      <div className="relative flex flex-1 items-center overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 z-10 h-full w-12 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 z-10 h-full w-12 bg-gradient-to-l from-[#0a0a0f] to-transparent" />

        <div
          className="ticker-scroll flex items-center whitespace-nowrap py-1 font-mono text-[11px]"
          dangerouslySetInnerHTML={{ __html: doubleString }}
        />
      </div>

      {/* Right: clock */}
      <div
        className="shrink-0 px-4 font-mono text-[10px] tracking-[0.15em] text-white/25 tabular"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
      >
        UTC LIVE
      </div>
    </div>
  );
}
