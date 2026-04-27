"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const RESUME_TEXT = `I'm Christian a data scientist and full-stack builder based in Charlotte, NC. My background spans information systems, cybersecurity, and psychology research. Where I built a foundation in systems thinking, behavioral analysis, and human-centered research methods. I attended UNC Charlotte for the Data Science program and hold multiple Anthropic certifications, with deep hands-on experience in Python, SQL, and TypeScript. My work spans the full data lifecycle: from architecting relational databases in Oracle LiveSQL and conducting large-scale regression analyses across 62,000 data points, to building production-grade AI tools and MCP servers. I've applied these skills across domains ranging from labor economics and public health to prediction markets and AI literacy.`;
const SPEEDS = [
  { label: "235 wpm", wpm: 235 },
];

// A minor pentatonic: A C D E G
const SCALE = [110, 130.81, 146.83, 164.81, 196.00, 220, 261.63, 293.66, 329.63, 392.00];

function getOrpIndex(word: string): number {
  const len = word.replace(/[^a-zA-Z0-9]/g, "").length;
  if (len <= 2)  return 0;
  if (len <= 5)  return 1;
  if (len <= 9)  return 2;
  if (len <= 13) return 3;
  return 4;
}

function buildAmbient(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2);
  master.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];

  // Detuned pad layer — A minor chord (A, C, E) with warmth
  const padNotes = [110, 130.81, 164.81, 220, 261.63, 329.63];
  padNotes.forEach((freq, i) => {
    [0, 3, -3].forEach(detune => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;

      filter.type = "lowpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.4;

      gain.gain.value = 0.04 / (i * 0.5 + 1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
      oscs.push(osc);
    });
  });

  // Slow LFO tremolo on master
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);
  lfo.start();
  oscs.push(lfo);

  // Subtle high shimmer — pluck-like notes every few seconds
  let shimmerTimeout: ReturnType<typeof setTimeout>;
  function shimmer() {
    if (ctx.state === "closed") return;
    const note = SCALE[Math.floor(Math.random() * SCALE.length)] * 2;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = note;
    filter.type = "bandpass";
    filter.frequency.value = note;
    filter.Q.value = 2;

    const now = ctx.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.07, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(filter);
    filter.connect(env);
    env.connect(master);
    osc.start(now);
    osc.stop(now + 1.9);

    shimmerTimeout = setTimeout(shimmer, 1500 + Math.random() * 3000);
  }
  shimmer();

  return () => {
    clearTimeout(shimmerTimeout);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
      ctx.close();
    }, 1600);
  };
}

export default function RSVPPage() {
  const words = RESUME_TEXT.split(/\s+/).filter(Boolean);
  const [index,      setIndex]      = useState(0);
  const [running,    setRunning]    = useState(false);
  const [speedIndex] = useState(0);
  const [musicOn,    setMusicOn]    = useState(false);

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const stopMusicRef = useRef<(() => void) | null>(null);

  const wpm  = SPEEDS[speedIndex].wpm;
  const ms   = Math.round(60000 / wpm);
  const done = !running && index >= words.length - 1;

  // Music toggle
  const toggleMusic = useCallback(() => {
    if (musicOn) {
      stopMusicRef.current?.();
      stopMusicRef.current = null;
      audioCtxRef.current  = null;
      setMusicOn(false);
    } else {
      const ctx  = new AudioContext();
      const stop = buildAmbient(ctx);
      audioCtxRef.current  = ctx;
      stopMusicRef.current = stop;
      setMusicOn(true);
    }
  }, [musicOn]);

  // Cleanup music on unmount
  useEffect(() => {
    return () => { stopMusicRef.current?.(); };
  }, []);

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
      if (e.code === "KeyM")  { toggleMusic(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, toggleMusic]);

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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            onClick={toggleMusic}
            style={{
              fontSize: "11px",
              color: musicOn ? "#100F0F" : "#94A3B8",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Verdana, sans-serif",
              letterSpacing: "0.05em",
              padding: 0,
            }}
            title="toggle music (M)"
          >
            {musicOn ? "♪ music on" : "♪ music off"}
          </button>
          <span style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>resume / rsvp</span>
        </div>
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
