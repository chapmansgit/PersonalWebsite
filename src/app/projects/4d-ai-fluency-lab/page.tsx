import Link from "next/link";

export const metadata = {
  title: "4D AI Fluency Lab",
  description:
    "A local MCP server that measures, tracks, and develops AI fluency through behavioral assessment of Claude conversations.",
};

// ─── Palette (matches site-wide blue theme) ──────────────────────────────────
// primary: #475569  light: #d1cfc4  bg: #f9f8f3  dark: #100F0F  ultra: #f2f0e5

// ─── Architecture Flow Diagram ───────────────────────────────────────────────
function ArchitectureDiagram() {
  const W = 740, H = 230;

  // Node definitions [id, label, sublabel, x, y, w, h, style]
  type NodeStyle = "source" | "process" | "storage" | "output";
  const nodes: { id: string; label: string; sub?: string; x: number; y: number; w: number; h: number; style: NodeStyle }[] = [
    { id: "rubric",  label: "rubric.md",       sub: "single source of truth", x: 20,  y: 88,  w: 128, h: 54, style: "source"  },
    { id: "classify",label: "classify-export", sub: "Claude scores each prompt", x: 198, y: 88,  w: 148, h: 54, style: "process" },
    { id: "db",      label: "SQLite DB",        sub: "profiles · scores · history", x: 394, y: 88,  w: 138, h: 54, style: "storage" },
    { id: "report",  label: "HTML Report",      x: 586, y: 20,  w: 138, h: 38, style: "output"  },
    { id: "trainer", label: "Trainer Game",     x: 586, y: 70,  w: 138, h: 38, style: "output"  },
    { id: "packet",  label: "Champion Packet",  x: 586, y: 120, w: 138, h: 38, style: "output"  },
    { id: "cohort",  label: "Cohort Analytics", x: 586, y: 170, w: 138, h: 38, style: "output"  },
  ];

  const colors: Record<NodeStyle, { bg: string; border: string; text: string; sub: string }> = {
    source:  { bg: "#f9f8f3", border: "#d1cfc4", text: "#100F0F", sub: "#64748B" },
    process: { bg: "#f2f0e5", border: "#475569", text: "#100F0F", sub: "#64748B" },
    storage: { bg: "#100F0F", border: "#100F0F", text: "white",   sub: "rgba(255,255,255,0.65)" },
    output:  { bg: "#f9f8f3", border: "#d1cfc4", text: "#100F0F", sub: "#64748B" },
  };

  const cx = (n: typeof nodes[number]) => n.x + n.w / 2;
  const cy = (n: typeof nodes[number]) => n.y + n.h / 2;

  const get = (id: string) => nodes.find(n => n.id === id)!;

  // Arrows: [fromId, toId, curve?]
  const arrows: [string, string][] = [
    ["rubric",   "classify"],
    ["classify", "db"],
  ];
  const fanArrows = ["report", "trainer", "packet", "cohort"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Architecture diagram">
      <defs>
        <marker id="arrowBlue" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#475569" />
        </marker>
        <marker id="arrowDark" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#d1cfc4" />
        </marker>
      </defs>

      {/* Section labels */}
      <text x="84"  y="12" textAnchor="middle" fontSize={8.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">INPUT</text>
      <text x="272" y="12" textAnchor="middle" fontSize={8.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">PROCESS</text>
      <text x="463" y="12" textAnchor="middle" fontSize={8.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">STORAGE</text>
      <text x="655" y="12" textAnchor="middle" fontSize={8.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">OUTPUTS</text>

      {/* Main pipeline arrows */}
      {arrows.map(([fromId, toId]) => {
        const a = get(fromId), b = get(toId);
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={a.x + a.w} y1={cy(a)}
            x2={b.x - 4}   y2={cy(b)}
            stroke="#475569" strokeWidth="1.5"
            markerEnd="url(#arrowBlue)"
          />
        );
      })}

      {/* Fan-out arrows from DB to outputs */}
      {fanArrows.map((outId) => {
        const db = get("db"), out = get(outId);
        const x1 = db.x + db.w, y1 = cy(db);
        const x2 = out.x - 4, y2 = cy(out);
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={outId}
            d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none" stroke="#d1cfc4" strokeWidth="1.2"
            markerEnd="url(#arrowDark)"
          />
        );
      })}

      {/* Node boxes */}
      {nodes.map((n) => {
        const c = colors[n.style];
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8}
              fill={c.bg} stroke={c.border} strokeWidth={n.style === "storage" ? 0 : 1.5} />
            <text x={cx(n)} y={n.sub ? cy(n) - 6 : cy(n) + 4}
              textAnchor="middle" fontSize={10.5} fontWeight="700"
              fill={c.text} fontFamily="Roboto Mono, monospace">
              {n.label}
            </text>
            {n.sub && (
              <text x={cx(n)} y={cy(n) + 11}
                textAnchor="middle" fontSize={8}
                fill={c.sub} fontFamily="Roboto Mono, monospace">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}

      {/* "Claude Sessions" secondary input note */}
      <rect x={198} y={158} width={148} height={34} rx={6}
        fill="white" stroke="#d1cfc4" strokeWidth="1.2" strokeDasharray="4 3" />
      <text x={272} y={172} textAnchor="middle" fontSize={9} fill="#64748B" fontFamily="Roboto Mono, monospace" fontWeight="600">
        Claude Sessions
      </text>
      <text x={272} y={184} textAnchor="middle" fontSize={7.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace">
        ~/.claude/projects/
      </text>
      <line x1={272} y1={158} x2={272} y2={144} stroke="#d1cfc4" strokeWidth="1.2"
        strokeDasharray="3 3" markerEnd="url(#arrowDark)" />
    </svg>
  );
}

// ─── 4D Radar Chart ───────────────────────────────────────────────────────────
function RadarChart() {
  const cx = 155, cy = 150, maxR = 105;
  const scale = (score: number) => (score / 3) * maxR;

  // Axes: top=Delegation, right=Description, bottom=Discernment, left=Diligence
  const axes = [
    { label: "Delegation",  angle: -90 },
    { label: "Description", angle:   0 },
    { label: "Discernment", angle:  90 },
    { label: "Diligence",   angle: 180 },
  ];

  const pt = (score: number, angle: number) => {
    const r = scale(score);
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const polyPts = (scores: number[]) =>
    scores.map((s, i) => {
      const p = pt(s, axes[i].angle);
      return `${p.x},${p.y}`;
    }).join(" ");

  // Foundation example
  const foundationScores = [0.7, 1.1, 0.5, 0.8];
  // Expert example
  const expertScores = [2.5, 2.8, 2.3, 2.6];

  // Grid rings at score 1, 2, 3
  const gridRings = [1, 2, 3];

  return (
    <svg viewBox="0 0 340 310" className="w-full h-auto" aria-label="4D scoring radar chart">

      {/* Grid diamonds */}
      {gridRings.map((s) => {
        const pts = axes.map((a) => {
          const p = pt(s, a.angle);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon key={s} points={pts}
            fill="none" stroke="#f2f0e5" strokeWidth={s === 3 ? 1.5 : 1} />
        );
      })}

      {/* Axis lines */}
      {axes.map((a) => {
        const end = pt(3, a.angle);
        return (
          <line key={a.label}
            x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="#f2f0e5" strokeWidth="1" />
        );
      })}

      {/* Grid score labels */}
      {gridRings.map((s) => (
        <text key={s} x={cx + 4} y={cy - scale(s) + 4}
          fontSize={7.5} fill="#94A3B8" fontFamily="monospace">{s}.0</text>
      ))}

      {/* Foundation polygon */}
      <polygon points={polyPts(foundationScores)}
        fill="rgba(0,0,0,0.06)" stroke="#d1cfc4" strokeWidth="1.5" />

      {/* Expert polygon */}
      <polygon points={polyPts(expertScores)}
        fill="rgba(0,0,0,0.12)" stroke="#100F0F" strokeWidth="2" />

      {/* Axis labels */}
      {axes.map((a) => {
        const end = pt(3.45, a.angle);
        const anchor = a.angle === 0 ? "start" : a.angle === 180 ? "end" : "middle";
        const dy = a.angle === -90 ? -6 : a.angle === 90 ? 14 : 4;
        return (
          <text key={a.label}
            x={end.x} y={end.y + dy}
            textAnchor={anchor} fontSize={10.5} fontWeight="700"
            fill="#100F0F" fontFamily="Roboto Mono, monospace">
            {a.label}
          </text>
        );
      })}

      {/* Dot markers at each axis for expert */}
      {expertScores.map((s, i) => {
        const p = pt(s, axes[i].angle);
        return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#100F0F" />;
      })}

      {/* Dot markers for foundation */}
      {foundationScores.map((s, i) => {
        const p = pt(s, axes[i].angle);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#475569" />;
      })}

      {/* Legend */}
      <rect x={10} y={265} width={12} height={12} rx={3} fill="rgba(0,0,0,0.12)" stroke="#100F0F" strokeWidth="1.5" />
      <text x={27} y={275} fontSize={9.5} fill="#100F0F" fontFamily="Roboto Mono, monospace">Expert (avg ≥ 2.0)</text>
      <rect x={145} y={265} width={12} height={12} rx={3} fill="rgba(0,0,0,0.06)" stroke="#d1cfc4" strokeWidth="1.5" />
      <text x={162} y={275} fontSize={9.5} fill="#100F0F" fontFamily="Roboto Mono, monospace">Foundation (avg &lt; 1.0)</text>
    </svg>
  );
}

// ─── Tier Spectrum ────────────────────────────────────────────────────────────
function TierSpectrum() {
  const BAR_X = 30, BAR_Y = 44, BAR_H = 28, BAR_W = 480;
  const tiers = [
    { label: "Foundation", range: "< 1.0",     color: "#d1cfc4", w: BAR_W / 3 },
    { label: "Practitioner", range: "1.0 – 1.99", color: "#475569", w: BAR_W / 3 },
    { label: "Expert",      range: "≥ 2.0",    color: "#100F0F", w: BAR_W / 3 },
  ];

  return (
    <svg viewBox="0 0 540 110" className="w-full h-auto" aria-label="Tier spectrum">
      {/* Score axis */}
      <text x={BAR_X}             y={36} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="monospace">0.0</text>
      <text x={BAR_X + BAR_W / 3} y={36} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="monospace">1.0</text>
      <text x={BAR_X + BAR_W * 2/3} y={36} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="monospace">2.0</text>
      <text x={BAR_X + BAR_W}     y={36} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="monospace">3.0</text>

      {/* Tier segments */}
      {tiers.map((t, i) => {
        const x = BAR_X + i * (BAR_W / 3);
        const isFirst = i === 0, isLast = i === tiers.length - 1;
        return (
          <g key={t.label}>
            <rect x={x} y={BAR_Y} width={t.w} height={BAR_H}
              fill={t.color}
              rx={isFirst ? 6 : 0}
              style={isLast ? { borderRadius: "0 6px 6px 0" } : undefined}
            />
            {isLast && <rect x={x + t.w - 6} y={BAR_Y} width={6} height={BAR_H} rx={3} fill={t.color} />}
            <text x={x + t.w / 2} y={BAR_Y + BAR_H / 2 + 4}
              textAnchor="middle" fontSize={10} fontWeight="700"
              fill={i === 0 ? "#100F0F" : "white"}
              fontFamily="Roboto Mono, monospace">
              {t.label}
            </text>
          </g>
        );
      })}

      {/* Dividers */}
      <line x1={BAR_X + BAR_W / 3} y1={BAR_Y} x2={BAR_X + BAR_W / 3} y2={BAR_Y + BAR_H} stroke="white" strokeWidth="1.5" />
      <line x1={BAR_X + BAR_W * 2/3} y1={BAR_Y} x2={BAR_X + BAR_W * 2/3} y2={BAR_Y + BAR_H} stroke="white" strokeWidth="1.5" />

      {/* Range labels */}
      {tiers.map((t, i) => {
        const x = BAR_X + i * (BAR_W / 3) + (BAR_W / 3) / 2;
        return (
          <text key={`range-${i}`} x={x} y={BAR_Y + BAR_H + 16}
            textAnchor="middle" fontSize={8.5}
            fill="#64748B" fontFamily="monospace">
            avg score {t.range}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function FluencyLabPage() {

  const toolCategories = [
    {
      name: "Assessment",
      count: 5,
      tools: ["classify_export", "store_profile", "get_profile_history", "compare_profiles", "get_prompt_scores"],
    },
    {
      name: "Reports & Training",
      count: 4,
      tools: ["generate_report", "open_report", "generate_trainer", "generate_packet"],
    },
    {
      name: "Cohort Analytics",
      count: 3,
      tools: ["store_cohort", "add_profile_to_cohort", "get_cohort_report"],
    },
    {
      name: "Champion Enablement",
      count: 2,
      tools: ["store_champion_feedback", "get_content_health"],
    },
    {
      name: "Content Management",
      count: 2,
      tools: ["store_content_artifact", "list_stale_artifacts"],
    },
    {
      name: "Session Import",
      count: 2,
      tools: ["list_claude_sessions", "import_claude_session"],
    },
    {
      name: "Rubric",
      count: 3,
      tools: ["check_rubric_currency", "get_assessment_items", "update_calibration"],
    },
  ];

  const commands = [
    { cmd: "/classify",      desc: "Browse Claude Code sessions, pick one, score it, view the report" },
    { cmd: "/classify-web",  desc: "Paste a claude.ai export and classify it against the rubric" },
    { cmd: "/sessions",      desc: "Browse all Claude Code sessions organized by project" },
    { cmd: "/report",        desc: "Open a generated HTML report for any stored profile" },
    { cmd: "/progress",      desc: "Compare two most recent profiles and surface score deltas" },
    { cmd: "/trainer",       desc: "Generate an interactive Duolingo-style game from a profile" },
    { cmd: "/packet",        desc: "Generate a turnkey champion success packet for a learner" },
    { cmd: "/feedback",      desc: "Log champion observations after a coaching session" },
    { cmd: "/health",        desc: "Content health dashboard: what's fresh vs. stale" },
    { cmd: "/rubric",        desc: "Check rubric version and surface key changes" },
  ];

  const stack = [
    { layer: "Runtime",    tech: "Node.js + TypeScript",              note: "compiled via tsc" },
    { layer: "MCP",        tech: "@modelcontextprotocol/sdk",         note: "stdio transport" },
    { layer: "Database",   tech: "SQLite via better-sqlite3",         note: "WAL mode, FK constraints on" },
    { layer: "Reports",    tech: "Self-contained HTML + Chart.js",    note: "no external dependencies" },
    { layer: "Share Cards",tech: "html2canvas",                       note: "downloadable PNG" },
    { layer: "Validation", tech: "Zod schemas",                       note: "all tool inputs validated" },
    { layer: "HTTP",       tech: "localhost:3131",                     note: "serves generated HTML reports" },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Back */}
      <Link href="/#projects" className="text-sm text-neutral-900 hover:text-neutral-900 transition-colors mb-10 inline-block">
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {["TypeScript", "Node.js", "SQLite", "MCP", "API Design", "Claude Code"].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-900">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-3">4D AI Fluency Lab</h1>
        <p className="text-neutral-900 leading-relaxed">
          A local Model Context Protocol server that measures, tracks, and develops AI fluency through
          behavioral assessment of Claude conversations. Classifies prompts against a 4-dimensional rubric,
          generates HTML reports, trains learners with interactive exercises, and lets coaches run structured
          programs without leaving Claude Code.
        </p>
      </div>

      {/* What It Does */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">what it does</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Classify",          body: "Score any Claude conversation against the 4D rubric: every user prompt, all four dimensions, sub-behavior tags." },
            { title: "Report",            body: "Self-contained HTML reports with radar charts, score breakdowns, dimension insights, and shareable PNG cards." },
            { title: "Train",             body: "Duolingo-style trainer built from the learner's own classified conversations: XP, hearts, streaks." },
            { title: "Coach at Scale",    body: "Generate turnkey champion packets a coach can run without education team involvement." },
            { title: "Track Progress",    body: "Compare any two profiles, see score deltas per dimension, and visualize trends over time." },
            { title: "Cohort Analytics",  body: "Group reporting: tier distribution, weakest shared dimension, outlier detection across a team." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl p-4" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
              <p className="font-bold text-sm mb-1" style={{ color: "#100F0F" }}>{c.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">architecture</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <ArchitectureDiagram />
        </div>
      </section>
      <div className="mb-12 rounded-xl px-5 py-4 text-xs text-neutral-900 leading-relaxed" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
        <strong>rubric.md</strong> is the single source of truth, versioned in the database so every profile, artifact,
        and assessment item is permanently tagged with the rubric version it was scored against.
        Claude reads the rubric during <strong>classify-export</strong> and scores each prompt 0–3 per dimension.
        All results land in <strong>SQLite</strong>, then fan out to report generation, trainer construction,
        champion packets, and cohort analytics tools.
      </div>

      {/* The 4D Rubric */}
      <section className="mb-6">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">the 4d rubric</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-neutral-200 rounded-xl p-4 bg-white">
            <RadarChart />
          </div>
          <div className="flex flex-col gap-3">
            {[
              { d: "Delegation",   def: "What the user delegates vs. keeps, from handing off the full task to setting goals and constraints." },
              { d: "Description",  def: "How much the user specifies product, process, and performance constraints." },
              { d: "Discernment",  def: "Whether the user builds in evaluation structure: asks for alternatives, flags uncertainty." },
              { d: "Diligence",    def: "Responsibility signals: deployment context, privacy, ethics, accountability, transparency." },
            ].map((dim) => (
              <div key={dim.d} className="rounded-xl px-4 py-3" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
                <p className="font-bold text-sm mb-0.5" style={{ color: "#100F0F" }}>{dim.d}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{dim.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-12 text-xs text-neutral-900" style={{ color: "#64748B" }}>
        Based on Anthropic's AI Fluency Index (Feb 2026), measuring 11 observable behaviors across 9,830 real conversations.
        Rubric version: <span className="font-mono font-bold">1.1.0</span> (2026-02-26)
      </div>

      {/* Scoring & Tiers */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">scoring & tiers</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <TierSpectrum />
        </div>
      </section>
      <div className="mb-12 grid grid-cols-3 gap-3">
        {[
          { tier: "Foundation",   range: "avg < 1.0",   bg: "#f9f8f3", border: "#d1cfc4", text: "#100F0F", note: "Prompt-level thinking. Delegates tasks but provides minimal constraints or evaluation structure." },
          { tier: "Practitioner", range: "avg 1.0–1.99", bg: "#f2f0e5", border: "#475569", text: "#100F0F", note: "Growing fluency. Starting to specify outputs and occasionally ask for alternatives or flag uncertainty." },
          { tier: "Expert",       range: "avg ≥ 2.0",   bg: "#100F0F", border: "#100F0F", text: "white",   note: "Full fluency. Frames work as goals, specifies constraints, builds in accountability and evaluation." },
        ].map((t) => (
          <div key={t.tier} className="rounded-xl p-4" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
            <p className="font-bold text-sm mb-0.5" style={{ color: t.text }}>{t.tier}</p>
            <p className="text-xs font-mono mb-2" style={{ color: t.tier === "Expert" ? "rgba(255,255,255,0.7)" : "#64748B" }}>{t.range}</p>
            <p className="text-xs leading-relaxed" style={{ color: t.tier === "Expert" ? "rgba(255,255,255,0.8)" : "#64748B" }}>{t.note}</p>
          </div>
        ))}
      </div>

      {/* Tool Suite */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">
          tool suite <span className="font-mono text-neutral-900 normal-case tracking-normal ml-2">20+ MCP tools</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toolCategories.map((cat) => (
            <div key={cat.name} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ background: "#f9f8f3", borderColor: "#d1cfc4" }}>
                <p className="text-sm font-bold" style={{ color: "#100F0F" }}>{cat.name}</p>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full font-bold" style={{ background: "#100F0F", color: "white" }}>
                  {cat.count}
                </span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5 bg-white">
                {cat.tools.map((tool) => (
                  <span key={tool} className="text-xs font-mono px-2 py-1 rounded-md" style={{ background: "#f2f0e5", color: "#100F0F" }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Slash Commands */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">slash commands</h2>
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          {commands.map((c, i) => (
            <div
              key={c.cmd}
              className={`flex items-start gap-4 px-4 py-3 ${i < commands.length - 1 ? "border-b border-neutral-100" : ""}`}
            >
              <span
                className="text-xs font-mono font-bold shrink-0 px-2 py-1 rounded-md mt-0.5"
                style={{ background: "#100F0F", color: "white", minWidth: "110px", textAlign: "center" }}
              >
                {c.cmd}
              </span>
              <p className="text-sm text-neutral-900 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Report Outputs */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">generated outputs</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Full HTML Report",
              file: "report-{id}.html",
              items: ["Radar chart across all 4 dimensions", "Score bar per dimension (0–3 scale)", "Diligence signal breakdown", "Insights panel with course links", "Monthly prompt volume + score trend chart"],
            },
            {
              title: "Shareable Card",
              file: "share-{id}.html",
              items: ["Dark theme, 600px wide", "Downloadable as PNG via html2canvas", "Overall score /3.0", "Dimension bars + radar", "Monthly trend visualization"],
            },
            {
              title: "Trainer Game",
              file: "trainer-{id}.html",
              items: ["XP system: Foundation → Practitioner → Expert", "3 hearts per session, streak tracking", "Mastery: prompts retire after 3 correct", "Round types: spot_upgrade, what_changed, tag_dimensions"],
            },
            {
              title: "Champion Packet",
              file: "packet-{id}.html",
              items: ["Dual-tab: Champion Guide + Learner Deep Dive", "Pre-scored conversation examples", "Coaching frameworks per dimension", "Turnkey, no education team needed"],
            },
          ].map((out) => (
            <div key={out.title} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b" style={{ background: "#f9f8f3", borderColor: "#d1cfc4" }}>
                <p className="text-sm font-bold" style={{ color: "#100F0F" }}>{out.title}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#64748B" }}>{out.file}</p>
              </div>
              <ul className="px-4 py-3 flex flex-col gap-1.5 bg-white">
                {out.items.map((item) => (
                  <li key={item} className="flex gap-2 text-xs text-neutral-900">
                    <span style={{ color: "#d1cfc4" }} className="shrink-0 mt-0.5">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Output Samples */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">output samples</h2>
        <div className="flex flex-col gap-6">

          {/* Screenshot 1 */}
          <div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #d1cfc4" }}>
              <img
                src="/images/mcp-report-scores.png"
                alt="AI Fluency Assessment report showing dimension scores and overall score"
                className="w-full block"
              />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#64748B" }}>
              generated HTML report: dimension score bars (Delegation, Description, Discernment, Diligence), overall score out of 3.0, and strongest / focus area cards
            </p>
          </div>

          {/* Screenshot 2 */}
          <div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #d1cfc4" }}>
              <img
                src="/images/mcp-report-trend.png"
                alt="Score trend chart and annotated strong prompt examples"
                className="w-full block"
              />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#64748B" }}>
              monthly score trend line and annotated prompt examples. strong prompts are highlighted by behavior tag showing exactly which signals drove the score
            </p>
          </div>

          {/* Screenshot 3 */}
          <div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #d1cfc4" }}>
              <img
                src="/images/mcp-report-prompts.png"
                alt="Prompts to strengthen section with before and after rewrites"
                className="w-full block"
              />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#64748B" }}>
              prompts to strengthen: each weak prompt is annotated with what's missing, paired with a strengthened rewrite that adds delegation structure, output constraints, and diligence signals
            </p>
          </div>

          {/* Demo video */}
          <div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #d1cfc4", background: "#0d1117" }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#161b22", borderBottom: "1px solid #d1cfc420" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <span className="text-xs font-mono ml-2" style={{ color: "#64748B" }}>claude code · /classify</span>
              </div>
              <video
                src="/videos/mcp-demo.mov"
                autoPlay
                loop
                muted
                playsInline
                className="w-full block"
                style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#64748B" }}>
              end-to-end run inside Claude Code: session selection, rubric scoring, and HTML report generation all from a single /classify command
            </p>
          </div>

        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">tech stack</h2>
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "#f9f8f3", borderBottom: "1px solid #d1cfc4" }}>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-neutral-800 whitespace-nowrap w-28">Layer</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-neutral-800">Technology</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-neutral-800">Note</th>
              </tr>
            </thead>
            <tbody>
              {stack.map((row, i) => (
                <tr key={row.layer} className={`border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? "bg-white" : ""}`} style={i % 2 !== 0 ? { background: "#fafbff" } : {}}>
                  <td className="px-4 py-2.5 text-xs font-bold text-neutral-900 whitespace-nowrap">{row.layer}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-neutral-900 whitespace-nowrap">{row.tech}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-900">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Database */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">database schema</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "profiles", "prompt_scores", "dimension_distributions",
            "rubric_versions", "assessment_items", "cohorts",
            "cohort_members", "champion_feedback", "content_artifacts", "user_calibrations",
          ].map((table) => (
            <span key={table} className="text-xs font-mono px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "#f2f0e5", color: "#100F0F", border: "1px solid #d1cfc4" }}>
              {table}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: "#64748B" }}>
          All multi-table inserts use transactions. WAL mode enabled. Every profile, artifact, and
          assessment item is permanently tagged with the rubric version it was scored against.
        </p>
      </section>

    </main>
  );
}
