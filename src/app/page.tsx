import Link from "next/link";
import { projects } from "@/data/projects";

const certs = [
  { title: "claude code in action",              url: "https://verify.skilljar.com/c/pboxq7vbe6o5" },
  { title: "claude with the anthropic api",      url: "https://verify.skilljar.com/c/yutwdn36ibcz" },
  { title: "claude 101",                         url: "https://verify.skilljar.com/c/8m9o35r7yoh9" },
  { title: "ai fluency: framework & foundations",url: "https://verify.skilljar.com/c/2je2a4z4pjuk" },
  { title: "ai fluency for students",            url: "https://verify.skilljar.com/c/qbjimm37u3kb" },
  { title: "teaching the ai fluency framework",  url: null },
];

export default function Home() {
  return (
    <>
      <style>{`
        .smca { position: relative; font-family: var(--font-roboto-mono), monospace; font-size: 14px; line-height: 1.5; color: #100F0F; background: #ffffff; min-height: 100vh; -webkit-font-smoothing: antialiased; }
        .smca-header { position: absolute; top: 16px; left: 32px; }
        .smca-name { font-family: var(--font-merriweather), serif; font-size: 24px; font-weight: 900; line-height: 1.2; color: #100F0F; text-decoration: none; }
        .smca-name:hover { background-color: #ffd00066; }
        .smca-main { max-width: 650px; margin: 0 auto; padding: 60px 32px 64px 32px; }
        .smca-h1 { font-family: var(--font-merriweather), serif; font-size: 24px; font-weight: 900; line-height: 1.2; margin: 0.5em 0; color: #100F0F; }
        .smca-label { background-color: #f2f0e5; padding: 2px 6px; display: inline-block; margin: 0.75em 0 0.25em 0; }
        .smca-p { margin: 0.5em 0; }
        .smca-a { color: #1F51FF; text-decoration: underline; padding: 0 2px; margin: 0 -2px; }
        .smca-a:hover { background-color: #ffd00066; }
        .smca-mark { background-color: #ffd00066; padding: 0 2px; }
        .smca-hr { border: none; border-top: 1px solid #f2f0e5; margin: 1.5em 0; }
        .smca-ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .smca-ul li { margin: 0.25em 0; }

        @media (max-width: 480px) {
          .smca-header { position: relative; top: auto; left: auto; padding: 16px 32px 0; }
          .smca-name { font-size: 18px; }
          .smca-main { padding: 16px 32px 32px; }
        }
      `}</style>

      <div className="smca">
        <header className="smca-header">
          <a href="/" className="smca-name">christian joseph</a>
        </header>

        <main className="smca-main">
          <h1 className="smca-h1">hi! i&apos;m christian.</h1>

          <div className="smca-label">about</div>
          <p className="smca-p">
            I analyze data and build production tools with AI. Python and SQL for analysis, TypeScript when something needs to ship.{" "}
            <Link href="/rsvp" className="smca-a">read my resume in 45 seconds →</Link>
          </p>
          <p className="smca-p">
            My background started in Information Systems Cyber Security and Information Assurance at UNC Greensboro, with additional coursework in psychology research covering behavioral analysis, experiments, surveys, and case studies. I built a foundation in both systems thinking and human behavior before switching to data science at UNC Charlotte.
          </p>

          <div className="smca-label">education</div>
          <p className="smca-p">
            B.S. in Data Science from UNC Charlotte. Started at UNC Greensboro in kinesiology and psychology research, then switched to data.
          </p>
          <p className="smca-p">
            I hold several Anthropic certifications and build most of my production work with{" "}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="smca-a">Claude</a>.
          </p>

          <div className="smca-label">contact</div>
          <p className="smca-p">
            Open to data and technology roles in Charlotte.{" "}
            <a href="https://www.linkedin.com/in/christianjchap/" target="_blank" rel="noopener noreferrer" className="smca-a">LinkedIn</a>
            {", "}
            <a href="mailto:cchapm45@charlotte.edu" className="smca-a">email</a>
            {", or "}
            <a href="tel:7049981113" className="smca-a">(704) 998-1113</a>.
          </p>

          <hr className="smca-hr" />

          <div className="smca-label">things i&apos;ve built</div>
          <ul className="smca-ul">
            <li>
              a{" "}
              <Link href="/projects/polymarket-pitch-deck" className="smca-a">polymarket pitch</Link>
              {" "}built from 906 disputed markets, three proposals, and a creator vertical
            </li>
            <li>
              an{" "}
              <Link href="/projects/4d-ai-fluency-lab" className="smca-a">mcp server</Link>
              {" "}that scores how well people use AI
            </li>
            <li>
              a{" "}
              <Link href="/projects/tech-salary-demographics-study" className="smca-a">regression study</Link>
              {" "}on 62,000 tech industry salaries
            </li>
            <li>
              a{" "}
              <Link href="/projects/dealership-inventory-sales-analysis" className="smca-a">relational database</Link>
              {" "}for a car dealership, built on Oracle LiveSQL
            </li>
            <li>
              a{" "}
              <Link href="/projects/covid-migration-charlotte" className="smca-a">migration analysis</Link>
              {" "}of covid-era population shifts in Charlotte
            </li>
            <li>
              a{" "}
              <Link href="/projects/skill-graph" className="smca-a">skill graph</Link>
              {" "}with live job match analysis against Charlotte companies
            </li>
            <li>
              this{" "}
              <Link href="/" className="smca-a">portfolio</Link>
              {", "}built with Claude Code
            </li>
          </ul>

          <div className="smca-label">certifications</div>
          <ul className="smca-ul">
            {certs.map((c) => (
              <li key={c.title}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="smca-a">
                    {c.title}
                  </a>
                ) : (
                  c.title
                )}
              </li>
            ))}
          </ul>

          <div className="smca-label">work</div>
          <p className="smca-p">
            Sales associate at Dick&apos;s Sporting Goods in Charlotte. I reorganized restocking routines to reduce floor downtime, mentor new team members through onboarding, and hit weekly sales targets through product knowledge, not scripts.
          </p>
        </main>
      </div>
    </>
  );
}
