import Link from "next/link";

const PROJECTS = [
  { slug: "polymarket-pitch-deck",               short: "polymarket"  },
  { slug: "4d-ai-fluency-lab",                   short: "ai fluency"  },
  { slug: "dealership-inventory-sales-analysis", short: "dealership"  },
  { slug: "tech-salary-demographics-study",      short: "tech salary" },
  { slug: "covid-migration-charlotte",           short: "covid study" },
];

const MATRIX = [
  {
    label: "languages",
    skills: [
      { name: "Python",     used: [true,  false, false, true,  true ] },
      { name: "TypeScript", used: [false, true,  false, false, false] },
      { name: "SQL",        used: [false, false, true,  false, false] },
      { name: "Bash",       used: [false, true,  false, false, false] },
    ],
  },
  {
    label: "ai & apis",
    skills: [
      { name: "Claude API",     used: [true,  true,  false, false, false] },
      { name: "MCP",            used: [false, true,  false, false, false] },
      { name: "API Design",     used: [false, true,  false, false, false] },
      { name: "Classification", used: [false, true,  false, false, false] },
      { name: "Data Pipeline",  used: [true,  false, false, false, false] },
    ],
  },
  {
    label: "data & analysis",
    skills: [
      { name: "Pandas",                used: [false, false, false, false, true ] },
      { name: "Statistical Analysis",  used: [false, false, false, false, true ] },
      { name: "Linear Regression",     used: [false, false, false, true,  false] },
      { name: "Data Cleaning",         used: [false, false, false, true,  false] },
      { name: "Outlier Detection",     used: [false, false, false, true,  false] },
      { name: "Database Design",       used: [false, false, true,  false, false] },
      { name: "Query Optimization",    used: [false, false, true,  false, false] },
      { name: "Business Intelligence", used: [false, false, true,  false, false] },
    ],
  },
  {
    label: "visualization & infra",
    skills: [
      { name: "Data Visualization", used: [false, false, false, true,  true ] },
      { name: "Tableau",            used: [false, false, false, true,  false] },
      { name: "SQLite",             used: [false, true,  false, false, false] },
      { name: "Node.js",            used: [false, true,  false, false, false] },
      { name: "Oracle LiveSQL",     used: [false, false, true,  false, false] },
    ],
  },
];

type Row =
  | { type: "category"; label: string }
  | { type: "skill"; name: string; used: boolean[] };

export default function SkillMatrixPage() {
  const rows: Row[] = [];
  for (const cat of MATRIX) {
    rows.push({ type: "category", label: cat.label });
    for (const skill of cat.skills) {
      rows.push({ type: "skill", name: skill.name, used: skill.used });
    }
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "var(--font-roboto-mono), monospace", fontSize: "13px", color: "#100F0F" }}>
      <style>{`
        .skill-row:hover td { background: #faf9f5; }
        .proj-link:hover { text-decoration: underline; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "18px 28px", borderBottom: "1px solid #f2f0e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#64748B", textDecoration: "none", fontSize: "12px" }}>← back</Link>
        <span style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.05em" }}>skill matrix</span>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 28px 64px" }}>

        <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 24px", lineHeight: 1.7 }}>
          every skill used across every project. click a project name to read more about it.
        </p>

        {/* Legend */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", fontSize: "11px" }}>
          <span style={{ color: "#100F0F" }}>● used</span>
          <span style={{ color: "#d1cfc4" }}>— not used</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ minWidth: "170px", padding: 0 }} />
                {PROJECTS.map((p) => (
                  <th
                    key={p.slug}
                    style={{ minWidth: "70px", height: "120px", verticalAlign: "bottom", textAlign: "left", fontWeight: 400, paddingBottom: "12px" }}
                  >
                    <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "11px", letterSpacing: "0.04em" }}>
                      <Link href={`/projects/${p.slug}`} className="proj-link" style={{ color: "#100F0F", textDecoration: "none" }}>
                        {p.short}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                if (row.type === "category") {
                  return (
                    <tr key={i}>
                      <td
                        colSpan={PROJECTS.length + 1}
                        style={{ padding: "18px 0 5px", fontSize: "10px", color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #e8e6d9" }}
                      >
                        {row.label}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={i} className="skill-row">
                    <td style={{ padding: "8px 16px 8px 0", fontSize: "12px", color: "#475569", whiteSpace: "nowrap" }}>
                      {row.name}
                    </td>
                    {row.used.map((used, j) => (
                      <td
                        key={j}
                        style={{ textAlign: "center", padding: "8px 4px", fontSize: "13px", color: used ? "#100F0F" : "#d1cfc4", borderBottom: "1px solid #faf9f5" }}
                      >
                        {used ? "●" : "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
