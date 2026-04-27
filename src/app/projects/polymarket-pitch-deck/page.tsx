import Link from "next/link";

export const metadata = {
  title: "Polymarket Market Operations Pitch",
  description:
    "Dispute analysis pipeline across 906 markets, three launch-ready market proposals, and a 23-creator golf vertical pitch with Parti.com distribution alignment.",
};

// ─── Palette (matches site-wide theme) ───────────────────────────────────────
// dark: #100F0F  mid: #475569  light: #d1cfc4  bg: #f9f8f3  ultra: #f2f0e5

// ─── Pipeline Diagram ────────────────────────────────────────────────────────
function PipelineDiagram() {
  const W = 860, H = 200;

  type NodeStyle = "source" | "process" | "storage" | "output";
  const nodes: { label: string; sub?: string; x: number; y: number; w: number; h: number; style: NodeStyle }[] = [
    { label: "gamma api",            sub: "polymarket",                x: 10,  y: 76, w: 118, h: 48, style: "source"  },
    { label: "906 disputed",         sub: "markets pulled",            x: 172, y: 76, w: 118, h: 48, style: "process" },
    { label: "python pipeline",      sub: "fetch · classify · analyze",x: 334, y: 76, w: 130, h: 48, style: "process" },
    { label: "pattern library",      sub: "by dispute reason",         x: 514, y: 76, w: 118, h: 48, style: "storage" },
    { label: "market proposals",     sub: "3 ready to launch",         x: 700, y: 20, w: 148, h: 38, style: "output"  },
    { label: "risk checklist",       sub: "pre-submission",            x: 700, y: 70, w: 148, h: 38, style: "output"  },
    { label: "draft_ruleset.py",     sub: "interactive tool",          x: 700, y: 120, w: 148, h: 38, style: "output" },
  ];

  const colors: Record<NodeStyle, { bg: string; border: string; text: string; sub: string }> = {
    source:  { bg: "#f9f8f3", border: "#d1cfc4", text: "#100F0F", sub: "#64748B" },
    process: { bg: "#f2f0e5", border: "#475569", text: "#100F0F", sub: "#64748B" },
    storage: { bg: "#100F0F", border: "#100F0F", text: "white",   sub: "rgba(255,255,255,0.6)" },
    output:  { bg: "#f9f8f3", border: "#d1cfc4", text: "#100F0F", sub: "#64748B" },
  };

  const cx = (n: typeof nodes[number]) => n.x + n.w / 2;
  const cy = (n: typeof nodes[number]) => n.y + n.h / 2;
  const get = (i: number) => nodes[i];

  const pipes: [number, number][] = [[0,1],[1,2],[2,3]];
  const fanTargets = [4, 5, 6];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: 0 }} aria-label="Dispute analysis pipeline">
      <defs>
        <marker id="pmArrowBlue" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#475569" />
        </marker>
        <marker id="pmArrowLight" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#d1cfc4" />
        </marker>
      </defs>

      <text x={69}  y={14} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">INPUT</text>
      <text x={231} y={14} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">PULL</text>
      <text x={399} y={14} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">PROCESS</text>
      <text x={573} y={14} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">STORAGE</text>
      <text x={774} y={14} textAnchor="middle" fontSize={8} fill="#94A3B8" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">OUTPUTS</text>

      {pipes.map(([a, b]) => {
        const na = get(a), nb = get(b);
        return (
          <line key={`${a}-${b}`}
            x1={na.x + na.w} y1={cy(na)}
            x2={nb.x - 4}    y2={cy(nb)}
            stroke="#475569" strokeWidth="1.5"
            markerEnd="url(#pmArrowBlue)"
          />
        );
      })}

      {fanTargets.map((ti) => {
        const src = get(3), tgt = get(ti);
        const x1 = src.x + src.w, y1 = cy(src);
        const x2 = tgt.x - 4,    y2 = cy(tgt);
        const mx = (x1 + x2) / 2;
        return (
          <path key={ti}
            d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none" stroke="#d1cfc4" strokeWidth="1.2"
            markerEnd="url(#pmArrowLight)"
          />
        );
      })}

      {nodes.map((n, i) => {
        const c = colors[n.style];
        return (
          <g key={i}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8}
              fill={c.bg} stroke={c.border}
              strokeWidth={n.style === "storage" ? 0 : 1.5} />
            <text x={cx(n)} y={n.sub ? cy(n) - 6 : cy(n) + 4}
              textAnchor="middle" fontSize={10} fontWeight="700"
              fill={c.text} fontFamily="Roboto Mono, monospace">
              {n.label}
            </text>
            {n.sub && (
              <text x={cx(n)} y={cy(n) + 10}
                textAnchor="middle" fontSize={7.5}
                fill={c.sub} fontFamily="Roboto Mono, monospace">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Dispute Breakdown Bar ────────────────────────────────────────────────────
function DisputeBar() {
  const BAR_X = 0, BAR_Y = 0, BAR_H = 36, BAR_W = 540;

  const segments = [
    { label: "ambiguous rules", short: "63%", pct: 63, bg: "#100F0F", text: "white"    },
    { label: "too early",       short: "19%", pct: 19, bg: "#475569", text: "white"    },
    { label: "wrong source",    short: "11%", pct: 11, bg: "#94a3b8", text: "#100F0F"  },
    { label: "factual error",   short: "7%",  pct:  7, bg: "#d1cfc4", text: "#100F0F"  },
  ];

  let offsetX = BAR_X;
  return (
    <div>
      <svg viewBox={`0 0 ${BAR_W} ${BAR_H}`} className="w-full h-auto" aria-label="Dispute reason breakdown">
        {segments.map((s, i) => {
          const w = (s.pct / 100) * BAR_W;
          const x = offsetX;
          offsetX += w;
          const isFirst = i === 0, isLast = i === segments.length - 1;
          return (
            <g key={s.label}>
              <rect x={x} y={BAR_Y} width={w} height={BAR_H}
                fill={s.bg}
                rx={isFirst ? 6 : 0}
              />
              {isFirst && <rect x={x + w - 6} y={BAR_Y} width={6} height={BAR_H} fill={s.bg} />}
              {isLast && <rect x={x} y={BAR_Y} width={6} height={BAR_H} fill={s.bg} />}
              <text x={x + w / 2} y={BAR_Y + BAR_H / 2 + 4}
                textAnchor="middle" fontSize={w > 60 ? 9.5 : 7.5} fontWeight="700"
                fill={s.text} fontFamily="Roboto Mono, monospace">
                {s.short}
              </text>
            </g>
          );
        })}
        {[63, 82, 93].map((pct) => {
          const x = BAR_X + (pct / 100) * BAR_W;
          return <line key={pct} x1={x} y1={BAR_Y} x2={x} y2={BAR_Y + BAR_H} stroke="white" strokeWidth="1" />;
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.bg, border: s.bg === "#d1cfc4" ? "1px solid #b0ada3" : "none" }} />
            <span className="text-xs font-mono" style={{ color: "#64748B" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PolymarketPage() {

  const markets = [
    {
      icon: "📺",
      title: "Internet Invitational 2026",
      sub: "Creator Golf · Content Milestone",
      body: "Will the Internet Invitational 2026 generate 30M+ combined YouTube views within 30 days of the final episode's release? Baseline: 27M+ in 2025. Dispute risk: low across all four categories.",
      risk: "ambiguous-rules: low",
    },
    {
      icon: "⛳",
      title: "Grant Horvat PGA Tour 2026",
      sub: "Sports · Culture Crossover",
      body: "Will Grant Horvat compete in at least one official PGA Tour or DP World Tour stroke-play event before January 1, 2027? He declined two Tour exemptions in 2025 citing media rights. Genuinely uncertain. 3.4M invested followers.",
      risk: "all dispute categories: low",
    },
    {
      icon: "⚖️",
      title: "CFTC Guidance 2026",
      sub: "Regulatory · Policy",
      body: "Will the CFTC publish formal guidance specifically addressing retail prediction market platforms before January 1, 2027? Polymarket's own traders have direct skin in this outcome.",
      risk: "ambiguous-rules: medium",
    },
  ];

  const tiers = [
    { tier: "Tier 1", range: "1M+ reach", creators: "Good Good, Bob Does Sports, Bryson DeChambeau, Rick Shiels, Grant Horvat, Full Send (NELK)" },
    { tier: "Tier 2", range: "200K–1M",   creators: "ForePlay, Bryan Bros, Peter Finch, Micah Morris, Luke Kwon, Golf Girl Games, Taco, Kyle Berkshire, Martin Borgmeier" },
    { tier: "Tier 3", range: "Rising",     creators: "Good Good Pros, Good Good Girls, The Lads, Josh Kelly, BustaJack, Sam Heung-Min, Tooms, Ben Kruper" },
  ];

  const partiRows = [
    { feature: "Streamers pin markets above live chat", fit: "Creator tournaments (Internet Invitational, Creator Classic) stream live to hundreds of thousands. Markets are directly relevant to what is on screen" },
    { feature: "Earn Program: creators share trading fees", fit: "Tier 1 creators (Horvat, Full Send, Bryson, Rick Shiels) have direct financial incentive to pin and promote their own markets" },
    { feature: "Boutique Culture Markets", fit: "All three market proposals fit this category: creator-ecosystem events, not traditional sports or politics" },
    { feature: "Audience already engaged in live discussion", fit: "Golf creator fans debate outcomes in real time. ForePlay discusses sports odds every episode. DraftKings overlap is high. Friction to trade on Polymarket is near zero" },
  ];

  const audits = [
    {
      n: "01",
      type: "ambiguous threshold",
      category: "ambiguous-rules",
      original: "Will inflation return to the Fed's 2% target before January 1, 2025?",
      problem: '"Return to the 2% target" was never defined. Headline CPI? PCE? One month or a trailing average? The market resolved NO but traders who saw a single month near 2% argued YES. No specific measure or duration threshold meant any reading near 2% was disputable.',
      fixed: "Resolves YES if the US Bureau of Labor Statistics reports a 12-month headline CPI change of 2.0% or lower in any monthly release published before January 1, 2025, as shown on bls.gov/cpi. A single qualifying monthly release is sufficient. PCE, core CPI, and trimmed-mean measures do not count.",
      changed: "Single authoritative source named. Exact measure specified. Duration defined. Threshold is a hard number.",
    },
    {
      n: "02",
      type: "undefined source",
      category: "wrong-source",
      original: "Will Elon Musk announce he is leaving Tesla before July 1, 2025?",
      problem: 'The market resolved NO. One trader argued a post on X saying "stepping back from day-to-day" counted. Another argued only an SEC 8-K filing qualified. Three plausible readings of the same facts, zero guidance in the resolution criteria.',
      fixed: "Resolves YES if Musk formally announces departure from the CEO role via: (1) an SEC Form 8-K on sec.gov, (2) a Tesla IR press release on ir.tesla.com, or (3) a post on @elonmusk using the words resign, stepping down, or leaving Tesla in the context of his CEO role. Social posts not using one of those exact phrases do not qualify. Media reports do not qualify.",
      changed: "Three qualifying sources enumerated. Exact language required for social media. Third-party reports explicitly excluded.",
    },
    {
      n: "03",
      type: "premature resolution",
      category: "too-early",
      original: "Will the Kansas City Chiefs win Super Bowl LIX? Resolution date: February 9, 2025.",
      problem: "Super Bowl LIX was played on February 9. The resolution bot triggered at 11:59 PM ET while the game was still in overtime in some time zones and before the official final score was confirmed in the NFL results system.",
      fixed: "Resolves YES if the Kansas City Chiefs are declared the winner of Super Bowl LIX by the NFL. Resolution is based on the final score as posted on nfl.com/super-bowl following the conclusion of all regulation and overtime play. This market will not resolve until the final score is officially confirmed on nfl.com, regardless of game clock.",
      changed: "Resolution tied to official source confirmation, not a calendar timestamp. Explicit clause prevents early trigger. Postponement handled with N/A condition.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      <Link href="/" className="text-sm text-neutral-900 transition-colors mb-10 inline-block">
        ← back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {["Python", "Claude API", "Gamma API", "Market Design", "Data Pipeline", "Notion"].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-900">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-3">Polymarket Market Operations Pitch</h1>
        <p className="text-neutral-900 leading-relaxed">
          Built independently as research for Polymarket&apos;s Market Operations Analyst role.
          A dispute analysis pipeline across 906 disputed markets, three launch-ready market proposals,
          and a 23-creator golf vertical pitch with direct alignment to Polymarket&apos;s Parti.com livestreaming partnership.
        </p>
      </div>

      {/* Pipeline */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">dispute analysis pipeline</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <PipelineDiagram />
        </div>
      </section>
      <div className="mb-12 rounded-xl px-5 py-4 text-xs text-neutral-900 leading-relaxed" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
        <code className="font-bold">fetch_disputes.py</code> pulls all 906 disputed markets from the Polymarket Gamma API.{" "}
        <code className="font-bold">classify_disputes.py</code> sends each dispute to Claude and classifies it by reason.{" "}
        <code className="font-bold">analyze_rules.py</code> extracts language patterns by category.{" "}
        The output is a pattern library and a <code className="font-bold">draft_ruleset.py</code> tool: describe a market idea, get a dispute-proof ruleset draft.
      </div>

      {/* Dispute Breakdown */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">906 disputes by reason</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <DisputeBar />
        </div>
      </section>
      <div className="mb-12 border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "#f9f8f3", borderBottom: "1px solid #d1cfc4" }}>
              <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800">Reason</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800">Count</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800">%</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800">Key Pattern</th>
            </tr>
          </thead>
          <tbody>
            {[
              { r: "ambiguous-rules", n: 571, p: "63%", k: '"any", "consensus", vague thresholds, undefined terms' },
              { r: "too-early",       n: 171, p: "19%", k: "Resolution before the event could definitively conclude" },
              { r: "wrong-source",    n: 103, p: "11%", k: "Source inaccessible, wrong, or too vague" },
              { r: "factual-error",   n:  60, p: "7%",  k: "Bad premise baked into the question itself" },
            ].map((row, i) => (
              <tr key={row.r} className="border-b border-neutral-100 last:border-0" style={i % 2 !== 0 ? { background: "#fafafa" } : {}}>
                <td className="px-4 py-2.5 text-xs font-mono font-bold text-neutral-900">{row.r}</td>
                <td className="px-4 py-2.5 text-xs text-neutral-900">{row.n}</td>
                <td className="px-4 py-2.5 text-xs font-bold text-neutral-900">{row.p}</td>
                <td className="px-4 py-2.5 text-xs text-neutral-900">{row.k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Proposals */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">
          market proposals <span className="font-mono text-neutral-900 normal-case tracking-normal ml-2">3 ready to launch</span>
        </h2>
        <div className="flex flex-col gap-4">
          {markets.map((m) => (
            <div key={m.title} className="rounded-xl overflow-hidden" style={{ border: "1px solid #d1cfc4" }}>
              <div className="px-4 py-3 border-b flex items-start justify-between gap-4" style={{ background: "#f9f8f3", borderColor: "#d1cfc4" }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#100F0F" }}>{m.icon} {m.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{m.sub}</p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded shrink-0 mt-0.5" style={{ background: "#f2f0e5", color: "#100F0F", border: "1px solid #d1cfc4" }}>
                  {m.risk}
                </span>
              </div>
              <div className="px-4 py-3 bg-white">
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{m.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: "#64748B" }}>
          Every resolution criterion is written directly against the failure modes above.
          Qualifying conditions are enumerated, exclusions are listed, and a single authoritative source is named with a backup fallback.
        </p>
      </section>

      {/* Golf Creator Vertical */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">
          golf creator vertical <span className="font-mono text-neutral-900 normal-case tracking-normal ml-2">23 creators · 25M+ reach</span>
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748B" }}>
          The golf creator audience skews young, male, and already bets. ForePlay discusses sports odds every episode.
          The Internet Invitational drew 200K+ live viewers and $1M in prizes. The PGA Tour Creator Classic is now a sanctioned event.
          Zero current Polymarket coverage.
        </p>
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          {tiers.map((t, i) => (
            <div key={t.tier} className={`flex gap-4 px-4 py-3 ${i < tiers.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div className="shrink-0">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: i === 0 ? "#100F0F" : i === 1 ? "#f2f0e5" : "#f9f8f3", color: i === 0 ? "white" : "#100F0F", border: i === 0 ? "none" : "1px solid #d1cfc4" }}>
                  {t.tier}
                </span>
                <p className="text-xs mt-1 text-center" style={{ color: "#94a3b8" }}>{t.range}</p>
              </div>
              <p className="text-xs leading-relaxed pt-1" style={{ color: "#64748B" }}>{t.creators}</p>
            </div>
          ))}
        </div>
      </section>
      <p className="text-xs mb-12 leading-relaxed" style={{ color: "#94a3b8" }}>
        Each creator profile includes verified follower counts, market ideas, and dispute risk notes.
      </p>

      {/* Parti.com Alignment */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">parti.com partnership alignment</h2>
        <div className="rounded-xl px-5 py-4 text-xs leading-relaxed mb-4" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
          On March 27, 2026, Polymarket and Parti.com launched the first-ever livestreaming prediction marketplace.
          Streamers pin live markets above chat. Audiences trade without leaving the stream.
          Creators earn a share of trading fees. Polymarket and Parti will co-build &quot;Boutique Culture Markets&quot;:
          prediction markets tied to viral, culturally relevant moments from the livestreaming ecosystem.
          The golf creator vertical fits every feature of this partnership.
        </div>
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "#f9f8f3", borderBottom: "1px solid #d1cfc4" }}>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800 w-2/5">Parti Feature</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-800">Golf Creator Fit</th>
              </tr>
            </thead>
            <tbody>
              {partiRows.map((row, i) => (
                <tr key={i} className="border-b border-neutral-100 last:border-0" style={i % 2 !== 0 ? { background: "#fafafa" } : {}}>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-900 align-top">{row.feature}</td>
                  <td className="px-4 py-3 text-xs text-neutral-900 leading-relaxed">{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="text-xs mb-12 leading-relaxed" style={{ color: "#94a3b8" }}>
        This research predates the Parti announcement. The partnership confirmed the thesis, it did not inspire it.
      </p>

      {/* Ruleset Audit */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">ruleset audit</h2>
        <div className="flex flex-col gap-6">
          {audits.map((a) => (
            <div key={a.n} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: "#f9f8f3", borderColor: "#d1cfc4" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: "#100F0F", color: "white" }}>{a.n}</span>
                  <p className="text-sm font-bold" style={{ color: "#100F0F" }}>{a.type}</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#f2f0e5", color: "#64748B", border: "1px solid #d1cfc4" }}>{a.category}</span>
              </div>
              <div className="divide-y divide-neutral-100">
                <div className="px-4 py-3 bg-white">
                  <p className="text-xs font-bold mb-1" style={{ color: "#94a3b8" }}>original</p>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: "#100F0F" }}>{a.original}</p>
                </div>
                <div className="px-4 py-3" style={{ background: "#fafafa" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#94a3b8" }}>why it generated a dispute</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{a.problem}</p>
                </div>
                <div className="px-4 py-3 bg-white">
                  <p className="text-xs font-bold mb-1" style={{ color: "#94a3b8" }}>fixed ruleset</p>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: "#100F0F" }}>{a.fixed}</p>
                </div>
                <div className="px-4 py-3" style={{ background: "#f9f8f3" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#94a3b8" }}>what changed</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{a.changed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">github</h2>
        <div className="rounded-xl px-5 py-4 flex items-center justify-between" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
          <div>
            <p className="text-sm font-bold" style={{ color: "#100F0F" }}>chapmansgit/PolyMarket</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>fetch_disputes.py · classify_disputes.py · analyze_rules.py · draft_ruleset.py · inspect_uma.py</p>
          </div>
          <a
            href="https://github.com/chapmansgit/PolyMarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded-lg font-bold shrink-0 ml-4"
            style={{ background: "#100F0F", color: "white" }}
          >
            view repo →
          </a>
        </div>
      </section>

    </main>
  );
}
