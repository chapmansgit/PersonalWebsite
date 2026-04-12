import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col border border-neutral-200 rounded-xl p-6 gap-4 hover:border-neutral-400 transition-colors">
      <div className="flex flex-col gap-1">
        <Link
          href={`/projects/${project.slug}`}
          className="font-semibold text-lg hover:underline"
        >
          {project.title}
        </Link>
        <p className="text-neutral-800 text-sm">{project.description}</p>
      </div>

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

      <div className="mt-auto pt-2 border-t border-neutral-100">
        <Link href={`/projects/${project.slug}`} className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
          Read more →
        </Link>
      </div>
    </div>
  );
}
