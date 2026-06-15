"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio as RadioIcon, Terminal, Disc, Wifi, Signal } from "lucide-react";
import { COMMS_FEED, CommsMessage } from "../lib/mockData";

const FREQ_COLORS: Record<string, string> = {
  "156.8 MHz": "#38bdf8",
  "121.5 MHz": "#22c55e",
  "243.0 MHz": "#f59e0b",
  ALL:         "#94a3b8",
};

export default function CommsHub() {
  const [messages, setMessages] = useState<CommsMessage[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const feedIndexRef = useRef(4);

  useEffect(() => {
    setMessages(COMMS_FEED.slice(0, 4));
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const next = COMMS_FEED[feedIndexRef.current % COMMS_FEED.length];
      setMessages(prev => [next, ...(prev.length >= 20 ? prev.slice(0, 19) : prev)]);
      feedIndexRef.current++;
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const filtered = filter === "ALL" ? messages : messages.filter(m => m.freq === filter);
  const frequencies = ["ALL", "156.8 MHz", "121.5 MHz", "243.0 MHz"];

  /* Waveform heights stable across server/client */
  const waveHeights = [14,38,22,48,18,52,28,44,16,36,26,50,20,42,30,46,12,40,24,54,18,34,28,48];

  return (
    <section id="comms" className="relative mx-auto max-w-[1400px] px-6 py-20 z-20">

      {/* Section header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f59e0b]">
            Communications Hub
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
          Live Tactical{" "}
          <span style={{ color: "#f59e0b", textShadow: "0 0 24px rgba(245,158,11,0.4)" }}>
            Comms Log
          </span>
        </motion.h2>
        <p className="mt-2 font-mono text-[13px] text-white/30">
          Encrypted radio transmissions from field units — decrypted in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">

        {/* ── Terminal feed (60%) ── */}
        <div
          className="lg:col-span-6 flex flex-col overflow-hidden rounded-xl"
          style={{
            background: "rgba(6,8,14,0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(245,158,11,0.12)",
            boxShadow: "0 0 40px rgba(245,158,11,0.04)",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-white">
                LIVE RADIO FEED
              </span>
              <span className="font-mono text-[10px] text-white/20 tracking-wider">
                // AES-XTS 256 ENCRYPTED
              </span>
            </div>

            {/* Frequency selectors */}
            <div
              className="flex items-center gap-1 rounded p-0.5"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {frequencies.map(freq => {
                const isActive = filter === freq;
                const color = FREQ_COLORS[freq] ?? "#94a3b8";
                return (
                  <button
                    key={freq}
                    id={`freq-${freq.replace(/\s/g, "-")}`}
                    onClick={() => setFilter(freq)}
                    className="rounded px-2.5 py-1 font-mono text-[9px] font-medium tracking-wider transition-all duration-200"
                    style={{
                      background: isActive ? `rgba(${color === "#38bdf8" ? "56,189,248" : color === "#22c55e" ? "34,197,94" : color === "#f59e0b" ? "245,158,11" : "148,163,184"},0.15)` : "transparent",
                      color: isActive ? color : "rgba(255,255,255,0.3)",
                      border: isActive ? `1px solid ${color}40` : "1px solid transparent",
                    }}
                  >
                    {freq === "ALL" ? "ALL FREQS" : freq.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed body */}
          <div
            className="relative flex-1 min-h-[360px] max-h-[460px] overflow-y-auto p-5 font-mono text-xs space-y-3.5"
            style={{ background: "rgba(4,5,10,0.8)" }}
          >
            {/* Scanlines */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
                opacity: 0.35,
              }}
            />

            <div className="relative z-10">
              <div
                className="mb-3 border-b pb-2 text-[10px] text-white/20"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                [SYSTEM-INIT] ENCRYPTED TUNNEL ESTABLISHED // DECRYPTION KEY: SET-v4.2 // STANDBY
              </div>

              <AnimatePresence initial={false}>
                {filtered.map((msg, i) => {
                  const freqColor = FREQ_COLORS[msg.freq] ?? "#94a3b8";
                  return (
                    <motion.div
                      key={`${msg.time}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-start gap-2 leading-relaxed"
                    >
                      <span className="shrink-0 text-white/25">[{msg.time}]</span>
                      <span className="shrink-0 font-semibold" style={{ color: freqColor }}>
                        [{msg.freq}]
                      </span>
                      <span className="shrink-0 font-bold text-[#f59e0b]">{msg.team}:</span>
                      <span className="text-white/75">{msg.message}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Blinking cursor */}
              <div className="flex items-center gap-1 pt-2 text-[11px] text-white/25">
                <span>LISTENING ON STAGE CHANNELS</span>
                <span className="blink font-bold text-[#ff2e4c]">█</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel (40%) ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Spectrum analyzer */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(12,12,20,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Signal className="h-4 w-4 text-[#38bdf8]" />
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white">
                SPECTRUM ANALYZER
              </span>
            </div>

            <div
              className="flex items-end justify-between h-20 w-full rounded-lg px-4 gap-px overflow-hidden"
              style={{ background: "rgba(4,5,10,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {waveHeights.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  animate={{ height: [h, h * 1.8, h] }}
                  transition={{
                    duration: 0.6 + (i % 5) * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.04,
                  }}
                  style={{
                    backgroundColor: i % 7 === 0 ? "#ff2e4c" : i % 5 === 0 ? "#f59e0b" : "#38bdf8",
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>

            <div className="mt-3 flex justify-between font-mono text-[9px] text-white/25">
              <span>CH WIDTH: 12.5 KHZ</span>
              <span>DEV: ±2.5 KHZ</span>
            </div>
          </div>

          {/* Connection status */}
          <div
            className="flex-1 rounded-xl p-5"
            style={{
              background: "rgba(12,12,20,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <RadioIcon className="h-4 w-4 text-[#f59e0b]" />
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white">
                LINK STATUS
              </span>
            </div>

            <div className="space-y-4">
              {/* Signal strength */}
              <div>
                <div className="mb-2 flex justify-between font-mono text-[10px]">
                  <span className="text-white/40">SIGNAL STRENGTH</span>
                  <span style={{ color: "#22c55e", textShadow: "0 0 8px rgba(34,197,94,0.5)" }}>98.2%</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2.5 flex-1 rounded-sm"
                      style={{ background: i < 4 ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.06)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Status items */}
              <div className="space-y-3 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {[
                  { Icon: Terminal, label: "Encryption Protocol", value: "AES-XTS 256",   color: "white" },
                  { Icon: Wifi,     label: "Direct Uplink",       value: "SECURED",       color: "#22c55e" },
                  { Icon: Disc,     label: "Recording Feed",      value: "REC...",        color: "#ff2e4c", animate: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/40">
                      <item.Icon className={`h-3.5 w-3.5 ${item.animate ? "animate-spin" : ""}`} />
                      <span className="font-mono">{item.label}</span>
                    </div>
                    <span
                      className={`font-mono font-medium text-[11px] ${item.animate ? "animate-pulse" : ""}`}
                      style={{
                        color: item.color,
                        textShadow: item.color !== "white" ? `0 0 8px ${item.color}80` : undefined,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
