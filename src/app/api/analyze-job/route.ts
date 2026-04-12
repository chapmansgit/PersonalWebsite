import Anthropic from "@anthropic-ai/sdk";
import { formatProfileForClaude } from "@/data/profile";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Fixed axes kept for the existing radar chart visualization
const RADAR_AXES = [
  "Python", "TypeScript", "AI Tooling", "API Design",
  "SQL", "Database Design", "Statistics", "Visualization",
];

function buildSystemPrompt(): string {
  return `You are a job match analyzer for a specific candidate. Your job is to read a job posting and produce an honest, evidence-based analysis of how well this candidate matches the role.

Here is the candidate's full profile:

${formatProfileForClaude()}

---

You will be given a raw job description. Perform two tasks:

TASK 1 — RADAR SCORES
Score each of the following axes 0–10 based on how heavily the job emphasizes that skill.
0 = not mentioned, 10 = explicitly required with depth.
Axes: ${RADAR_AXES.join(", ")}.

TASK 2 — EVIDENCE-BASED MATCH
A. Extract up to 10 required skills from the job description (things the job says are required, essential, or must-have).
B. Extract up to 8 preferred skills (nice-to-have, preferred, bonus).
C. For each requirement, match it against the candidate profile:
   - matched: true if the candidate has clear evidence, false if not
   - confidence: "direct" (specific project evidence exists), "adjacent" (related skill, partial evidence), or "none" (no evidence)
   - evidence: one sentence citing the specific project or experience from the profile, or "No evidence found."
   - importance: 1–5 (how prominently this skill appears in the posting)

D. Identify up to 3 strengths (specific things to emphasize in an interview based on the profile).
E. Identify up to 3 honest gaps (required skills the candidate lacks or is weak in).
F. Calculate weightedMatchPct: percentage of required skills the candidate matches (confidence "direct" = 1.0, "adjacent" = 0.5, "none" = 0.0), weighted by importance. Round to nearest integer.
G. Write a 2–3 sentence matchSummary using the profile evidence, not generic language.

Respond with valid JSON only. No markdown fences. Schema:
{
  "jobTitle": string,
  "company": string,
  "scores": {
    "Python": number, "TypeScript": number, "AI Tooling": number,
    "API Design": number, "SQL": number, "Database Design": number,
    "Statistics": number, "Visualization": number
  },
  "rawSkills": string[],
  "required": [
    {
      "skill": string,
      "importance": number,
      "matched": boolean,
      "confidence": "direct" | "adjacent" | "none",
      "evidence": string
    }
  ],
  "preferred": [
    {
      "skill": string,
      "importance": number,
      "matched": boolean,
      "confidence": "direct" | "adjacent" | "none",
      "evidence": string
    }
  ],
  "strengths": string[],
  "gaps": string[],
  "weightedMatchPct": number,
  "matchSummary": string
}`;
}

export interface RequirementMatch {
  skill: string;
  importance: number;
  matched: boolean;
  confidence: "direct" | "adjacent" | "none";
  evidence: string;
}

export interface AnalysisResult {
  jobTitle: string;
  company: string;
  scores: Record<string, number>;
  rawSkills: string[];
  required: RequirementMatch[];
  preferred: RequirementMatch[];
  strengths: string[];
  gaps: string[];
  weightedMatchPct: number;
  matchSummary: string;
}

export async function POST(request: Request) {
  const { description } = await request.json();
  if (!description || typeof description !== "string") {
    return Response.json({ error: "description is required" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Analyze this job posting and return the JSON schema described:\n\n${description.slice(0, 12_000)}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  // Strip markdown fences if Claude wraps the JSON
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  try {
    const parsed: AnalysisResult = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Failed to parse Claude response", raw }, { status: 500 });
  }
}
