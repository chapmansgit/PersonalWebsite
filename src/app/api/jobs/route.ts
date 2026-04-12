export interface FetchedJob {
  id: string;
  title: string;
  description: string;
  url: string;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ error: "query param required" }, { status: 400 });
  }
  if (!RAPIDAPI_KEY) {
    return Response.json({ error: "RAPIDAPI_KEY not configured" }, { status: 500 });
  }

  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", query);
  url.searchParams.set("num_pages", "1");
  url.searchParams.set("page", "1");
  url.searchParams.set("country", "us");

  const res = await fetch(url.toString(), {
    headers: {
      "X-RapidAPI-Key":  RAPIDAPI_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  });

  if (!res.ok) {
    return Response.json({ error: `JSearch error: ${res.status}` }, { status: 502 });
  }

  const data = await res.json();

  const jobs: FetchedJob[] = (data.data ?? [])
    .filter((j: Record<string, unknown>) => j.job_description)
    .slice(0, 8)
    .map((j: Record<string, unknown>) => ({
      id:          j.job_id as string,
      title:       j.job_title as string,
      description: j.job_description as string,
      url:         (j.job_apply_link ?? j.job_google_link ?? "") as string,
    }));

  return Response.json({ jobs });
}
