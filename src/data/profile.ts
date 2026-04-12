export type SkillLevel = "beginner" | "intermediate" | "proficient" | "advanced";
export type SkillCategory = "technical" | "domain" | "tool" | "soft";

export interface Evidence {
  project: string;
  what: string;
  outcome?: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  proficiency: number; // 1–10
  evidence: Evidence[];
}

export interface Project {
  name: string;
  slug: string;
  year: number;
  description: string;
  skills: string[];
  outcome: string;
}

export interface Education {
  institution: string;
  credential: string;
  details?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  verifyUrl?: string;
}

export interface WorkExperience {
  role: string;
  employer: string;
  location: string;
  highlights: string[];
}

export interface Profile {
  name: string;
  alias: string;
  title: string;
  location: string;
  summary: string;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  experience: WorkExperience[];
}

export const profile: Profile = {
  name: "Christian Chapman",
  alias: "Chap",
  title: "Data Analyst & AI Builder",
  location: "Charlotte, NC",
  summary:
    "I analyze data and build production tools with AI. Python and SQL for analysis, TypeScript when something needs to ship. I build with AI rather than just use it — most of my production work is built with Claude. Open to data and technology roles in Charlotte.",

  // ─── SKILLS ────────────────────────────────────────────────────────────────

  skills: [

    // Technical
    {
      name: "Python",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Applied linear regression and Ridge regularization to 62,642 salary records. Handled 64% missing values, Z-score outlier filtering, and feature encoding.",
          outcome: "R² = 0.187 model identifying years of experience as strongest compensation predictor.",
        },
        {
          project: "COVID-19 Migration Patterns in Charlotte",
          what: "Built pandas dataframe from Census Bureau and NCDHHS CSVs. Calculated migratory delta by subtracting birth/death delta from total population delta each year.",
          outcome: "Isolated pandemic-driven migration collapse of -16,517 in 2020, first negative figure in 30+ years.",
        },
        {
          project: "4D AI Fluency Lab",
          what: "Used Python for early MCP server prototyping and SQLite integration with classification logic.",
        },
      ],
    },
    {
      name: "SQL",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Dealership Inventory & Sales Analysis",
          what: "Wrote complex queries using joins, aggregations, window functions, and indexes on Oracle LiveSQL. Built reporting views for inventory turnover, sales rep performance, and customer transaction history.",
          outcome: "Delivered reusable reporting layer that reduced manual data compilation for the dealership dataset.",
        },
      ],
    },
    {
      name: "SQLite",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "4D AI Fluency Lab",
          what: "Designed versioned SQLite schema for the MCP server. Stored classified conversations, dimension scores, and user tier history with modular table design.",
          outcome: "Persistent database backing 20+ MCP tools including trend tracking and cohort analytics.",
        },
      ],
    },
    {
      name: "TypeScript",
      category: "technical",
      level: "intermediate",
      proficiency: 6,
      evidence: [
        {
          project: "4D AI Fluency Lab",
          what: "Built the full MCP server in TypeScript: tool definitions, database layer, HTTP report server, and slash commands.",
          outcome: "Production MCP server with 20+ tools running in Claude Code.",
        },
        {
          project: "Personal Portfolio (Skill Graph)",
          what: "Built entire Next.js App Router site in TypeScript including API routes, React components, Three.js integration, and Anthropic SDK calls.",
        },
      ],
    },
    {
      name: "Bash",
      category: "technical",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "4D AI Fluency Lab",
          what: "Wrote Bash scripts for MCP server install, Claude Code slash command wiring, and local report server startup.",
        },
      ],
    },
    {
      name: "Java",
      category: "technical",
      level: "beginner",
      proficiency: 2,
      evidence: [
        {
          project: "UNC Charlotte coursework",
          what: "Foundational exposure through data science curriculum. Object-oriented concepts and basic syntax.",
        },
      ],
    },
    {
      name: "HTML/CSS",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Wrote extensive inline styles, CSS animations, flexbox and grid layouts, and responsive design across all pages without relying on component libraries.",
        },
      ],
    },
    {
      name: "REST API Development",
      category: "technical",
      level: "intermediate",
      proficiency: 6,
      evidence: [
        {
          project: "Personal Portfolio (Skill Graph)",
          what: "Designed and built Next.js API routes: POST /api/analyze-job (Claude-powered job analysis) and GET /api/jobs (JSearch live job listings). Handled request validation, error handling, and structured JSON responses.",
        },
      ],
    },
    {
      name: "Next.js",
      category: "technical",
      level: "intermediate",
      proficiency: 6,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Built full site using Next.js 16 App Router with dynamic routes, API routes, server/client component architecture, and SSR/CSR patterns. Managed hydration constraints with dynamic imports for Three.js.",
        },
      ],
    },
    {
      name: "React",
      category: "technical",
      level: "intermediate",
      proficiency: 6,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Built React components across the site: RSVP speed reader with Web Audio API, skill graph controls with live Claude analysis, and project pages. Used useState, useEffect, useCallback, useRef, and custom interval patterns.",
        },
      ],
    },
    {
      name: "Three.js",
      category: "technical",
      level: "beginner",
      proficiency: 3,
      evidence: [
        {
          project: "Personal Portfolio (Skill Graph)",
          what: "Built 3D stacked radar chart with OrbitControls. Applied scene setup, geometry creation, material configuration, lighting, and camera control as a Next.js client component.",
        },
      ],
    },
    {
      name: "MCP Server Development",
      category: "technical",
      level: "intermediate",
      proficiency: 6,
      evidence: [
        {
          project: "4D AI Fluency Lab",
          what: "Designed and built a full Model Context Protocol server in TypeScript: 20+ tools, versioned SQLite database, localhost HTTP report server, and Claude Code slash commands. Classifies conversations against a 4D behavioral rubric and scores AI fluency in real time.",
          outcome: "Working production tool used to measure and develop AI fluency.",
        },
      ],
    },
    {
      name: "Anthropic API",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "4D AI Fluency Lab",
          what: "Integrated Claude as the classification engine for the MCP server. Designed prompts for behavioral dimension scoring (Delegation, Description, Discernment, Diligence).",
        },
        {
          project: "Personal Portfolio (Skill Graph)",
          what: "Used Anthropic SDK to build a job description analysis endpoint. Claude extracts required vs. preferred skills, maps to personal profile, and generates a weighted match report.",
        },
      ],
    },
    {
      name: "Joins & Aggregations",
      category: "technical",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Dealership Inventory & Sales Analysis",
          what: "Used inner, left, and cross joins alongside SUM, COUNT, AVG, and GROUP BY for multi-table business reporting queries on Oracle LiveSQL.",
        },
      ],
    },

    // Domain
    {
      name: "Statistical Modeling",
      category: "domain",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Built linear regression and Ridge regularization models on 62,642 records. Selected modeling approach based on the continuous target variable. Validated with Durbin-Watson statistic (2.008).",
        },
        {
          project: "COVID-19 Migration Patterns in Charlotte",
          what: "Applied inferential statistics to isolate migration signal from natural population change across a 4-year window.",
        },
      ],
    },
    {
      name: "Regression Analysis",
      category: "domain",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Applied linear and multiple regression to model compensation as a function of education, experience, and demographic variables. Used Ridge regularization to test for overfitting.",
          outcome: "R² = 0.187; years of experience identified as strongest predictor (r = 0.37).",
        },
      ],
    },
    {
      name: "Correlation Matrices",
      category: "domain",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Built and interpreted correlation matrices to surface variable relationships and guide feature selection. Used to identify collinearity before model fitting.",
        },
      ],
    },
    {
      name: "Data Cleaning",
      category: "domain",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Handled up to 64% missing values in the race column. Applied box plot and Z-score filtering for outlier removal. Standardized formats and prepared data for regression pipeline.",
        },
        {
          project: "COVID-19 Migration Patterns in Charlotte",
          what: "Processed multi-source CSVs from Census Bureau and NCDHHS, aligned formats across years, and compiled into a unified pandas dataframe.",
        },
      ],
    },
    {
      name: "Outlier Detection",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Applied box plot visualization and Z-score filtering to identify and handle anomalous salary values before model fitting.",
        },
      ],
    },
    {
      name: "Encoding Categorical Variables",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Transformed categorical features (education level, gender, race) into numeric representations for regression modeling.",
        },
      ],
    },
    {
      name: "AI & Machine Learning",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Tech Industry Salary Demographics Study",
          what: "Selected and applied supervised learning models (linear regression, Ridge) based on data characteristics. Evaluated using R², MSE, and residual analysis.",
        },
        {
          project: "UNC Charlotte coursework",
          what: "Model development covering supervised and unsupervised techniques, preprocessing pipelines, and evaluation metrics.",
        },
      ],
    },
    {
      name: "Query Optimization",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Dealership Inventory & Sales Analysis",
          what: "Tuned slow queries using indexes and restructured joins for performance in Oracle LiveSQL inventory tracking system.",
        },
      ],
    },
    {
      name: "Inventory & Sales Tracking Systems",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Dealership Inventory & Sales Analysis",
          what: "Designed schema and built full reporting layer for vehicle inventory, sales transactions, and customer data. End-to-end from schema to business-facing queries.",
        },
      ],
    },
    {
      name: "Demographic & Migration Analysis",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "COVID-19 Migration Patterns in Charlotte",
          what: "Tracked five variables (population growth, COVID cases, mortality, birth rate, migratory delta) across 2019-2022 using Census Bureau and NCDHHS data.",
          outcome: "Quantified pandemic-driven population collapse and subsequent rebound in Charlotte.",
        },
      ],
    },
    {
      name: "Psychology Research Methods",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "UNC Greensboro coursework",
          what: "25 credits in Kinesiology and Psychology. Exposure to empirical research methodology, human behavior study, and study design.",
        },
      ],
    },
    {
      name: "Inventory Management",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Dick's Sporting Goods",
          what: "Managed daily stock operations: accurate product placement, restocking routines, and inventory accuracy across department.",
          outcome: "Reorganized displays and restocking routines to reduce floor downtime.",
        },
      ],
    },
    {
      name: "Operational Efficiency",
      category: "domain",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Dick's Sporting Goods",
          what: "Identified and implemented process improvements to store workflows including display reorganization and restocking optimization.",
        },
      ],
    },

    // Tools
    {
      name: "Git",
      category: "tool",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Version control across all personal projects. Daily use for tracking changes, managing code history, and coordinating incremental work.",
        },
      ],
    },
    {
      name: "GitHub",
      category: "tool",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Repository hosting for personal website and project work. Uses GitHub for version control and project storage.",
        },
      ],
    },
    {
      name: "Tailwind CSS",
      category: "tool",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        {
          project: "Personal Portfolio",
          what: "Used Tailwind v4 utility classes throughout the portfolio for spacing, typography, and layout alongside custom inline styles.",
        },
      ],
    },
    {
      name: "Tableau",
      category: "tool",
      level: "beginner",
      proficiency: 3,
      evidence: [
        {
          project: "UNC Charlotte coursework",
          what: "Basic dashboard creation and chart building. Entry-level exposure to connecting data sources and visual summaries.",
        },
      ],
    },
    {
      name: "Microsoft Excel",
      category: "tool",
      level: "advanced",
      proficiency: 9,
      evidence: [
        {
          project: "Work & coursework",
          what: "Advanced use: pivot tables, VLOOKUP, conditional formatting, data validation, complex formulas, and chart creation. Applied regularly in both academic and retail environments.",
        },
      ],
    },
    {
      name: "Microsoft Office Suite",
      category: "tool",
      level: "advanced",
      proficiency: 9,
      evidence: [
        {
          project: "Work & coursework",
          what: "Proficient across Word, PowerPoint, Outlook, and Excel for documentation, presentations, and professional communication.",
        },
      ],
    },
    {
      name: "Google Workspace",
      category: "tool",
      level: "proficient",
      proficiency: 7,
      evidence: [
        {
          project: "Work & coursework",
          what: "Regular use of Docs, Sheets, Slides, and Gmail for collaboration, document creation, and real-time team workflows.",
        },
      ],
    },
    {
      name: "Microsoft Azure",
      category: "tool",
      level: "beginner",
      proficiency: 3,
      evidence: [
        { project: "UNC Charlotte coursework", what: "Basic familiarity with cloud storage and deployment concepts." },
      ],
    },
    {
      name: "AWS",
      category: "tool",
      level: "beginner",
      proficiency: 3,
      evidence: [
        { project: "UNC Charlotte coursework", what: "Conceptual knowledge of core services from data science coursework." },
      ],
    },
    {
      name: "Google Cloud",
      category: "tool",
      level: "beginner",
      proficiency: 3,
      evidence: [
        { project: "UNC Charlotte coursework", what: "Basic exposure to GCP for cloud storage and deployment concepts." },
      ],
    },

    // Soft skills
    {
      name: "Communication",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Dick's Sporting Goods", what: "Customer-facing communication for product recommendations, issue resolution, and daily team coordination." },
        { project: "Academic projects", what: "Written reports, group presentations, and stakeholder-facing data summaries." },
      ],
    },
    {
      name: "Customer Service",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Dick's Sporting Goods", what: "Directly assisted customers with product selection and recommendations. Hit weekly sales targets through product knowledge, not scripts." },
      ],
    },
    {
      name: "Team Collaboration",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "COVID-19 Migration Patterns in Charlotte", what: "Group research project: divided data sourcing and analysis responsibilities across team members." },
        { project: "Dick's Sporting Goods", what: "Coordinated daily with team members on floor operations and coverage." },
      ],
    },
    {
      name: "Mentoring & Leadership",
      category: "soft",
      level: "intermediate",
      proficiency: 5,
      evidence: [
        { project: "Dick's Sporting Goods", what: "Assisted new team members through onboarding. Acted as knowledge-sharing point of contact for store processes." },
      ],
    },
    {
      name: "Problem-Solving",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Personal Portfolio", what: "Diagnosed and resolved hydration mismatch errors, Unicode filename issues, and Three.js SSR constraints in production." },
        { project: "Dick's Sporting Goods", what: "Resolved real-time inventory discrepancies and customer concerns on the floor." },
      ],
    },
    {
      name: "Time Management",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Academic & work", what: "Balancing full-time coursework, active job search, and ongoing retail employment while maintaining academic progress toward 2026 graduation." },
      ],
    },
    {
      name: "Adaptability",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Academic", what: "Transferred from kinesiology/psychology at UNCG to data science at UNCC — rebuilt technical foundation from scratch." },
        { project: "Personal Portfolio", what: "Pivoted from Jina URL-fetching approach to manual job description storage mid-build based on reliability constraints." },
      ],
    },
    {
      name: "Organizational Skills",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Dick's Sporting Goods", what: "Oversaw daily stock operations ensuring accurate product placement. Reorganized displays and optimized restocking routines." },
      ],
    },
    {
      name: "Growth Mindset",
      category: "soft",
      level: "advanced",
      proficiency: 9,
      evidence: [
        { project: "Personal", what: "Self-directed acquisition of TypeScript, Next.js, Three.js, and MCP development — none covered in formal curriculum. Built production tools with each." },
      ],
    },
  ],

  // ─── PROJECTS ──────────────────────────────────────────────────────────────

  projects: [
    {
      name: "4D AI Fluency Lab",
      slug: "4d-ai-fluency-lab",
      year: 2026,
      description:
        "Model Context Protocol server in TypeScript that classifies Claude conversations across four behavioral dimensions (Delegation, Description, Discernment, Diligence) and scores AI fluency in real time.",
      skills: ["TypeScript", "SQLite", "MCP Server Development", "Anthropic API", "API Design", "Bash", "Node.js"],
      outcome:
        "Production MCP server with 20+ tools. Outputs include HTML reports with radar charts, a Duolingo-style trainer, cohort analytics, and champion coaching packets — all from within Claude Code.",
    },
    {
      name: "Tech Industry Salary Demographics Study",
      slug: "tech-salary-demographics-study",
      year: 2024,
      description:
        "Statistical analysis of 62,642 tech salary records using linear regression, Ridge regularization, and correlation matrices to model compensation patterns by demographic factors.",
      skills: ["Python", "Statistical Modeling", "Regression Analysis", "Correlation Matrices", "Data Cleaning", "Outlier Detection", "Encoding Categorical Variables"],
      outcome:
        "R² = 0.187 model. Years of experience identified as strongest predictor (r = 0.37). Durbin-Watson 2.008 confirmed valid residuals.",
    },
    {
      name: "Dealership Inventory & Sales Analysis",
      slug: "dealership-inventory-sales-analysis",
      year: 2025,
      description:
        "Relational database and SQL reporting layer for a car dealership built on Oracle LiveSQL. Tracks vehicle inventory, sales transactions, and customer data.",
      skills: ["SQL", "Database Design", "Joins & Aggregations", "Query Optimization", "Inventory & Sales Tracking Systems"],
      outcome:
        "Reusable reporting layer covering inventory turnover, sales rep performance, and customer purchase patterns. Reduced manual data compilation.",
    },
    {
      name: "COVID-19 Migration Patterns in Charlotte",
      slug: "covid-migration-charlotte",
      year: 2023,
      description:
        "Study of pandemic-driven population shifts in Charlotte using Census Bureau and NCDHHS data from 2019 to 2022.",
      skills: ["Python", "Data Cleaning", "Statistical Modeling", "Demographic & Migration Analysis"],
      outcome:
        "Quantified first negative migratory delta (-16,517) in 30+ years in 2020. Documented V-curve recovery pattern through 2022.",
    },
    {
      name: "Personal Portfolio & Skill Graph",
      slug: "skill-graph",
      year: 2026,
      description:
        "Next.js personal website with a 3D skill radar (Three.js), live job match analysis powered by Claude, and an RSVP-style resume reader with ambient audio.",
      skills: ["TypeScript", "Next.js", "React", "Three.js", "HTML/CSS", "Tailwind CSS", "REST API Development", "Anthropic API", "Git", "GitHub"],
      outcome:
        "Production portfolio with live Claude-powered job analysis against personal skill profile. Built entirely with Claude Code.",
    },
  ],

  // ─── EDUCATION ─────────────────────────────────────────────────────────────

  education: [
    {
      institution: "University of North Carolina at Charlotte",
      credential: "B.S. in Data Science",
      details: "Expected 2026. Core coursework in statistical modeling, machine learning, database systems, and data visualization.",
    },
    {
      institution: "University of North Carolina at Greensboro",
      credential: "Kinesiology & Psychology Research",
      details: "25 credits completed. Research methodology, human behavior, and empirical study design before transferring to data science.",
    },
  ],

  // ─── CERTIFICATIONS ────────────────────────────────────────────────────────

  certifications: [
    {
      title: "Claude Code in Action",
      issuer: "Anthropic",
      verifyUrl: "https://verify.skilljar.com/c/pboxq7vbe6o5",
    },
    {
      title: "Claude with the Anthropic API",
      issuer: "Anthropic",
      verifyUrl: "https://verify.skilljar.com/c/yutwdn36ibcz",
    },
    {
      title: "Claude 101",
      issuer: "Anthropic",
      verifyUrl: "https://verify.skilljar.com/c/8m9o35r7yoh9",
    },
    {
      title: "AI Fluency: Framework & Foundations",
      issuer: "Anthropic",
      verifyUrl: "https://verify.skilljar.com/c/2je2a4z4pjuk",
    },
    {
      title: "AI Fluency for Students",
      issuer: "Anthropic",
      verifyUrl: "https://verify.skilljar.com/c/qbjimm37u3kb",
    },
    {
      title: "Teaching the AI Fluency Framework",
      issuer: "Anthropic",
    },
  ],

  // ─── EXPERIENCE ────────────────────────────────────────────────────────────

  experience: [
    {
      role: "Sales Associate",
      employer: "Dick's Sporting Goods / Going Going Gone",
      location: "Charlotte, NC",
      highlights: [
        "Hit daily and weekly sales targets through product knowledge and customer service.",
        "Reorganized displays and restocking routines to reduce floor downtime.",
        "Helped new team members get settled and up to speed during onboarding.",
        "Managed daily stock operations: accurate product placement and organized floor.",
      ],
    },
  ],
};

// ─── HELPERS ───────────────────────────────────────────────────────────────

/** Format the full profile as a structured string for Claude's context window. */
export function formatProfileForClaude(): string {
  const p = profile;

  const skillLines = p.skills.map((s) => {
    const evidenceLines = s.evidence
      .map((e) => `      - ${e.project}: ${e.what}${e.outcome ? " Result: " + e.outcome : ""}`)
      .join("\n");
    return `  ${s.name} [${s.level}, ${s.proficiency}/10]\n${evidenceLines}`;
  });

  const projectLines = p.projects.map(
    (pr) =>
      `  ${pr.name} (${pr.year}): ${pr.description}\n    Skills: ${pr.skills.join(", ")}\n    Outcome: ${pr.outcome}`
  );

  const certLines = p.certifications.map((c) => `  - ${c.title} (${c.issuer})`);

  const eduLines = p.education.map((e) => `  - ${e.credential}, ${e.institution}. ${e.details ?? ""}`);

  return `
CANDIDATE PROFILE: ${p.name} (${p.alias})
Title: ${p.title} | Location: ${p.location}
Summary: ${p.summary}

SKILLS (name [level, proficiency/10] with evidence):
${skillLines.join("\n")}

PROJECTS:
${projectLines.join("\n")}

EDUCATION:
${eduLines.join("\n")}

CERTIFICATIONS:
${certLines.join("\n")}
`.trim();
}
