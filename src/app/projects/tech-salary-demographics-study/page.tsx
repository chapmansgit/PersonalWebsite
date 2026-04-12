import Link from "next/link";

export const metadata = {
  title: "Tech Industry Salary Demographics Study",
  description:
    "Statistical analysis of compensation trends across 62,642 tech employees using regression and correlation.",
};

// ─── Palette ─────────────────────────────────────────────────────────────────
// Soft slate blue pastels
// primary: #475569  |  light: #d1cfc4  |  bg tint: #f9f8f3
// dark: #100F0F  |  medium: #64748B  |  ultra-light: #f2f0e5

// ─── Missing Values Chart ────────────────────────────────────────────────────
function MissingValuesChart() {
  const total = 62642;
  const vars = [
    { label: "Race",      missing: 40215 },
    { label: "Education", missing: 32272 },
    { label: "Gender",    missing: 19540 },
  ];
  const maxW = 340;
  const barH = 22;
  const rowH = 44;

  return (
    <svg viewBox="0 0 540 162" className="w-full h-auto" aria-label="Missing values by variable">
      {/* Column headers */}
      <text x="148" y="13" fontSize={8.5} fill="#64748B" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">
        MISSING
      </text>
      <text x="500" y="13" textAnchor="end" fontSize={8.5} fill="#64748B" fontFamily="Roboto Mono, monospace" fontWeight="700" letterSpacing="0.08em">
        COUNT
      </text>

      {vars.map((v, i) => {
        const pct = v.missing / total;
        const barW = pct * maxW;
        const ry = 22 + i * rowH;
        const pctLabel = (pct * 100).toFixed(1) + "%";
        const textY = ry + barH / 2 + 4.5;

        return (
          <g key={v.label}>
            {/* Row label */}
            <text
              x="140"
              y={ry + barH / 2 + 4.5}
              textAnchor="end"
              fontSize={11}
              fill="#100F0F"
              fontFamily="Roboto Mono, monospace"
              fontWeight="600"
            >
              {v.label}
            </text>
            {/* Track */}
            <rect x="148" y={ry} width={maxW} height={barH} rx={5} fill="#DCE5F4" />
            {/* Bar */}
            <rect x="148" y={ry} width={barW} height={barH} rx={5} fill="#475569" />
            {/* Pct */}
            {barW > 52 ? (
              <text x={148 + barW - 8} y={textY} textAnchor="end" fontSize={9.5} fill="white" fontFamily="monospace" fontWeight="700">
                {pctLabel}
              </text>
            ) : (
              <text x={148 + barW + 7} y={textY} textAnchor="start" fontSize={9.5} fill="#475569" fontFamily="monospace" fontWeight="700">
                {pctLabel}
              </text>
            )}
            {/* Count */}
            <text x="500" y={textY} textAnchor="end" fontSize={9.5} fill="#64748B" fontFamily="monospace">
              {v.missing.toLocaleString()}
            </text>
          </g>
        );
      })}

      {/* Footer note */}
      <text x="500" y="155" textAnchor="end" fontSize={8.5} fill="#94A3B8" fontFamily="Roboto Mono, monospace">
        n = {total.toLocaleString()} total records
      </text>
    </svg>
  );
}

// ─── Correlation Heatmap ─────────────────────────────────────────────────────
function CorrelationHeatmap() {
  const labels = ["Compensation", "Yrs Experience", "Yrs at Company"];
  const matrix = [
    [1.00, 0.37, 0.11],
    [0.37, 1.00, 0.44],
    [0.11, 0.44, 1.00],
  ];

  const CELL_W = 96;
  const CELL_H = 82;
  const LABEL_W = 130;
  const HEADER_H = 52;
  const SVG_W = LABEL_W + 3 * CELL_W + 10;
  const SVG_H = HEADER_H + 3 * CELL_H + 32;

  // #f9f8f3 (near-white blue) → #100F0F (deep indigo)
  // r: 242→40  g: 245→62  b: 251→138
  function cellColor(v: number) {
    const r = Math.round(242 - 202 * v);
    const g = Math.round(245 - 183 * v);
    const b = Math.round(251 - 113 * v);
    return `rgb(${r},${g},${b})`;
  }

  function textColor(v: number) {
    return v >= 0.70 ? "white" : "#100F0F";
  }

  function subLabel(v: number) {
    if (v === 1.00) return "self";
    if (v >= 0.3)   return "moderate";
    return "weak";
  }

  function subColor(v: number) {
    if (v >= 0.70) return "rgba(255,255,255,0.55)";
    return "#64748B";
  }

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" aria-label="Correlation matrix heatmap">

      {/* Column header labels */}
      {labels.map((label, j) => {
        const cx = LABEL_W + j * CELL_W + CELL_W / 2;
        return (
          <text
            key={`col-${j}`}
            x={cx}
            y={HEADER_H - 8}
            textAnchor="middle"
            fontSize={9.5}
            fill="#100F0F"
            fontFamily="Roboto Mono, monospace"
            fontWeight="700"
          >
            {label}
          </text>
        );
      })}

      {/* Cells */}
      {matrix.map((row, i) =>
        row.map((val, j) => {
          const cx = LABEL_W + j * CELL_W;
          const cy = HEADER_H + i * CELL_H;
          const midX = cx + CELL_W / 2;
          const midY = cy + CELL_H / 2;
          return (
            <g key={`cell-${i}-${j}`}>
              <rect
                x={cx} y={cy}
                width={CELL_W} height={CELL_H}
                fill={cellColor(val)}
                stroke="white"
                strokeWidth={3}
              />
              <text
                x={midX}
                y={midY - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={22}
                fontWeight="700"
                fill={textColor(val)}
                fontFamily="monospace"
              >
                {val.toFixed(2)}
              </text>
              <text
                x={midX}
                y={midY + 19}
                textAnchor="middle"
                fontSize={8.5}
                fill={subColor(val)}
                fontFamily="Roboto Mono, monospace"
                letterSpacing="0.03em"
              >
                {subLabel(val).toUpperCase()}
              </text>
            </g>
          );
        })
      )}

      {/* Row labels */}
      {labels.map((label, i) => {
        const cy = HEADER_H + i * CELL_H + CELL_H / 2;
        return (
          <text
            key={`row-${i}`}
            x={LABEL_W - 12}
            y={cy + 4}
            textAnchor="end"
            fontSize={9.5}
            fill="#100F0F"
            fontFamily="Roboto Mono, monospace"
            fontWeight="700"
          >
            {label}
          </text>
        );
      })}

      {/* Color scale */}
      <defs>
        <linearGradient id="corrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f9f8f3" />
          <stop offset="100%" stopColor="#100F0F" />
        </linearGradient>
      </defs>
      <rect x={LABEL_W} y={SVG_H - 18} width={3 * CELL_W} height={7} rx={3} fill="url(#corrGrad)" />
      <text x={LABEL_W}              y={SVG_H - 22} fontSize={8} fill="#64748B" fontFamily="Roboto Mono, monospace">0.0, no correlation</text>
      <text x={LABEL_W + 3 * CELL_W} y={SVG_H - 22} textAnchor="end" fontSize={8} fill="#64748B" fontFamily="Roboto Mono, monospace">1.0, perfect</text>
    </svg>
  );
}

// ─── Box Plots ───────────────────────────────────────────────────────────────
function BoxPlots() {
  const PLOT_TOP    = 28;
  const PLOT_BOTTOM = 190;
  const H           = PLOT_BOTTOM - PLOT_TOP; // 162
  const BW          = 26; // box half-width
  const TICK_LEN    = 28; // half-length of tick lines

  type PlotDef = {
    label: string;
    unit: string;
    max: number;
    cx: number;
    whiskerLo: number;
    q1: number;
    median: number;
    q3: number;
    whiskerHi: number;
    outliers: number[];
    ticks: number[];
    compNote?: boolean;
  };

  const plots: PlotDef[] = [
    {
      label: "Yrs at Company", unit: "yrs", max: 44,
      cx: 100,
      whiskerLo: 0, q1: 1, median: 2, q3: 8, whiskerHi: 20,
      outliers: [28, 33, 38, 41],
      ticks: [0, 10, 20, 30, 40],
    },
    {
      label: "Yrs of Experience", unit: "yrs", max: 46,
      cx: 310,
      whiskerLo: 0, q1: 2, median: 5, q3: 9, whiskerHi: 20,
      outliers: [28, 34, 40, 44],
      ticks: [0, 10, 20, 30, 40],
    },
    {
      label: "Compensation", unit: "$K", max: 500,
      cx: 520,
      whiskerLo: 50, q1: 130, median: 180, q3: 250, whiskerHi: 400,
      outliers: [],
      ticks: [0, 100, 200, 300, 400],
      compNote: true,
    },
  ];

  return (
    <svg viewBox="0 0 630 248" className="w-full h-auto" aria-label="Box plots for key variables">
      {plots.map((p) => {
        const scale = (v: number) => PLOT_BOTTOM - (v / p.max) * H;
        const wLo  = scale(p.whiskerLo);
        const q1y  = scale(p.q1);
        const medy = scale(p.median);
        const q3y  = scale(p.q3);
        const wHi  = scale(p.whiskerHi);

        return (
          <g key={p.label}>
            {/* Subtle grid + tick labels */}
            {p.ticks.map((t) => {
              const ty = scale(t);
              const tickLabel = p.unit === "$K" ? `${t}K` : `${t}`;
              return (
                <g key={t}>
                  <line
                    x1={p.cx - TICK_LEN} y1={ty}
                    x2={p.cx + TICK_LEN} y2={ty}
                    stroke="#DCE5F4" strokeWidth="1"
                  />
                  <text
                    x={p.cx - TICK_LEN - 5}
                    y={ty + 3.5}
                    textAnchor="end"
                    fontSize={8}
                    fill="#94A3B8"
                    fontFamily="monospace"
                  >
                    {tickLabel}
                  </text>
                </g>
              );
            })}

            {/* Center axis */}
            <line
              x1={p.cx} y1={PLOT_TOP}
              x2={p.cx} y2={PLOT_BOTTOM}
              stroke="#f2f0e5" strokeWidth="1"
            />

            {/* Dashed whiskers */}
            <line x1={p.cx} y1={wHi} x2={p.cx} y2={q3y} stroke="#d1cfc4" strokeWidth="1.5" strokeDasharray="3 2.5" />
            <line x1={p.cx} y1={q1y} x2={p.cx} y2={wLo} stroke="#d1cfc4" strokeWidth="1.5" strokeDasharray="3 2.5" />

            {/* Whisker caps */}
            <line x1={p.cx - BW * 0.45} y1={wHi} x2={p.cx + BW * 0.45} y2={wHi} stroke="#475569" strokeWidth="1.5" />
            <line x1={p.cx - BW * 0.45} y1={wLo} x2={p.cx + BW * 0.45} y2={wLo} stroke="#475569" strokeWidth="1.5" />

            {/* IQR box */}
            <rect
              x={p.cx - BW} y={q3y}
              width={BW * 2} height={q1y - q3y}
              fill="#f9f8f3"
              stroke="#475569"
              strokeWidth={2}
              rx={3}
            />

            {/* Median line */}
            <line
              x1={p.cx - BW} y1={medy}
              x2={p.cx + BW} y2={medy}
              stroke="#100F0F" strokeWidth={2.5}
            />

            {/* Outlier dots */}
            {p.outliers.map((o, idx) => (
              <circle
                key={idx}
                cx={p.cx} cy={scale(o)}
                r={3.5}
                fill="none"
                stroke="#475569"
                strokeWidth={1.5}
              />
            ))}

            {/* Compensation outlier note */}
            {p.compNote && (
              <g>
                <circle cx={p.cx} cy={PLOT_TOP + 8} r={3.5} fill="none" stroke="#475569" strokeWidth={1.5} />
                <text x={p.cx + 8} y={PLOT_TOP + 12} fontSize={8} fill="#64748B" fontFamily="Roboto Mono, monospace">up to $5M+</text>
              </g>
            )}

            {/* Bottom label */}
            <text
              x={p.cx} y={208}
              textAnchor="middle"
              fontSize={10}
              fill="#100F0F"
              fontFamily="Roboto Mono, monospace"
              fontWeight="700"
            >
              {p.label}
            </text>
            <text
              x={p.cx} y={222}
              textAnchor="middle"
              fontSize={8.5}
              fill="#64748B"
              fontFamily="Roboto Mono, monospace"
            >
              ({p.unit})
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Reusable Table ──────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-700 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-neutral-900 font-mono text-xs whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TechSalaryPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Back */}
      <Link href="/#projects" className="text-sm text-neutral-700 hover:text-neutral-800 transition-colors mb-10 inline-block">
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {["DSBA 2302", "Python", "Linear Regression", "Statistical Analysis", "Tableau"].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-800">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-3">Tech Industry Salary Demographics Study</h1>
        <p className="text-neutral-800 leading-relaxed">
          A statistical analysis of compensation trends across 62,642 tech industry employees,
          investigating how demographic factors like education, race, gender, and experience drive
          differences in base salary. Built a linear regression model to predict total yearly
          compensation from behavioral and demographic variables.
        </p>
      </div>

      {/* Research Question */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">research question</h2>
        <div className="border-l-4 pl-5 py-1" style={{ borderColor: "#475569" }}>
          <p className="text-neutral-800 text-sm leading-relaxed italic">
            &ldquo;How do demographic factors such as education, race, gender, and level of experience affect
            someone&apos;s base salary in the tech industry?&rdquo;
          </p>
        </div>
      </section>

      {/* My Role */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">my role</h2>
        <div className="border border-neutral-100 rounded-xl p-6 bg-neutral-50">
          <p className="text-neutral-900 leading-relaxed">
            Team of five (Nick Krassy, Alec Lundy, <strong>Christian Chapman</strong>, Ezra Moen, Nash Bachman).
            Contributed to statistical modeling, data cleaning strategy, and correlation analysis,
            turning raw demographic data into usable model inputs and presenting findings to both
            technical and non-technical teammates.
          </p>
        </div>
      </section>

      {/* Dataset Overview */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">dataset overview</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { stat: "62,642", label: "Total Records" },
            { stat: "6",      label: "Key Variables" },
            { stat: "3",      label: "Model Features" },
          ].map((s) => (
            <div key={s.label} className="border border-neutral-100 rounded-xl p-5 bg-neutral-50 text-center">
              <p className="text-2xl font-bold text-neutral-900 mb-1">{s.stat}</p>
              <p className="text-xs text-neutral-700">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-neutral-900 leading-relaxed text-sm">
          Data sourced from tech industry salary records covering employees across companies of varying sizes.
          Key variables include total yearly compensation, years of experience, years at current company,
          gender, race, and education level. The dataset contained substantial missing values requiring
          targeted handling prior to modeling.
        </p>
      </section>

      {/* Data Quality */}
      <section className="mb-3">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">missing values by variable</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <MissingValuesChart />
        </div>
      </section>
      <div className="mb-12 rounded-xl px-5 py-4 text-xs text-neutral-800 leading-relaxed" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
        Race had the highest missingness at 64.2%, limiting its use as a reliable predictor.
        Gender (31.2%) and Education (51.5%) were also heavily incomplete.
        All three were excluded from the final regression model due to insufficient data density.
      </div>

      {/* Outlier Analysis */}
      <section className="mb-3">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">outlier analysis</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <BoxPlots />
        </div>
      </section>
      <div className="mb-12 rounded-xl px-5 py-4 flex flex-wrap gap-6 text-xs text-neutral-800" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
        <div className="flex items-center gap-2">
          <svg width="32" height="16" viewBox="0 0 32 16">
            <rect x="7" y="2" width="18" height="12" fill="#f9f8f3" stroke="#475569" strokeWidth="2" rx="2" />
            <line x1="7" y1="8" x2="25" y2="8" stroke="#100F0F" strokeWidth="2.5" />
            <line x1="16" y1="0" x2="16" y2="2" stroke="#d1cfc4" strokeWidth="1.5" />
            <line x1="16" y1="14" x2="16" y2="16" stroke="#d1cfc4" strokeWidth="1.5" />
          </svg>
          <span>Box = interquartile range (Q1–Q3)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="22" height="16" viewBox="0 0 22 16">
            <line x1="11" y1="3" x2="11" y2="13" stroke="#100F0F" strokeWidth="2.5" />
          </svg>
          <span>Bold line = median</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="4" fill="none" stroke="#475569" strokeWidth="1.5" />
          </svg>
          <span>Circle = outlier</span>
        </div>
      </div>

      {/* Correlation Analysis */}
      <section className="mb-3">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">correlation matrix</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <CorrelationHeatmap />
        </div>
      </section>
      <div className="mb-12 rounded-xl px-5 py-4 text-xs text-neutral-800 leading-relaxed" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
        Years of experience showed the strongest correlation with compensation (r = 0.37), making it
        the primary predictor. Years at company had a weaker direct relationship with pay (r = 0.11),
        but correlated moderately with experience (r = 0.44), indicating collinearity between the two predictors.
      </div>

      {/* Model Selection */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">model selection</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              model: "Linear Regression",
              verdict: "Selected",
              selected: true,
              reason: "Targets a continuous quantitative variable. Preliminary analysis confirmed linear trends between experience and compensation.",
            },
            {
              model: "Logistic Regression",
              verdict: "Rejected",
              selected: false,
              reason: "Designed for categorical outcomes. Not appropriate for predicting a continuous salary value.",
            },
            {
              model: "Decision Tree",
              verdict: "Rejected",
              selected: false,
              reason: "Also targets categorical variables. Prone to overfitting on high-variance salary data.",
            },
          ].map((m) => (
            <div key={m.model} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-neutral-800">{m.model}</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={m.selected
                    ? { background: "#475569", color: "white" }
                    : { background: "#f3f4f6", color: "#9ca3af" }}
                >
                  {m.verdict}
                </span>
              </div>
              <p className="px-4 py-3 text-xs text-neutral-800 leading-relaxed">{m.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model Performance */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">model performance</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
              <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Baseline: Linear Regression</p>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3">
              {[
                { label: "R²",            value: "0.187",        note: "explains 18.7% of variance" },
                { label: "Durbin-Watson", value: "2.008",        note: "no autocorrelation" },
                { label: "MSE",           value: "6.715 × 10⁹",  note: "mean squared error" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4">
                  <span className="text-xs text-neutral-700 font-medium shrink-0">{s.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-neutral-900">{s.value}</span>
                    <p className="text-xs text-neutral-700">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-xl overflow-hidden" style={{ borderColor: "#d1cfc4" }}>
            <div className="px-4 py-2.5 border-b" style={{ background: "#475569", borderColor: "#3A56A8" }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.85)" }}>Tuned: Ridge + Z-Score Filtering</p>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3" style={{ background: "#f9f8f3" }}>
              {[
                { label: "Technique", value: "Ridge Reg.",    note: "L2 regularization" },
                { label: "Filter",    value: "Z-Score",       note: "outlier removal" },
                { label: "MSE",       value: "6.714 × 10⁹",  note: "marginal improvement" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-medium" style={{ color: "#64748B" }}>{s.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold" style={{ color: "#100F0F" }}>{s.value}</span>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* R² visual */}
        <div className="border border-neutral-200 rounded-xl p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Variance Explained (R²)</p>
            <span className="text-xs font-mono font-bold" style={{ color: "#475569" }}>18.7%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#DCE5F4" }}>
            <div className="h-full rounded-full" style={{ width: "18.7%", background: "#475569" }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-neutral-700">0%</span>
            <span className="text-xs text-neutral-700">100%</span>
          </div>
          <p className="text-xs text-neutral-700 mt-3 leading-relaxed">
            The model explains ~19% of the variation in compensation. The remaining 81% comes down
            to factors not captured in the dataset: company size, location, stock grants, and role specifics.
          </p>
        </div>
      </section>

      {/* Key Findings */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">key findings</h2>
        <ul className="flex flex-col gap-3">
          {[
            "Years of experience is the strongest predictor of compensation (r = 0.37), consistently outweighing tenure at a single company.",
            "Demographic variables (race, gender, education) could not be reliably included due to high rates of missing data (up to 64% for race).",
            "Ridge regression and Z-score filtering produced only marginal MSE improvement over the baseline, suggesting the data itself is the primary constraint on accuracy.",
            "A Durbin-Watson statistic of 2.008 confirms residuals are uncorrelated, so the linear model assumptions hold.",
            "The model is best used as a directional tool for salary benchmarking, not precise prediction.",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-sm text-neutral-900">
              <span className="mt-0.5 shrink-0" style={{ color: "#d1cfc4" }}>-</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Limitations */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">limitations</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "Data Quality",    body: "Dataset contains significant missingness in key demographic variables, limiting the scope of the analysis." },
            { title: "Model Accuracy",  body: "R² of 0.187 indicates the model captures a fraction of compensation variance. Further feature engineering is needed." },
            { title: "Missing Context", body: "Location, company size, and equity/bonus structures are missing, all of which are major drivers of real-world compensation." },
          ].map((l) => (
            <div key={l.title} className="rounded-xl p-4" style={{ background: "#f9f8f3", border: "1px solid #d1cfc4" }}>
              <p className="font-semibold text-sm mb-1" style={{ color: "#100F0F" }}>{l.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{l.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <div className="border-t border-neutral-100 pt-8">
        <a
          href="/projects/tech-salary/report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "#475569", color: "white" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download Full Presentation
        </a>
      </div>

    </main>
  );
}
