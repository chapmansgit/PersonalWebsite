export interface Company {
  name: string;
  slug: string;
  query: string; // JSearch query string
}

export const companies: Company[] = [
  {
    name: "Wells Fargo",
    slug: "wells-fargo",
    query: "data analyst Wells Fargo Charlotte NC",
  },
  {
    name: "First Citizens Bank",
    slug: "first-citizens",
    query: "data analyst First Citizens Bank Charlotte NC",
  },
  {
    name: "Bank of America",
    slug: "bank-of-america",
    query: "data analyst Bank of America Charlotte NC",
  },
  {
    name: "Ally Financial",
    slug: "ally-financial",
    query: "data analyst Ally Financial Charlotte NC",
  },
];
