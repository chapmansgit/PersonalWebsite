"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const RESUME_TEXT = `I'm Christian a data scientist and full-stack builder based in Charlotte, NC. My background spans information systems, cybersecurity, and psychology research. Where I built a foundation in systems thinking, behavioral analysis, and human-centered research methods. I attended UNC Charlotte for the Data Science program and hold multiple Anthropic certifications, with deep hands-on experience in Python, SQL, and TypeScript. My work spans the full data lifecycle: from architecting relational databases in Oracle LiveSQL and conducting large-scale regression analyses across 62,000 data points, to building production-grade AI tools and MCP servers. I've applied these skills across domains ranging from labor economics and public health to prediction markets and AI literacy.`;

const SPEEDS = [
  { label: "235 wpm", wpm: 235 },
];

function getOrpIndex(word: string): number {
  const len = word.replace(/[^a-zA-Z0-9]/g, "").length;
  if (len <= 2)  return 0;
  if (len <= 5)  return 1;
  if (len <= 9)  return 2;
  if (len <= 13) return 3;
  return 4;
}

export default function RSVPPage() {
  const words = RESUME_TEXT.split(/\s+/).filter(Boolean);
  const [index,      setIndex]   = useState(0);
  const [running,    setRunning] = useState(false);
  const [speedIndex]             = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wpm  = SPEEDS[speedIndex].wpm;
  const ms   = Math.round(60000 / wpm);
  const done = !running && index >= words.length - 1;

  const toggle = useCallback(() => {
    if (!running && index >= words.length - 1) {
      setIndex(0);
      setRunning(true);
    } else {
      setRunning(r => !r);
    }
  }, [running, index, words.length]);

  // Spacebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  // Word interval
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= words.length) {
          setRunning(false);
          return prev;
        }
        return next;
      });
    }, ms);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, ms, words.length]);

  const word     = words[index] ?? "";
  const orp      = getOrpIndex(word);
  const left     = word.slice(0, orp);
  const pivot    = word.slice(orp, orp + 1);
  const right    = word.slice(orp + 1);
  const progress = words.length > 1 ? index / (words.length - 1) : 0;

  const statusText = done
    ? "done. click to restart"
    : running
    ? "click or space to pause"
    : index === 0
    ? "click or space to start"
    : "paused. click to continue";

  return (
    <div
      style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Verdana, sans-serif", display: "flex", flexDirection: "column" }}
      onClick={toggle}
    >
      {/* Header */}
      <div
        style={{ padding: "18px 28px", borderBottom: "1px solid #f2f0e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        onClick={e => e.stopPropagation()}
      >
        <Link href="/" style={{ color: "#64748B", textDecoration: "none", fontSize: "12px" }}>← back</Link>
        <span style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>resume / rsvp</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: "2px", background: "#f2f0e5" }}>
        <div style={{ height: "100%", background: "#100F0F", width: `${progress * 100}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Reader */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "36px" }}>

        {/* Word display */}
        <div style={{ display: "flex", alignItems: "baseline", fontSize: "44px", letterSpacing: "0.02em", userSelect: "none" }}>
          <span style={{ display: "inline-block", width: "160px", textAlign: "right", color: "#100F0F" }}>{left}</span>
          <span style={{ color: "#1F51FF", minWidth: "0.6ch", textAlign: "center" }}>{pivot}</span>
          <span style={{ display: "inline-block", width: "360px", textAlign: "left", color: "#100F0F" }}>{right}</span>
        </div>

        {/* Status */}
        <div style={{ fontSize: "11px", color: "#94A3B8", letterSpacing: "0.06em" }}>
          {statusText}
        </div>

        <div style={{ fontSize: "10px", color: "#94A3B8", letterSpacing: "0.05em" }}>235 wpm</div>

        {/* Word count */}
        <div style={{ fontSize: "10px", color: "#cbd5e1", letterSpacing: "0.05em" }}>
          {index + 1} / {words.length}
        </div>
      </div>
    </div>
  );
}
