"use client";

import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface SeverityBadgeProps {
  severity: string;
}

const CONFIG = {
  CRITICAL: {
    color: "#ff2e4c",
    rgb: "255,46,76",
    Icon: AlertTriangle,
    pulse: true,
  },
  HIGH: {
    color: "#f59e0b",
    rgb: "245,158,11",
    Icon: AlertCircle,
    pulse: false,
  },
  MEDIUM: {
    color: "#38bdf8",
    rgb: "56,189,248",
    Icon: Info,
    pulse: false,
  },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const key = severity.toUpperCase() as keyof typeof CONFIG;
  const cfg = CONFIG[key] ?? CONFIG.MEDIUM;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
      style={{
        color: cfg.color,
        background: `rgba(${cfg.rgb},0.1)`,
        border: `1px solid rgba(${cfg.rgb},0.25)`,
      }}
    >
      {cfg.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.color }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: cfg.color }}
          />
        </span>
      ) : (
        <cfg.Icon className="h-2.5 w-2.5" />
      )}
      {severity}
    </span>
  );
}
