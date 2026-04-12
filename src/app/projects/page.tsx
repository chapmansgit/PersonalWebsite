import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects",
  description: "A collection of things I've built.",
};

export default function ProjectsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Projects</h1>
        <p className="text-neutral-800">
          A collection of things I&apos;ve built.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  );
}
