export type ProjectSection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  sections: ProjectSection[];
  tags: string[];
  year: number;
};

export const projects: Project[] = [
  {
    slug: "polymarket-pitch-deck",
    title: "Polymarket Market Operations Pitch",
    description:
      "Dispute analysis pipeline across 906 markets, three launch-ready market proposals, and a 23-creator golf vertical pitch with Parti.com distribution alignment.",
    sections: [
      {
        heading: "overview",
        body: "Built independently as research for a Market Operations Analyst application. Pulled all 906 disputed markets from the Polymarket Gamma API, classified each dispute reason via Claude API, extracted language patterns into a library, and drafted three dispute-proof market proposals directly against the failure modes found in the data.",
      },
    ],
    tags: ["Python", "Claude API", "Gamma API", "Market Design", "Data Pipeline", "Notion"],
    year: 2026,
  },
  {
    slug: "skill-graph",
    title: "Skill Graph",
    description: "An interactive knowledge graph connecting skills across every project, course, and job.",
    sections: [
      {
        heading: "overview",
        body: "An Obsidian-style knowledge graph visualizing how skills connect across projects, education, and work experience. Built with SVG and React, running entirely in the browser with no external dependencies.",
      },
    ],
    tags: ["React", "SVG", "Data Visualization", "TypeScript"],
    year: 2026,
  },
  {
    slug: "4d-ai-fluency-lab",
    title: "4D AI Fluency Lab",
    description:
      "A local MCP server that measures, tracks, and develops AI fluency through behavioral assessment of Claude conversations.",
    sections: [
      {
        heading: "overview",
        body: "Built a Model Context Protocol (MCP) server in TypeScript that classifies Claude conversations against a 4-dimensional behavioral rubric (Delegation, Description, Discernment, and Diligence) based on Anthropic's AI Fluency Index. The server scores prompts 0–3 per dimension and places users in Foundation, Practitioner, or Expert tiers.",
      },
      {
        heading: "what i built",
        body: "Built the full server from scratch: 20+ MCP tools, a versioned SQLite database, a localhost HTTP report server, and a set of Claude Code slash commands. Outputs include self-contained HTML reports with radar charts and score breakdowns, a Duolingo-style trainer built from a user's own classified conversations, cohort analytics, and champion coaching packets, all without leaving Claude Code.",
      },
      {
        heading: "key outcomes",
        body: "A working AI fluency measurement tool that classifies any Claude session, tracks score changes over time, and generates shareable reports. Covers database design, API architecture, and TypeScript in a real MCP integration.",
      },
    ],
    tags: ["TypeScript", "Node.js", "SQLite", "MCP", "API Design", "Bash", "Classification"],
    year: 2026,
  },
  {
    slug: "dealership-inventory-sales-analysis",
    title: "Dealership Inventory & Sales Analysis",
    description:
      "SQL-based analysis system tracking vehicle inventory, sales performance, and customer transactions.",
    sections: [
      {
        heading: "overview",
        body: "Built a suite of SQL queries and reporting views for a car dealership dataset, enabling detailed tracking of vehicle inventory, sales performance over time, and customer transaction history.",
      },
      {
        heading: "what i built",
        body: "Wrote complex queries using joins, aggregations, and window functions to surface business-critical metrics: top-selling models, inventory turnover rates, sales rep performance, and customer purchase patterns. Optimized slow queries using indexes and query restructuring.",
      },
      {
        heading: "key outcomes",
        body: "Delivered a reusable reporting layer that reduced manual data compilation. Demonstrated the ability to translate business questions into efficient SQL and present findings in a format accessible to non-technical stakeholders.",
      },
    ],
    tags: ["SQL", "Database Design", "Query Optimization", "Business Intelligence", "Oracle LiveSQL"],
    year: 2025,
  },
  {
    slug: "tech-salary-demographics-study",
    title: "Tech Industry Salary Demographics Study",
    description:
      "Statistical analysis of compensation trends across 62,642 tech employees using linear regression, correlation matrices, and outlier detection.",
    sections: [
      {
        heading: "overview",
        body: "Analyzed 62,642 tech industry salary records to see how demographic factors (education, race, gender, years of experience) affect total yearly compensation. Applied linear regression, correlation analysis, and Ridge regularization to build a predictive model.",
      },
      {
        heading: "methodology",
        body: "Handled significant missing values (up to 64% for race), performed outlier detection via box plots and Z-score filtering, and built a correlation matrix to identify collinearity. Selected linear regression over logistic and decision tree models based on the continuous nature of the target variable.",
      },
      {
        heading: "key findings",
        body: "Years of experience was the strongest predictor (r = 0.37). The final model achieved R² = 0.187, with Ridge regression producing marginal improvement. Demographic variables were excluded due to data quality constraints.",
      },
    ],
    tags: ["Python", "Linear Regression", "Correlation Matrices", "Data Cleaning", "Outlier Detection", "Tableau"],
    year: 2024,
  },
  {
    slug: "covid-migration-charlotte",
    title: "COVID-19 Migration Patterns in Charlotte",
    description:
      "Study of how the COVID-19 pandemic disrupted immigration and emigration in Charlotte, NC, using Census and NCDHHS data from 2019 to 2022.",
    sections: [
      {
        heading: "overview",
        body: "Group research project examining whether COVID-19 had a measurable effect on who was moving in and out of Charlotte. Charlotte had posted positive migration deltas for over a decade. We tracked five variables across a four-year window to isolate what the pandemic actually changed: population growth rate, COVID case counts, mortality rate, birth rate, and net migratory delta.",
      },
      {
        heading: "methodology",
        body: "Pulled population data from the US Census Bureau and per-year birth/death CSV files from the NC Department of Health and Human Services. Compiled into a pandas dataframe and calculated a migratory delta by subtracting the birth/death delta from total population delta each year, isolating migration from natural population change. COVID case counts came from NCDHHS monthly reports; mortality from the NC State Center for Health Statistics. Visualized results as a V-curve chart with migratory delta and birth/death contribution plotted as separate series.",
      },
      {
        heading: "data",
        body: "2019: births vs deaths +6,218 | migrants +7,523 | total +13,741. 2020: births vs deaths +5,336 | migrants -16,517 | total -11,181. 2021: births vs deaths +4,897 | migrants -1,935 | total +2,962. 2022: births vs deaths +5,610 | migrants +12,401 | total +18,011.",
      },
      {
        heading: "key findings",
        body: "Charlotte's migratory delta collapsed from +7,523 in 2019 to -16,517 in 2020, the first negative figure in over 30 years, entirely driven by migration rather than births or deaths. 2021 remained negative at -1,935 before rebounding to +12,401 in 2022, overshooting pre-pandemic levels. The 2022 surge likely reflects delayed moves from people who waited out the pandemic. Housing followed: homes priced $300K-$1M rose from 53,200 to 67,300 units between 2019 and 2021 as compressed supply met surging demand.",
      },
    ],
    tags: ["Python", "Pandas", "Statistical Analysis", "Demographics", "Data Visualization", "Census Data"],
    year: 2023,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
