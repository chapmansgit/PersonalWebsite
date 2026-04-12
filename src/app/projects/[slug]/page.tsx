import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: "'Roboto Mono', monospace" }}>
      <Link
        href="/#projects"
        className="text-sm text-neutral-700 hover:text-neutral-800 transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="mb-8">
        <div className="mb-3">
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <p className="text-neutral-800 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-800"
            >
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
            <p className="text-neutral-900 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

    </main>
  );
}
