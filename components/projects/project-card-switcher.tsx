"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useMemo, useRef, useState } from "react";
import type { projects as siteProjects } from "@/lib/content";

gsap.registerPlugin(useGSAP, Flip);

type Project = (typeof siteProjects)[number];
type CardPosition = "previous" | "active" | "next";

type ProjectCardSwitcherProps = {
  projects: readonly Project[];
};

type VisibleProject = {
  index: number;
  position: CardPosition;
  project: Project;
};

const visiblePositions = [
  { offset: -1, position: "previous" },
  { offset: 0, position: "active" },
  { offset: 1, position: "next" },
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function shouldReduceMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ProjectFigure({ name }: { name: string }) {
  if (name === "NotchMove") {
    return (
      <svg
        aria-hidden="true"
        className="size-full"
        fill="none"
        viewBox="0 0 190 120"
      >
        <path
          d="M52 28c0-9 7-16 16-16h54c9 0 16 7 16 16v9c0 7 5 12 12 12h7c8 0 14 6 14 14v26c0 8-6 14-14 14H33c-8 0-14-6-14-14V63c0-8 6-14 14-14h7c7 0 12-5 12-12z"
          stroke="currentColor"
        />
        <path d="M64 37h62" stroke="currentColor" strokeWidth="1.4" />
        <path d="M42 72h106" stroke="currentColor" strokeDasharray="2 5" />
        <circle cx="56" cy="72" fill="currentColor" r="4" />
        <circle cx="95" cy="72" r="4" stroke="currentColor" />
        <circle cx="134" cy="72" r="4" stroke="currentColor" />
        <path d="M68 92h54" stroke="currentColor" />
      </svg>
    );
  }

  if (name === "AlphaLoop") {
    return (
      <svg
        aria-hidden="true"
        className="size-full"
        fill="none"
        viewBox="0 0 190 120"
      >
        <path
          d="M17 82c38-42 106-54 153-16"
          stroke="currentColor"
          strokeDasharray="2 5"
          strokeWidth="1"
        />
        {[30, 66, 104, 139, 166].map((x, itemIndex) => (
          <g key={x}>
            <path
              d={`M${x} ${26 + itemIndex * 7}v62`}
              stroke="currentColor"
            />
            <rect
              fill={itemIndex === 3 ? "currentColor" : "none"}
              height={28}
              width={10}
              x={x - 5}
              y={48 - itemIndex * 4}
              stroke="currentColor"
            />
          </g>
        ))}
      </svg>
    );
  }

  if (name === "XTopicMonitor") {
    return (
      <svg
        aria-hidden="true"
        className="size-full"
        fill="none"
        viewBox="0 0 190 120"
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <path
            d={`M20 ${24 + row * 17}c24 18 38 18 58 0s35-18 58 0 34 18 52 0`}
            key={row}
            stroke="currentColor"
            strokeDasharray={row === 2 ? "0" : "2 5"}
            strokeWidth={row === 2 ? "1.4" : "1"}
          />
        ))}
        {[48, 94, 151].map((x) => (
          <circle cx={x} cy={63} fill="currentColor" key={x} r="3" />
        ))}
      </svg>
    );
  }

  if (name === "FocusBox") {
    return (
      <svg
        aria-hidden="true"
        className="size-full"
        fill="none"
        viewBox="0 0 190 120"
      >
        {[32, 76, 120, 164].map((x) => (
          <path
            d={`M${x} 18v84`}
            key={x}
            stroke="currentColor"
            strokeDasharray="2 5"
          />
        ))}
        {[28, 62, 96].map((y) => (
          <path
            d={`M18 ${y}h162`}
            key={y}
            stroke="currentColor"
            strokeDasharray="2 5"
          />
        ))}
        {[
          [32, 28],
          [76, 62],
          [120, 28],
          [164, 96],
          [76, 96],
          [120, 62],
        ].map(([x, y], itemIndex) => (
          <rect
            fill={itemIndex === 2 ? "currentColor" : "none"}
            height="10"
            key={`${x}-${y}`}
            stroke="currentColor"
            width="10"
            x={x - 5}
            y={y - 5}
          />
        ))}
        <path
          d="M32 28 76 62 120 28 164 96 76 96 120 62"
          stroke="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-full"
      fill="none"
      viewBox="0 0 190 120"
    >
      <circle cx="95" cy="60" r="12" fill="currentColor" />
      {[0, 1, 2, 3, 4, 5, 6].map((item) => {
        const angle = (item / 7) * Math.PI * 2;
        const x = 95 + Math.cos(angle) * 48;
        const y = 60 + Math.sin(angle) * 40;

        return (
          <g key={item}>
            <path
              d={`M95 60 ${x} ${y}`}
              stroke="currentColor"
              strokeDasharray="2 5"
            />
            <circle
              cx={x}
              cy={y}
              fill={item === 2 ? "currentColor" : "none"}
              r="5"
              stroke="currentColor"
            />
          </g>
        );
      })}
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 16 16"
    >
      {direction === "previous" ? (
        <path
          d="M13 8H4m0 0 3-3M4 8l3 3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      ) : (
        <path
          d="M3 8h9m0 0-3-3m3 3-3 3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      )}
    </svg>
  );
}

function ProjectCard({
  index,
  isActive,
  onSelect,
  position,
  project,
}: VisibleProject & {
  isActive: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <article
      className={cx(
        "relative flex min-h-[22rem] overflow-hidden border bg-surface/55 text-text transition-colors duration-200",
        "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-strong",
        position === "previous" && "order-2 lg:order-1",
        position === "active" && "order-1 lg:order-2",
        position === "next" && "order-3",
        isActive
          ? "z-10 min-h-[27rem] border-line bg-surface/80 lg:min-h-[31rem]"
          : "border-line/40 hover:bg-surface/70 lg:min-h-[27rem]",
      )}
      data-flip-id={project.name}
      data-project-card
      data-project-position={position}
    >
      {!isActive ? (
        <button
          aria-label={`Show ${project.name} as featured project`}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
          onClick={() => onSelect(index)}
          type="button"
        />
      ) : null}
      <div className="flex w-full flex-col">
        <div className={cx("h-1.5", isActive ? "bg-text" : "bg-accent")} />
        <div
          className={cx(
            "flex grow flex-col p-5 md:p-6",
            isActive ? "lg:p-7" : "lg:p-6",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-sm text-text-soft">
              {formatNumber(index + 1)}
            </p>
            <p className="rule-label max-w-[9.5rem] text-right text-text-soft">
              {project.category}
            </p>
          </div>
          <div className={cx("mt-7", !isActive && "lg:mt-6")}>
            <h3
              className={cx(
                "font-semibold leading-tight text-text",
                isActive ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
              )}
            >
              {project.name}
            </h3>
            <p
              className={cx(
                "mt-4 overflow-hidden text-sm leading-6 text-text-soft md:max-h-none",
                isActive
                  ? "max-h-none text-base leading-7"
                  : "max-h-24",
              )}
            >
              {project.description}
            </p>
          </div>
          <div
            className={cx(
              "mx-auto mt-7 w-full max-w-[15rem] text-text/70",
              isActive ? "h-36 md:h-44" : "h-28 md:h-36",
            )}
          >
            <ProjectFigure name={project.name} />
          </div>
          <div className="mt-auto pt-7">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase text-muted">
              <span>{project.status}</span>
              {isActive && project.href ? (
                <a
                  aria-label={`Open ${project.name} on GitHub`}
                  className="relative z-20 inline-flex items-center gap-2 text-text transition duration-200 hover:text-accent-strong focus:outline-none focus-visible:underline"
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open GitHub
                  <ArrowIcon direction="next" />
                </a>
              ) : null}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase text-muted">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectCardSwitcher({ projects }: ProjectCardSwitcherProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const projectCount = projects.length;

  const visibleProjects = useMemo<VisibleProject[]>(() => {
    if (projectCount === 0) {
      return [];
    }

    return visiblePositions.map(({ offset, position }) => {
      const index = wrapIndex(activeIndex + offset, projectCount);

      return {
        index,
        position,
        project: projects[index],
      };
    });
  }, [activeIndex, projectCount, projects]);

  const { contextSafe } = useGSAP(
    () => {
      const state = flipStateRef.current;

      if (!state || !rootRef.current) {
        return;
      }

      flipStateRef.current = null;

      const cards = rootRef.current.querySelectorAll("[data-project-card]");

      Flip.from(state, {
        absolute: true,
        duration: 0.55,
        ease: "power3.inOut",
        fade: true,
        nested: true,
        prune: true,
        stagger: {
          each: 0.03,
          from: "center",
        },
        targets: cards,
        zIndex: 10,
      });
    },
    { dependencies: [activeIndex], scope: rootRef },
  );

  const switchToIndex = contextSafe((nextIndex: number) => {
    if (projectCount === 0) {
      return;
    }

    const normalizedIndex = wrapIndex(nextIndex, projectCount);

    if (normalizedIndex === activeIndex) {
      return;
    }

    const root = rootRef.current;
    const cards = root?.querySelectorAll("[data-project-card]");

    if (root && cards && cards.length > 0 && !shouldReduceMotion()) {
      Flip.killFlipsOf(cards, true);
      flipStateRef.current = Flip.getState(cards, {
        props: "backgroundColor,borderColor,color",
      });
    } else {
      flipStateRef.current = null;
    }

    setActiveIndex(normalizedIndex);
  });

  if (projectCount === 0) {
    return null;
  }

  const activeProject = projects[activeIndex];

  return (
    <div
      className="mt-10 border border-line/55 bg-background-alt"
      data-motion="card"
      ref={rootRef}
    >
      <div className="flex flex-col gap-5 border-b border-line/45 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="rule-label text-muted">Card set</p>
          <p className="mt-2 text-sm text-text-soft">
            Showing 3 of {formatNumber(projectCount)} projects
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p
            aria-live="polite"
            className="font-mono text-xs uppercase text-text-soft"
          >
            {formatNumber(activeIndex + 1)} / {formatNumber(projectCount)}
            <span className="ml-3 text-muted">{activeProject.name}</span>
          </p>
          <div
            aria-label="Project switcher controls"
            className="flex items-center"
            role="group"
          >
            <button
              aria-label="Show previous project"
              className="grid size-10 place-items-center border border-line/55 text-text transition duration-200 hover:bg-surface focus:outline-none focus-visible:bg-accent"
              onClick={() => switchToIndex(activeIndex - 1)}
              type="button"
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              aria-label="Show next project"
              className="-ml-px grid size-10 place-items-center border border-line/55 bg-text text-background transition duration-200 hover:bg-text-soft focus:outline-none focus-visible:bg-accent focus-visible:text-text"
              onClick={() => switchToIndex(activeIndex + 1)}
              type="button"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-0 p-4 md:p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.16fr)_minmax(0,0.92fr)]">
        {visibleProjects.map(({ index, position, project }) => (
          <ProjectCard
            index={index}
            isActive={position === "active"}
            key={project.name}
            onSelect={switchToIndex}
            position={position}
            project={project}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-line/45 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div
          aria-label="Choose featured project"
          className="flex items-center gap-2"
        >
          {projects.map((project, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Show ${project.name}`}
              className={cx(
                "h-2.5 w-7 border border-line/55 transition duration-200 focus:outline-none focus-visible:bg-accent",
                index === activeIndex
                  ? "bg-text"
                  : "bg-transparent hover:bg-surface",
              )}
              key={project.name}
              onClick={() => switchToIndex(index)}
              type="button"
            />
          ))}
        </div>
        <p className="rule-label text-muted">
          Click a side card or switch the set
        </p>
      </div>
    </div>
  );
}
