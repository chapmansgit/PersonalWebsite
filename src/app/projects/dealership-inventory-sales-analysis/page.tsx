import Link from "next/link";

export const metadata = {
  title: "Dealership Inventory & Sales Analysis",
  description:
    "A full database design and implementation project for a car dealership, built with Oracle LiveSQL.",
};

const queries = [
  {
    label: "All vehicles by manufacturer",
    sql: `SELECT v.VIN, mo.Model_Name, v.Year, v.Color, v.Price\nFROM Vehicles v\nJOIN Models mo ON v.Model_ID = mo.Model_ID\nJOIN Manufacturers ma ON mo.ManufacturerID = ma.ID\nWHERE ma.Name = 'Porsche';`,
  },
  {
    label: "Inventory vehicles by model",
    sql: `SELECT v.VIN, mo.Model_Name, v.Year, v.Color, v.Price\nFROM Inventory v\nJOIN Models mo ON v.Model_ID = mo.Model_ID\nWHERE mo.Model_Name LIKE 'Macan%';`,
  },
  {
    label: "Full transaction details",
    sql: `SELECT t.ID, c.Name AS Customer, e.Name AS Employee,\n       v.VIN, mo.Model_Name, v.Color, t.Value\nFROM Transactions t\nJOIN Customers c  ON t.CustomerID = c.ID\nJOIN Employees e  ON t.EmployeeID = e.ID\nJOIN Vehicles v   ON t.VIN = v.VIN\nJOIN Models mo    ON v.Model_ID = mo.Model_ID;`,
  },
  {
    label: "Transactions for customer 'Richard' with red vehicle",
    sql: `SELECT t.ID, c.Name, v.VIN, mo.Model_Name, v.Color, t.Value\nFROM TransactionDetails t\nJOIN Customers c ON t.CustomerID = c.ID\nWHERE c.Name LIKE '%Richard%'\nAND v.Color = 'Red';`,
  },
];

const vehicleResults = [
  { vin: "WP1AA2A57LLB125", model: "Porsche Macan", year: 2020, color: "Black",     price: "$60,000.12" },
  { vin: "WP1AA2A57LLB123", model: "Porsche Macan", year: 2019, color: "Blue",      price: "$49,887.12" },
  { vin: "WP1AA2A57LLB125", model: "Porsche Macan", year: 2021, color: "Orange",    price: "$52,000.12" },
  { vin: "WP1AA2A57LLB123", model: "Porsche Macan", year: 2021, color: "Silver",    price: "$53,000.12" },
  { vin: "WP1AA2A57LLB125", model: "Porsche Macan", year: 2019, color: "White",     price: "$61,545.12" },
  { vin: "WP1AA2A57LLB123", model: "Porsche Macan", year: 2020, color: "Black",     price: "$42,753.12" },
  { vin: "WP1AA2A57LLB125", model: "Porsche Macan", year: 2022, color: "Turquoise", price: "$87,000.12" },
];

const transactionResults = [
  { id: "251209066", customer: "Alex Anderson",   vin: "WP1AA2A57LLB123", model: "Porsche Macan", color: "Red",   value: "$42,000.00", employee: "Sarah Johnson"  },
  { id: "271206396", customer: "Alex Kolcaryk",   vin: "WP1AA2A57LLB125", model: "Porsche Macan", color: "Black", value: "$60,000.12", employee: "Gracie Del"     },
  { id: "261206366", customer: "Richard Jackson", vin: "WP1AA2A57LLB123", model: "Porsche Macan", color: "Red",   value: "$42,000.00", employee: "Michael Brown"  },
  { id: "266302465", customer: "Robert Jamison",  vin: "WP1AA2A57LLB123", model: "Porsche Macan", color: "Blue",  value: "$49,887.12", employee: "John Carter"    },
];

// ─── Crow's-foot helpers ────────────────────────────────────────────────────
// Draws a crow's-foot (many) at point (tx,ty) coming from direction (dx,dy unit vec)
function CrowFoot({ tx, ty, dx, dy }: { tx: number; ty: number; dx: number; dy: number }) {
  const len = 12;
  const spread = 6;
  // perpendicular
  const px = -dy, py = dx;
  // base of prongs (step back from tip)
  const bx = tx + dx * len, by = ty + dy * len;
  return (
    <g stroke="#475569" strokeWidth="1.5" fill="none">
      {/* centre prong */}
      <line x1={tx} y1={ty} x2={bx} y2={by} />
      {/* top prong */}
      <line x1={tx} y1={ty} x2={bx + px * spread} y2={by + py * spread} />
      {/* bottom prong */}
      <line x1={tx} y1={ty} x2={bx - px * spread} y2={by - py * spread} />
      {/* mandatory bar */}
      <line
        x1={bx + px * 7} y1={by + py * 7}
        x2={bx - px * 7} y2={by - py * 7}
      />
    </g>
  );
}

// Single bar (one) at point (tx,ty) coming from direction (dx,dy unit vec)
function OneBar({ tx, ty, dx, dy }: { tx: number; ty: number; dx: number; dy: number }) {
  const px = -dy, py = dx;
  const bx = tx + dx * 8, by = ty + dy * 8;
  return (
    <line
      x1={bx + px * 7} y1={by + py * 7}
      x2={bx - px * 7} y2={by - py * 7}
      stroke="#475569" strokeWidth="1.5"
    />
  );
}

function ERDiagram() {
  const W = 760, H = 300;
  const bw = 130, bh = 44;

  // Entity centres
  const pos: Record<string, { x: number; y: number }> = {
    Manufacturers: { x: 90,  y: 70  },
    Models:        { x: 280, y: 70  },
    Vehicles:      { x: 470, y: 70  },
    Transactions:  { x: 470, y: 220 },
    Customers:     { x: 660, y: 220 },
    Employees:     { x: 90,  y: 220 },
  };

  // Relationships: [from(1), to(N)]
  const rels: [string, string][] = [
    ["Manufacturers", "Models"],
    ["Models",        "Vehicles"],
    ["Vehicles",      "Transactions"],
    ["Customers",     "Transactions"],
    ["Employees",     "Transactions"],
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Entity Relationship Diagram (Crow's Foot Notation)">
      <defs>
        <marker id="dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="1.5" fill="#475569" />
        </marker>
      </defs>

      {/* Relationship lines */}
      {rels.map(([from, to]) => {
        const a = pos[from], b = pos[to];

        // raw vector
        const rawDx = b.x - a.x, rawDy = b.y - a.y;
        const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
        const ux = rawDx / dist, uy = rawDy / dist;

        // edge intersection with box
        const halfW = bw / 2, halfH = bh / 2;
        const scaleX = Math.abs(ux) > 0.001 ? halfW / Math.abs(ux) : Infinity;
        const scaleY = Math.abs(uy) > 0.001 ? halfH / Math.abs(uy) : Infinity;
        const tEdge = Math.min(scaleX, scaleY);

        // start = 1-end of "from" box, end = many-end touching "to" box
        const sx = a.x + ux * tEdge + 2;
        const sy = a.y + uy * tEdge + 2;
        const ex = b.x - ux * tEdge - 2;
        const ey = b.y - uy * tEdge - 2;

        return (
          <g key={`${from}-${to}`}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#d1cfc4" strokeWidth="1.5" />
            {/* 1-side */}
            <OneBar tx={sx} ty={sy} dx={ux} dy={uy} />
            {/* N-side (crow's foot points toward "to" entity, so direction is reversed) */}
            <CrowFoot tx={ex} ty={ey} dx={-ux} dy={-uy} />
          </g>
        );
      })}

      {/* Entity boxes */}
      {Object.entries(pos).map(([name, { x, y }]) => (
        <g key={name}>
          {/* shadow */}
          <rect x={x - bw/2 + 2} y={y - bh/2 + 2} width={bw} height={bh} rx={7} fill="#f2f0e5" />
          {/* box */}
          <rect x={x - bw/2} y={y - bh/2} width={bw} height={bh} rx={7} fill="white" stroke="#d1cfc4" strokeWidth="1.5" />
          {/* header stripe */}
          <rect x={x - bw/2} y={y - bh/2} width={bw} height={20} rx={7} fill="#100F0F" />
          <rect x={x - bw/2} y={y - bh/2 + 13} width={bw} height={7} fill="#100F0F" />
          <text x={x} y={y - bh/2 + 13} textAnchor="middle" fontSize={10} fontWeight="700" fill="white" fontFamily="Roboto Mono, monospace">
            {name}
          </text>
          {/* pk */}
          <text x={x} y={y + 5} textAnchor="middle" fontSize={8.5} fill="#475569" fontFamily="monospace">
            PK
          </text>
          <text x={x + 10} y={y + 5} textAnchor="middle" fontSize={8.5} fill="#100F0F" fontFamily="monospace">
            {name === "Vehicles" ? "VIN" : "ID"}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Logical Diagram ────────────────────────────────────────────────────────
const tables: {
  name: string;
  x: number;
  y: number;
  cols: { name: string; type: string; pk?: boolean; fk?: boolean }[];
}[] = [
  {
    name: "Manufacturers", x: 30, y: 20,
    cols: [
      { name: "ID",             type: "NUMBER",       pk: true  },
      { name: "Name",           type: "VARCHAR2(50)"            },
      { name: "Country",        type: "VARCHAR2(50)"            },
      { name: "Year_Founded",   type: "NUMBER"                  },
      { name: "Parent_Company", type: "VARCHAR2(50)"            },
    ],
  },
  {
    name: "Models", x: 230, y: 20,
    cols: [
      { name: "Model_ID",         type: "NUMBER",       pk: true  },
      { name: "Model_Name",       type: "VARCHAR2(50)"            },
      { name: "ManufacturerID",   type: "NUMBER",       fk: true  },
      { name: "MSRP",             type: "NUMBER"                  },
      { name: "Year_Introduced",  type: "NUMBER"                  },
    ],
  },
  {
    name: "Vehicles", x: 430, y: 20,
    cols: [
      { name: "VIN",      type: "VARCHAR2(17)", pk: true  },
      { name: "Model_ID", type: "NUMBER",       fk: true  },
      { name: "Year",     type: "NUMBER"                  },
      { name: "Color",    type: "VARCHAR2(30)"            },
      { name: "Price",    type: "NUMBER"                  },
    ],
  },
  {
    name: "Employees", x: 30, y: 230,
    cols: [
      { name: "ID",         type: "NUMBER",       pk: true  },
      { name: "Name",       type: "VARCHAR2(50)"            },
      { name: "Position",   type: "VARCHAR2(50)"            },
      { name: "Manager_ID", type: "NUMBER",       fk: true  },
      { name: "Hire_Date",  type: "DATE"                    },
    ],
  },
  {
    name: "Transactions", x: 230, y: 230,
    cols: [
      { name: "ID",          type: "NUMBER",       pk: true  },
      { name: "VIN",         type: "VARCHAR2(17)", fk: true  },
      { name: "CustomerID",  type: "NUMBER",       fk: true  },
      { name: "EmployeeID",  type: "NUMBER",       fk: true  },
      { name: "Value",       type: "NUMBER"                  },
    ],
  },
  {
    name: "Customers", x: 430, y: 230,
    cols: [
      { name: "ID",      type: "NUMBER",       pk: true  },
      { name: "Name",    type: "VARCHAR2(50)"            },
      { name: "Address", type: "VARCHAR2(100)"           },
      { name: "Phone",   type: "VARCHAR2(15)"            },
      { name: "Email",   type: "VARCHAR2(50)"            },
    ],
  },
];

const TW = 160; // table width
const ROW_H = 22;
const HEADER_H = 24;

function tableHeight(t: typeof tables[number]) {
  return HEADER_H + t.cols.length * ROW_H + 4;
}

// FK connection definitions: [fromTable, fromCol, toTable, toCol]
const fkLinks: [string, string, string, string][] = [
  ["Models",       "ManufacturerID", "Manufacturers", "ID"],
  ["Vehicles",     "Model_ID",       "Models",        "Model_ID"],
  ["Transactions", "VIN",            "Vehicles",      "VIN"],
  ["Transactions", "CustomerID",     "Customers",     "ID"],
  ["Transactions", "EmployeeID",     "Employees",     "ID"],
];

function colY(tbl: typeof tables[number], colName: string) {
  const idx = tbl.cols.findIndex((c) => c.name === colName);
  return tbl.y + HEADER_H + idx * ROW_H + ROW_H / 2 + 2;
}

function LogicalDiagram() {
  const LW = 650, LH = 420;

  return (
    <svg viewBox={`0 0 ${LW} ${LH}`} className="w-full h-auto" aria-label="Logical Database Diagram">
      {/* FK connection lines */}
      {fkLinks.map(([fromName, fromCol, toName, toCol]) => {
        const from = tables.find((t) => t.name === fromName)!;
        const to   = tables.find((t) => t.name === toName)!;
        const fy = colY(from, fromCol);
        const ty = colY(to, toCol);

        // connect right edge of "from" to left edge of "to" (or vice versa)
        let x1: number, x2: number;
        if (from.x > to.x) {
          x1 = from.x; x2 = to.x + TW;
        } else {
          x1 = from.x + TW; x2 = to.x;
        }

        const mx = (x1 + x2) / 2;
        const path = `M ${x1} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${x2} ${ty}`;

        return (
          <path
            key={`${fromName}-${fromCol}`}
            d={path}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        );
      })}

      {/* Tables */}
      {tables.map((tbl) => {
        const h = tableHeight(tbl);
        return (
          <g key={tbl.name}>
            {/* shadow */}
            <rect x={tbl.x + 2} y={tbl.y + 2} width={TW} height={h} rx={6} fill="#f2f0e5" />
            {/* body */}
            <rect x={tbl.x} y={tbl.y} width={TW} height={h} rx={6} fill="white" stroke="#d1cfc4" strokeWidth="1.2" />
            {/* header */}
            <rect x={tbl.x} y={tbl.y} width={TW} height={HEADER_H} rx={6} fill="#100F0F" />
            <rect x={tbl.x} y={tbl.y + HEADER_H - 6} width={TW} height={6} fill="#100F0F" />
            <text
              x={tbl.x + TW / 2}
              y={tbl.y + HEADER_H - 7}
              textAnchor="middle"
              fontSize={9.5}
              fontWeight="700"
              fill="white"
              fontFamily="Roboto Mono, monospace"
            >
              {tbl.name}
            </text>

            {/* Rows */}
            {tbl.cols.map((col, i) => {
              const ry = tbl.y + HEADER_H + i * ROW_H + 2;
              const isLast = i === tbl.cols.length - 1;
              return (
                <g key={col.name}>
                  {!isLast && (
                    <line x1={tbl.x} y1={ry + ROW_H} x2={tbl.x + TW} y2={ry + ROW_H} stroke="#f2f0e5" strokeWidth="1" />
                  )}
                  {/* badge */}
                  {(col.pk || col.fk) && (
                    <rect
                      x={tbl.x + 4}
                      y={ry + 4}
                      width={16}
                      height={12}
                      rx={3}
                      fill={col.pk ? "#100F0F" : "#DCE5F4"}
                    />
                  )}
                  {(col.pk || col.fk) && (
                    <text
                      x={tbl.x + 12}
                      y={ry + 13}
                      textAnchor="middle"
                      fontSize={6.5}
                      fontWeight="700"
                      fill={col.pk ? "white" : "#475569"}
                      fontFamily="monospace"
                    >
                      {col.pk ? "PK" : "FK"}
                    </text>
                  )}
                  {/* col name */}
                  <text
                    x={tbl.x + 24}
                    y={ry + 13}
                    fontSize={8}
                    fill="#100F0F"
                    fontFamily="monospace"
                  >
                    {col.name}
                  </text>
                  {/* type */}
                  <text
                    x={tbl.x + TW - 4}
                    y={ry + 13}
                    textAnchor="end"
                    fontSize={7}
                    fill="#94A3B8"
                    fontFamily="monospace"
                  >
                    {col.type}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

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

export default function DealershipPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Back */}
      <Link href="/#projects" className="text-sm text-neutral-700 hover:text-neutral-800 transition-colors mb-10 inline-block">
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {["ITSC 3160", "Oracle LiveSQL", "Lucidchart", "SQL", "Database Design"].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-800">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-3">Dealership Inventory &amp; Sales Analysis</h1>
        <p className="text-neutral-800 leading-relaxed">
          A full database design and implementation project for a car dealership, built as part of
          Database Design &amp; Implementation (ITSC 3160). The system manages vehicles, customers,
          employees, manufacturers, and transactions in a normalized relational database deployed on
          Oracle LiveSQL.
        </p>
      </div>

      {/* My Role */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">my role</h2>
        <div className="border border-neutral-100 rounded-xl p-6 bg-neutral-50">
          <p className="text-neutral-900 leading-relaxed">
            On a team of four, I was responsible for <strong>logical diagram implementation</strong> and{" "}
            <strong>data entry</strong>, translating the conceptual ER model into a fully normalized
            logical schema and populating all six tables with realistic seed data for testing.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">overview</h2>
        <p className="text-neutral-900 leading-relaxed">
          The database handles day-to-day dealership operations: customer browsing, vehicle listing,
          transaction processing, and employee management. Six core entities are linked through foreign
          key constraints enforcing referential integrity across the full dataset. The schema satisfies
          1NF, 2NF, and 3NF normalization throughout.
        </p>
      </section>

      {/* ER Diagram */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">entity relationship diagram</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <ERDiagram />
        </div>
      </section>

      {/* ER Legend */}
      <div className="mb-12 border border-neutral-100 rounded-xl px-5 py-4 bg-neutral-50 flex flex-wrap gap-6 text-xs text-neutral-800">
        <div className="flex items-center gap-2">
          <svg width="40" height="14" viewBox="0 0 40 14">
            <line x1="0" y1="7" x2="40" y2="7" stroke="#475569" strokeWidth="1.5" />
            <line x1="8" y1="2" x2="8" y2="12" stroke="#475569" strokeWidth="1.5" />
          </svg>
          <span>Single bar = <strong>One</strong> (mandatory)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="40" height="14" viewBox="0 0 40 14">
            <line x1="0" y1="7" x2="40" y2="7" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="7" x2="14" y2="2" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="7" x2="14" y2="7" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="7" x2="14" y2="12" stroke="#475569" strokeWidth="1.5" />
            <line x1="18" y1="2" x2="18" y2="12" stroke="#475569" strokeWidth="1.5" />
          </svg>
          <span>Crow&apos;s foot = <strong>Many</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="40" height="14" viewBox="0 0 40 14">
            <line x1="0" y1="7" x2="40" y2="7" stroke="#d1cfc4" strokeWidth="1.5" />
          </svg>
          <span>Line = Relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <span>All relationships are <strong>One-to-Many (1:N)</strong></span>
        </div>
      </div>

      {/* Logical Diagram */}
      <section className="mb-4">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">logical diagram</h2>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <LogicalDiagram />
        </div>
      </section>

      {/* Logical Legend */}
      <div className="mb-12 border border-neutral-100 rounded-xl px-5 py-4 bg-neutral-50 flex flex-wrap gap-6 text-xs text-neutral-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-5 rounded font-bold font-mono text-[8px] text-white" style={{ background: "#100F0F" }}>PK</span>
          <span>Primary Key: unique row identifier</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-5 rounded font-bold font-mono text-[8px]" style={{ background: "#DCE5F4", color: "#475569" }}>FK</span>
          <span>Foreign Key: references another table&apos;s PK</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="36" height="10" viewBox="0 0 36 10">
            <line x1="0" y1="5" x2="36" y2="5" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="4 3" />
          </svg>
          <span>Dashed line = FK → PK reference</span>
        </div>
      </div>

      {/* Normalization */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">normalization</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { form: "1NF", rule: "All tables have atomic values, no repeating groups or comma-separated fields." },
            { form: "2NF", rule: "All non-key attributes fully depend on the entire primary key." },
            { form: "3NF", rule: "No transitive dependencies, e.g. MSRP lives in Models, not Vehicles." },
          ].map((n) => (
            <div key={n.form} className="border border-neutral-100 rounded-xl p-4 bg-neutral-50">
              <p className="font-semibold text-neutral-800 mb-1">{n.form}</p>
              <p className="text-xs text-neutral-800 leading-relaxed">{n.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Queries */}
      <section className="mb-12">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-4">sample queries</h2>
        <div className="flex flex-col gap-4">
          {queries.map((q) => (
            <div key={q.label} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900">{q.label}</p>
                <span className="text-xs text-neutral-700 font-mono">SQL</span>
              </div>
              <pre className="px-4 py-4 text-xs text-neutral-900 font-mono leading-relaxed overflow-x-auto bg-white whitespace-pre">
                {q.sql}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Query Results */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-6">Query Results</h2>
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-medium text-neutral-900 mb-3">All Porsche Macan vehicles</p>
            <Table
              headers={["VIN", "Model", "Year", "Color", "Price"]}
              rows={vehicleResults.map(r => [r.vin, r.model, r.year, r.color, r.price])}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 mb-3">Transaction details</p>
            <Table
              headers={["Transaction ID", "Customer", "VIN", "Model", "Color", "Value", "Employee"]}
              rows={transactionResults.map(r => [r.id, r.customer, r.vin, r.model, r.color, r.value, r.employee])}
            />
          </div>
        </div>
      </section>

      {/* Download */}
      <div className="border-t border-neutral-100 pt-8">
        <a
          href="/projects/dealership/report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ background: "#100F0F" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download Full Report
        </a>
      </div>

    </main>
  );
}
