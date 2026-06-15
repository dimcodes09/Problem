"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Premium custom cursor — two-dot system (large follower + tiny dot)
 * Changes shape on hover over interactive elements.
 * activetheory-style: smooth lerped follower ring.
 */
export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: -100, y: -100 });
  const ringPos   = useRef({ x: -100, y: -100 });
  const rafRef    = useRef<number>(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Hide native cursor globally
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.tagName === "BUTTON" ||
        el.tagName === "A"       ||
        el.closest("button")    ||
        el.closest("a")         ||
        el.classList.contains("cursor-pointer")
      ) setHovered(true);
    };
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.addEventListener("mouseover",  onEnter);
    document.addEventListener("mouseout",   onLeave);

    // RAF loop for lerped follower
    const loop = () => {
      const { x: tx, y: ty } = posRef.current;
      const { x: rx, y: ry } = ringPos.current;
      const lerpFactor = 0.1;
      const nx = rx + (tx - rx) * lerpFactor;
      const ny = ry + (ty - ry) * lerpFactor;
      ringPos.current = { x: nx, y: ny };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${nx}px, ${ny}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseover",  onEnter);
      document.removeEventListener("mouseout",   onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full will-change-transform"
        style={{
          width:  clicked ? 6 : 5,
          height: clicked ? 6 : 5,
          background: hovered ? "#ff2e4c" : "#fff",
          boxShadow: hovered
            ? "0 0 8px rgba(255,46,76,0.8)"
            : "0 0 6px rgba(255,255,255,0.6)",
          transition: "width 0.15s, height 0.15s, background 0.2s, box-shadow 0.2s",
        }}
      />
      {/* Follower ring — lerped */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full will-change-transform"
        style={{
          width:  hovered ? 48 : clicked ? 24 : 32,
          height: hovered ? 48 : clicked ? 24 : 32,
          border: `1px solid ${hovered ? "rgba(255,46,76,0.5)" : "rgba(255,255,255,0.25)"}`,
          mixBlendMode: "difference",
          transition: "width 0.3s cubic-bezier(0.23,1,0.32,1), height 0.3s cubic-bezier(0.23,1,0.32,1), border-color 0.2s",
        }}
      />
    </>
  );
}
