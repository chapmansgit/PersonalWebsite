import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

const chartData = [
  { year: "2019", births: 6218,  migrants: 7523   },
  { year: "2020", births: 5336,  migrants: -16517  },
  { year: "2021", births: 4897,  migrants: -1935   },
  { year: "2022", births: 5610,  migrants: 12401   },
];

const Y_MAX   = 15000;
const Y_MIN   = -18000;
const Y_RANGE = Y_MAX - Y_MIN;

const LEFT = 64, TOP = 20, RIGHT = 520, BOTTOM = 270;
const W = RIGHT - LEFT;
const H = BOTTOM - TOP;

const yZero = TOP + (Y_MAX / Y_RANGE) * H;
const toY   = (v: number) => yZero - (v / Y_RANGE) * H;

const groupCenters = chartData.map((_, i) => LEFT + (i + 0.5) * (W / chartData.length));
const BAR_W = 26;
const GAP   = 8;

const yTicks = [-15000, -10000, -5000, 0, 5000, 10000];

export const metadata = {
  title: "COVID-19 Migration Patterns in Charlotte",
  description: "Study of how the COVID-19 pandemic disrupted immigration and emigration in Charlotte, NC.",
};

export default function CovidMigrationPage() {
  const project = getProjectBySlug("covid-migration-charlotte")!;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: "var(--font-roboto-mono), monospace" }}>
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8 inline-block">
        ← back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-3">{project.title}</h1>
        <p className="text-neutral-700 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 border-t border-neutral-100 pt-8">
        {project.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-2">
              {section.heading}
            </h2>
            <p className="text-neutral-900 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}

        {/* Chart */}
        <div>
          <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">
            fig. 1: charlotte population delta by year
          </h2>

          {/* Legend */}
          <div className="flex gap-6 mb-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span style={{ display: "inline-block", width: 12, height: 12, background: "#94A3B8", borderRadius: 2 }} />
              births vs deaths
            </div>
            <div className="flex items-center gap-2">
              <span style={{ display: "inline-block", width: 12, height: 12, background: "#3B5EA6", borderRadius: 2 }} />
              migratory delta
            </div>
          </div>

          <svg viewBox="0 0 560 300" style={{ width: "100%", height: "auto" }}>
            {/* Y axis gridlines + labels */}
            {yTicks.map((v) => {
              const y = toY(v);
              const isZero = v === 0;
              return (
                <g key={v}>
                  <line
                    x1={LEFT} y1={y} x2={RIGHT} y2={y}
                    stroke={isZero ? "#64748B" : "#E2E8F0"}
                    strokeWidth={isZero ? 1 : 0.8}
                  />
                  <text
                    x={LEFT - 6} y={y + 4}
                    textAnchor="end"
                    fontSize="7"
                    fill="#94A3B8"
                    fontFamily="var(--font-roboto-mono), monospace"
                  >
                    {v >= 0 ? `+${(v / 1000).toFixed(0)}k` : `${(v / 1000).toFixed(0)}k`}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {chartData.map((d, i) => {
              const cx = groupCenters[i];
              const x1 = cx - GAP / 2 - BAR_W;
              const x2 = cx + GAP / 2;

              const birthsY     = d.births >= 0 ? toY(d.births) : yZero;
              const birthsH     = Math.abs(toY(d.births) - yZero);
              const migrantsY   = d.migrants >= 0 ? toY(d.migrants) : yZero;
              const migrantsH   = Math.abs(toY(d.migrants) - yZero);

              return (
                <g key={d.year}>
                  {/* Births bar */}
                  <rect x={x1} y={birthsY} width={BAR_W} height={birthsH} fill="#94A3B8" />
                  {/* Migrants bar */}
                  <rect x={x2} y={migrantsY} width={BAR_W} height={migrantsH} fill="#3B5EA6" />
                  {/* Year label */}
                  <text
                    x={cx} y={BOTTOM + 14}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#64748B"
                    fontFamily="var(--font-roboto-mono), monospace"
                  >
                    {d.year}
                  </text>
                  {/* Value labels */}
                  <text
                    x={x1 + BAR_W / 2}
                    y={d.births >= 0 ? birthsY - 3 : birthsY + birthsH + 9}
                    textAnchor="middle"
                    fontSize="6.5"
                    fill="#94A3B8"
                    fontFamily="var(--font-roboto-mono), monospace"
                  >
                    {d.births > 0 ? `+${d.births.toLocaleString()}` : d.births.toLocaleString()}
                  </text>
                  <text
                    x={x2 + BAR_W / 2}
                    y={d.migrants >= 0 ? migrantsY - 3 : migrantsY + migrantsH + 9}
                    textAnchor="middle"
                    fontSize="6.5"
                    fill="#3B5EA6"
                    fontFamily="var(--font-roboto-mono), monospace"
                  >
                    {d.migrants > 0 ? `+${d.migrants.toLocaleString()}` : d.migrants.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </main>
  );
}
