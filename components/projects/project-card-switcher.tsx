"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { projects as siteProjects } from "@/lib/content";

gsap.registerPlugin(useGSAP, Flip, Observer);

type Project = (typeof siteProjects)[number];
type CardPosition = "previous" | "active" | "next";
type SwitchDirection = "previous" | "next";
type SwitchIntent =
  | "button"
  | "dot"
  | "keyboard"
  | "side-card"
  | "swipe";

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

function inferDirection(
  currentIndex: number,
  nextIndex: number,
  total: number,
  intent: SwitchIntent,
): SwitchDirection {
  if (intent === "keyboard" || intent === "button" || intent === "swipe") {
    return wrapIndex(nextIndex - currentIndex, total) > total / 2
      ? "previous"
      : "next";
  }

  const forwardDistance = wrapIndex(nextIndex - currentIndex, total);

  return forwardDistance > total / 2 ? "previous" : "next";
}

function animateActiveProject(root: HTMLElement, direction: SwitchDirection) {
  const activeCard = root.querySelector<HTMLElement>(
    '[data-project-position="active"]',
  );
  const timeline = gsap.timeline();

  if (!activeCard) {
    return timeline;
  }

  const contentItems = [
    activeCard.querySelector("[data-project-title]"),
    activeCard.querySelector("[data-project-copy]"),
    activeCard.querySelector("[data-project-figure]"),
    activeCard.querySelector("[data-project-meta]"),
  ].filter(Boolean);
  const y = direction === "next" ? 12 : -12;

  timeline.fromTo(
    contentItems,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      clearProps: "opacity,visibility,transform",
      duration: 0.42,
      ease: "power3.out",
      stagger: 0.055,
      y: 0,
    },
    0.08,
  );

  const figure = activeCard.querySelector("[data-project-figure]");
  const strokeElements = gsap.utils
    .toArray<SVGGeometryElement>(
      figure?.querySelectorAll<SVGGeometryElement>(
        "path,line,rect,circle,polyline,polygon",
      ) ?? [],
    )
    .filter((element) => {
      if (typeof element.getTotalLength !== "function") {
        return false;
      }

      try {
        return element.getTotalLength() > 0;
      } catch {
        return false;
      }
    });
  const pointElements = gsap.utils.toArray<SVGElement>(
    figure?.querySelectorAll<SVGElement>("circle,rect") ?? [],
  );

  strokeElements.forEach((element) => {
    const length = Math.max(1, element.getTotalLength());

    gsap.set(element, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
  });

  if (strokeElements.length > 0) {
    timeline.to(
      strokeElements,
      {
        clearProps: "strokeDasharray,strokeDashoffset",
        duration: 0.58,
        ease: "power2.out",
        stagger: 0.018,
        strokeDashoffset: 0,
      },
      0.12,
    );
  }

  if (pointElements.length > 0) {
    timeline.fromTo(
      pointElements,
      { autoAlpha: 0.45, scale: 0.84, transformOrigin: "50% 50%" },
      {
        autoAlpha: 1,
        clearProps: "opacity,visibility,transform",
        duration: 0.34,
        ease: "power2.out",
        scale: 1,
        stagger: 0.026,
      },
      0.18,
    );
  }

  return timeline;
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
  isSwitching,
  onSelect,
  position,
  project,
}: VisibleProject & {
  isActive: boolean;
  isSwitching: boolean;
  onSelect: (index: number, intent: SwitchIntent) => void;
}) {
  const hintDirection = position === "previous" ? "previous" : "next";
  const slotClass =
    position === "active"
      ? "left-4 right-4 top-4 z-20 h-[31.5rem] md:left-5 md:right-5 md:top-5 md:h-[32rem] lg:left-[30.5%] lg:right-auto lg:bottom-5 lg:top-5 lg:h-auto lg:w-[39%]"
      : position === "previous"
        ? "left-4 right-4 top-[34rem] z-10 h-[8.75rem] md:left-5 md:right-5 md:top-[35rem] md:h-36 lg:left-5 lg:right-auto lg:bottom-5 lg:top-5 lg:h-auto lg:w-[30.5%]"
        : "bottom-4 left-4 right-4 z-10 h-[8.75rem] md:bottom-5 md:left-5 md:right-5 md:h-36 lg:left-auto lg:right-5 lg:bottom-5 lg:top-5 lg:h-auto lg:w-[30.5%]";

  return (
    <article
      className={cx(
        "group/project-card absolute flex overflow-hidden border bg-surface/55 text-text transition-colors duration-200",
        "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-strong",
        slotClass,
        isActive
          ? "border-line bg-surface/80"
          : "border-line/40 hover:border-line/70 hover:bg-surface/70",
        isSwitching && "pointer-events-none",
      )}
      data-flip-id={project.name}
      data-project-card
      data-project-position={position}
    >
      {!isActive ? (
        <button
          aria-label={`Show ${project.name} as featured project`}
          aria-disabled={isSwitching}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none disabled:cursor-wait"
          disabled={isSwitching}
          onClick={() => onSelect(index, "side-card")}
          type="button"
        />
      ) : null}
      <div className="flex h-full w-full flex-col">
        <div
          className={cx(
            "h-1.5 transition-colors duration-200",
            isActive
              ? "bg-text"
              : "bg-accent/70 group-hover/project-card:bg-accent group-focus-within/project-card:bg-accent",
          )}
        />
        <div
          className={cx(
            "flex min-h-0 grow flex-col p-5 transition-transform duration-200 md:p-6",
            isActive ? "lg:p-7" : "lg:p-6",
            !isActive &&
              "group-hover/project-card:-translate-y-1 group-focus-within/project-card:-translate-y-1",
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
                "flex items-center gap-2 font-semibold leading-tight text-text",
                isActive ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
              )}
              data-project-title
            >
              <span>{project.name}</span>
              {!isActive ? (
                <span
                  aria-hidden="true"
                  className="inline-grid size-6 translate-x-[-0.25rem] place-items-center text-accent opacity-0 transition duration-200 group-hover/project-card:translate-x-0 group-hover/project-card:opacity-100 group-focus-within/project-card:translate-x-0 group-focus-within/project-card:opacity-100"
                >
                  <ArrowIcon direction={hintDirection} />
                </span>
              ) : null}
            </h3>
            <p
              className={cx(
                "mt-4 overflow-hidden text-sm leading-6 text-text-soft md:max-h-none",
                isActive
                  ? "max-h-none text-base leading-7"
                  : "hidden max-h-24 lg:block",
              )}
              data-project-copy
            >
              {project.description}
            </p>
          </div>
          <div
            className={cx(
              "mx-auto mt-7 w-full max-w-[15rem] text-text/70",
              isActive
                ? "h-36 md:h-44"
                : "hidden h-28 md:h-36 lg:block",
            )}
            data-project-figure
          >
            <ProjectFigure name={project.name} />
          </div>
          {!isActive ? (
            <p className="mt-auto pt-5 rule-label text-muted lg:hidden">
              {project.status}
            </p>
          ) : null}
          <div
            className={cx("mt-auto pt-7", !isActive && "hidden lg:block")}
            data-project-meta
          >
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
  const stageRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const activeIndexRef = useRef(0);
  const directionRef = useRef<SwitchDirection>("next");
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<SwitchDirection>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastInteraction, setLastInteraction] =
    useState<SwitchIntent>("button");
  const projectCount = projects.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

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

  useGSAP(
    (_context, makeContextSafe) => {
      const state = flipStateRef.current;

      if (!state || !stageRef.current) {
        return;
      }

      flipStateRef.current = null;

      const stage = stageRef.current;
      const cards = stage.querySelectorAll("[data-project-card]");
      const finishAnimation = makeContextSafe
        ? makeContextSafe(() => {
            isAnimatingRef.current = false;
            setIsAnimating(false);
          })
        : () => {
            isAnimatingRef.current = false;
            setIsAnimating(false);
          };

      const flipTimeline = Flip.from(state, {
        absolute: false,
        duration: 0.46,
        ease: "power2.inOut",
        fade: true,
        nested: true,
        prune: true,
        scale: true,
        stagger: {
          each: 0.03,
          from: "center",
        },
        targets: cards,
        zIndex: 10,
      });

      flipTimeline.add(animateActiveProject(stage, directionRef.current), 0.08);
      flipTimeline.eventCallback("onComplete", finishAnimation);

      return () => {
        flipTimeline.kill();
      };
    },
    { dependencies: [activeIndex], scope: rootRef },
  );

  const switchToIndex = useCallback(
    (nextIndex: number, intent: SwitchIntent = "button") => {
      if (projectCount === 0) {
        return;
      }

      const normalizedIndex = wrapIndex(nextIndex, projectCount);
      const currentIndex = activeIndexRef.current;

      if (normalizedIndex === currentIndex) {
        return;
      }

      const reduceMotion = shouldReduceMotion();

      if (isAnimatingRef.current && !reduceMotion) {
        return;
      }

      const nextDirection = inferDirection(
        currentIndex,
        normalizedIndex,
        projectCount,
        intent,
      );
      const stage = stageRef.current;
      const cards = stage?.querySelectorAll("[data-project-card]");

      directionRef.current = nextDirection;
      activeIndexRef.current = normalizedIndex;
      setDirection(nextDirection);
      setLastInteraction(intent);

      if (stage && cards && cards.length > 0 && !reduceMotion) {
        Flip.killFlipsOf(cards, true);
        flipStateRef.current = Flip.getState(cards, {
          props: "backgroundColor,borderColor,color",
        });
        isAnimatingRef.current = true;
        setIsAnimating(true);
      } else {
        flipStateRef.current = null;
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }

      setActiveIndex(normalizedIndex);
    },
    [projectCount],
  );

  useGSAP(
    (_context, makeContextSafe) => {
      const stage = stageRef.current;

      if (!stage || projectCount === 0) {
        return;
      }

      const media = gsap.matchMedia();
      const showNext = makeContextSafe
        ? makeContextSafe(() => {
            switchToIndex(activeIndexRef.current + 1, "swipe");
          })
        : () => {
            switchToIndex(activeIndexRef.current + 1, "swipe");
          };
      const showPrevious = makeContextSafe
        ? makeContextSafe(() => {
            switchToIndex(activeIndexRef.current - 1, "swipe");
          })
        : () => {
            switchToIndex(activeIndexRef.current - 1, "swipe");
          };

      media.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const observer = Observer.create({
            allowClicks: true,
            dragMinimum: 16,
            ignore: "button,a",
            lockAxis: true,
            onLeft: showNext,
            onRight: showPrevious,
            preventDefault: false,
            target: stage,
            tolerance: 24,
            type: "touch,pointer",
          });

          return () => {
            observer.kill();
          };
        },
      );

      return () => {
        media.revert();
      };
    },
    { dependencies: [projectCount], scope: rootRef },
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (projectCount === 0) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      switchToIndex(activeIndexRef.current - 1, "keyboard");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      switchToIndex(activeIndexRef.current + 1, "keyboard");
    }
  };

  if (projectCount === 0) {
    return null;
  }

  const activeProject = projects[activeIndex];

  return (
    <div
      aria-busy={isAnimating}
      aria-label="Projects card switcher"
      className="mt-10 border border-line/55 bg-background-alt focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
      data-last-interaction={lastInteraction}
      data-motion="card"
      data-project-direction={direction}
      onKeyDown={handleKeyDown}
      ref={rootRef}
      role="region"
      tabIndex={0}
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
              aria-disabled={isAnimating}
              aria-label="Show previous project"
              className="grid size-10 place-items-center border border-line/55 text-text transition duration-200 hover:bg-surface focus:outline-none focus-visible:bg-accent disabled:cursor-wait disabled:opacity-45"
              disabled={isAnimating}
              onClick={() => switchToIndex(activeIndex - 1, "button")}
              type="button"
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              aria-disabled={isAnimating}
              aria-label="Show next project"
              className="-ml-px grid size-10 place-items-center border border-line/55 bg-text text-background transition duration-200 hover:bg-text-soft focus:outline-none focus-visible:bg-accent focus-visible:text-text disabled:cursor-wait disabled:opacity-45"
              disabled={isAnimating}
              onClick={() => switchToIndex(activeIndex + 1, "button")}
              type="button"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="relative h-[53rem] overflow-hidden [touch-action:pan-y] md:h-[55rem] lg:h-[36.5rem]"
        data-project-stage
        ref={stageRef}
      >
        {visibleProjects.map(({ index, position, project }) => (
          <ProjectCard
            index={index}
            isActive={position === "active"}
            isSwitching={isAnimating}
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
              aria-disabled={isAnimating}
              aria-label={`Show ${project.name}`}
              className={cx(
                "h-2.5 border border-line/55 transition duration-200 focus:outline-none focus-visible:bg-accent disabled:cursor-wait disabled:opacity-45",
                index === activeIndex
                  ? "w-10 bg-text"
                  : "w-6 bg-transparent hover:bg-surface",
              )}
              disabled={isAnimating}
              key={project.name}
              onClick={() => switchToIndex(index, "dot")}
              type="button"
            />
          ))}
        </div>
        <p aria-live="polite" className="rule-label text-muted">
          Active / <span className="text-text-soft">{activeProject.name}</span>
        </p>
      </div>
    </div>
  );
}
