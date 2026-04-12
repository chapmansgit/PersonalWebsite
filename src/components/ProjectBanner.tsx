"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import type { Project } from "@/data/projects";

export default function ProjectBanner({ projects }: { projects: Project[] }) {
  const items = [...projects, ...projects, ...projects];

  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollLeft = container.scrollWidth / 3;

    const tick = () => {
      if (container) {
        container.scrollLeft += 0.8;
        const third = container.scrollWidth / 3;
        if (container.scrollLeft >= third * 2) container.scrollLeft -= third;
        if (container.scrollLeft < third) container.scrollLeft += third;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-scroll py-6 border-y border-neutral-100"
      style={{ scrollbarWidth: "none" } as React.CSSProperties}
    >
      <div className="flex gap-6 w-max">
        {items.map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            href={`/projects/${project.slug}`}
            draggable={false}
            className="flex flex-col w-72 shrink-0 border border-neutral-200 rounded-xl p-6 gap-4 hover:border-neutral-400 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-lg text-neutral-900">{project.title}</span>
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
              <span className="text-sm text-neutral-700">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
