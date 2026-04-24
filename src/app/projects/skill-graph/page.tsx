"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { companies } from "@/data/companies";
import { MY_SERIES } from "@/components/SkillRadar";
import type { AnalysisResult, RequirementMatch } from "@/app/api/analyze-job/route";
import type { FetchedJob } from "@/app/api/jobs/route";

const SkillRadar = dynamic(() => import("@/components/SkillRadar"), { ssr: false });

const AXES = [
  "Python", "TypeScript", "AI Tooling", "API Design",
  "SQL", "Database Design", "Statistics", "Visualization",
];

const CONF_STYLE: Record<RequirementMatch["confidence"], { color: string; dot: string; label: string }> = {
  direct:   { color: "#2A9D6E", dot: "●", label: "direct"   },
  adjacent: { color: "#E07B39", dot: "◐", label: "adjacent" },
  none:     { color: "#c0392b", dot: "○", label: "none"     },
};

function RequirementRow({ req }: { req: RequirementMatch }) {
  const conf = CONF_STYLE[req.confidence];
  return (
    <div style={{ borderBottom: "1px solid #f2f0e5", paddingBottom: "10px", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ color: conf.color, fontSize: "12px", lineHeight: 1 }}>{conf.dot}</span>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#100F0F" }}>{req.skill}</span>
        </div>
        <span style={{ fontSize: "10px", color: conf.color, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
          {conf.label}
        </span>
      </div>
      <div style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.55, paddingLeft: "19px" }}>
        {req.evidence}
      </div>
    </div>
  );
}

export default function SkillGraph() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobId,   setSelectedJobId]   = useState("");
  const [fetchedJobs,     setFetchedJobs]     = useState<FetchedJob[]>([]);
  const [jobsLoading,     setJobsLoading]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [result,          setResult]          = useState<AnalysisResult | null>(null);
  const [error,           setError]           = useState("");

  const company    = companies.find((c) => c.slug === selectedCompany);
  const selectedJob = fetchedJobs.find((j) => j.id === selectedJobId);

  // Fetch jobs when company changes
  useEffect(() => {
    if (!company) { setFetchedJobs([]); return; }
    setJobsLoading(true);
    setFetchedJobs([]);
    setSelectedJobId("");
    setResult(null);
    setError("");

    fetch(`/api/jobs?query=${encodeURIComponent(company.query)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFetchedJobs(data.jobs ?? []);
      })
      .catch((e) => setError(`Failed to load jobs: ${(e as Error).message}`))
      .finally(() => setJobsLoading(false));
  }, [company]);

  async function runAnalysis() {
    if (!selectedJob?.description) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res  = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: selectedJob.description }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const matchPct = result ? result.weightedMatchPct : null;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-roboto-mono), monospace", fontSize: "14px", color: "#100F0F" }}>

      {/* Header */}
      <div style={{ padding: "18px 28px", borderBottom: "1px solid #f2f0e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#64748B", textDecoration: "none", fontSize: "12px" }}>← back</Link>
        <span style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>skill graph</span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "28px", padding: "16px 0 0", flexWrap: "wrap" }}>
        {[
          { label: "Projects",         color: "#3B5EA6" },
          { label: "Education",        color: "#2A9D6E" },
          { label: "Job Requirements", color: "#E07B39", faded: !result },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px", opacity: "faded" in s && s.faded ? 0.3 : 1, transition: "opacity 0.4s" }}>
            <svg width="24" height="2" viewBox="0 0 24 2"><line x1="0" y1="1" x2="24" y2="1" stroke={s.color} strokeWidth="2" /></svg>
            <span style={{ fontSize: "11px", color: "#64748B" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* 3-D canvas */}
      <SkillRadar jobScores={result?.scores ?? null} />

      {/* Plane labels */}
      <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "-4px", paddingBottom: "12px", flexWrap: "wrap" }}>
        {[
          { label: "bottom: projects",     color: "#3B5EA6" },
          { label: "mid: education",        color: "#2A9D6E" },
          { label: "top: job requirements", color: "#E07B39", faded: !result },
        ].map((s) => (
          <span key={s.label} style={{ fontSize: "10px", color: s.color, opacity: "faded" in s && s.faded ? 0.3 : 1, transition: "opacity 0.4s" }}>
            {s.label}
          </span>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #f2f0e5", margin: "0 28px 24px" }} />

      {/* Job selector + report */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 28px 56px" }}>

        <div style={{ background: "#f9f8f3", border: "1px solid #e8e6d9", padding: "20px 24px", borderRadius: "2px" }}>
          <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "14px", letterSpacing: "0.08em" }}>JOB MATCH ANALYSIS</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={selectStyle}
            >
              <option value="">select company</option>
              {companies.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            <select
              value={selectedJobId}
              onChange={(e) => { setSelectedJobId(e.target.value); setResult(null); setError(""); }}
              disabled={!company || jobsLoading || fetchedJobs.length === 0}
              style={{ ...selectStyle, opacity: company && !jobsLoading ? 1 : 0.45 }}
            >
              <option value="">
                {jobsLoading ? "loading jobs…" : fetchedJobs.length === 0 && company ? "no jobs found" : "select role"}
              </option>
              {fetchedJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>

            <button
              onClick={runAnalysis}
              disabled={!selectedJob?.description || loading}
              style={btnStyle(!!selectedJob?.description && !loading)}
            >
              {loading ? "analyzing…" : "analyze →"}
            </button>
          </div>
          {error && <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "10px" }}>{error}</div>}
        </div>

        {/* Report */}
        {result && (
          <div style={{ marginTop: "20px" }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }`}</style>
            <div style={{ animation: "fadeUp 0.4s ease" }}>

              {/* Title + match % */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{result.jobTitle}</div>
                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{result.company} · Charlotte, NC</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: matchColor(matchPct!) }}>{matchPct}%</div>
                  <div style={{ fontSize: "10px", color: "#94A3B8" }}>weighted match</div>
                </div>
              </div>

              {/* Required */}
              {result.required?.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "12px", letterSpacing: "0.08em" }}>REQUIRED SKILLS</div>
                  {result.required.map((req) => <RequirementRow key={req.skill} req={req} />)}
                </div>
              )}

              {/* Preferred */}
              {result.preferred?.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "12px", letterSpacing: "0.08em" }}>PREFERRED SKILLS</div>
                  {result.preferred.map((req) => <RequirementRow key={req.skill} req={req} />)}
                </div>
              )}

              {/* Strengths + Gaps */}
              {(result.strengths?.length > 0 || result.gaps?.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  {result.strengths?.length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", color: "#2A9D6E", marginBottom: "8px", letterSpacing: "0.08em" }}>LEAD WITH</div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {result.strengths.map((s) => (
                          <li key={s} style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5, display: "flex", gap: "6px" }}>
                            <span style={{ color: "#2A9D6E", flexShrink: 0 }}>+</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.gaps?.length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", color: "#c0392b", marginBottom: "8px", letterSpacing: "0.08em" }}>ADDRESS</div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {result.gaps.map((g) => (
                          <li key={g} style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5, display: "flex", gap: "6px" }}>
                            <span style={{ color: "#c0392b", flexShrink: 0 }}>-</span>{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Diverging bar — radar axes */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#94A3B8", marginBottom: "10px", letterSpacing: "0.06em" }}>
                  <span>← gap</span>
                  <span>RADAR AXIS COMPARISON</span>
                  <span>exceeds →</span>
                </div>
                {AXES.map((axis, i) => {
                  const mine   = Math.max(MY_SERIES[0].values[i], MY_SERIES[1].values[i]);
                  const needed = result.scores[axis] ?? 0;
                  const gap    = mine - needed;
                  const pct    = Math.abs(gap) / 10 * 50;
                  const isGap  = gap < 0;
                  return (
                    <div key={axis} style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <div style={{ textAlign: "right", fontSize: "10px", color: isGap ? "#c0392b" : "#d1cfc4" }}>
                        {isGap ? `−${Math.abs(gap)}` : ""}
                      </div>
                      <div style={{ position: "relative", height: "18px", display: "flex", alignItems: "center" }}>
                        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                          <div style={{ width: "50%", borderRight: "1px solid #d1cfc4", background: "#faf9f5" }} />
                          <div style={{ width: "50%", background: "#faf9f5" }} />
                        </div>
                        <div style={{
                          position: "absolute",
                          height: "8px",
                          width: `${pct}%`,
                          background: isGap ? "#c0392b" : "#2A9D6E",
                          borderRadius: "2px",
                          left: isGap ? `${50 - pct}%` : "50%",
                          transition: "width 0.5s ease",
                        }} />
                        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: "10px", color: "#475569", whiteSpace: "nowrap", background: "#faf9f5", padding: "0 4px" }}>
                          {axis}
                        </div>
                      </div>
                      <div style={{ textAlign: "left", fontSize: "10px", color: !isGap ? "#2a9d6e" : "#d1cfc4" }}>
                        {!isGap ? `+${gap}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Raw skills */}
              {result.rawSkills?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "7px", letterSpacing: "0.06em" }}>SKILLS LISTED IN POSTING</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.rawSkills.map((s) => (
                      <span key={s} style={{ fontSize: "10px", background: "#f2f0e5", padding: "2px 8px", borderRadius: "2px", color: "#475569" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div style={{ fontSize: "12px", lineHeight: 1.65, color: "#475569", borderLeft: "2px solid #e8e6d9", paddingLeft: "12px" }}>
                {result.matchSummary}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  fontFamily: "var(--font-roboto-mono), monospace",
  fontSize: "12px",
  padding: "6px 10px",
  border: "1px solid #d1cfc4",
  background: "#ffffff",
  color: "#100F0F",
  borderRadius: "2px",
  cursor: "pointer",
  flex: "1 1 auto",
  minWidth: "160px",
};

const btnStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: "var(--font-roboto-mono), monospace",
  fontSize: "12px",
  padding: "6px 16px",
  border: `1px solid ${active ? "#100F0F" : "#d1cfc4"}`,
  background: active ? "#100F0F" : "#f2f0e5",
  color: active ? "#ffffff" : "#94A3B8",
  borderRadius: "2px",
  cursor: active ? "pointer" : "default",
  transition: "all 0.15s",
  whiteSpace: "nowrap",
});

const matchColor = (pct: number) =>
  pct >= 80 ? "#2a9d6e" : pct >= 60 ? "#e07b39" : "#c0392b";

