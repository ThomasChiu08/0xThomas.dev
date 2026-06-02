import { HeroSystemMap } from "@/components/hero-system-map";
import { MotionRoot } from "@/components/motion/motion-root";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import {
  contactLinks,
  identities,
  noteTopics,
  principles,
  projects,
} from "@/lib/content";

const projectTags = [
  ["TS", "NEXT.JS", "PYTHON", "REDIS"],
  ["PYTHON", "CLICKHOUSE", "WEBSOCKETS"],
  ["NEXT.JS", "TAILWIND", "LOCAL-FIRST"],
  ["PYTHON", "AIRFLOW", "DBT", "SNOWFLAKE"],
] as const;

const identityFacts = [
  ["Location", "Global"],
  ["Focus", "Systems"],
  ["Mode", "Build"],
  ["Timezone", "UTC"],
] as const;

function HeroIndex() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-24 hidden w-16 font-mono text-[11px] leading-[3.35rem] text-muted lg:block"
    >
      {["001", "002", "003", "004", "005", "006", "007"].map((item) => (
        <div className="flex items-center gap-3" key={item}>
          <span className="h-px w-6 border-t border-dashed border-line/30" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectFigure({ index }: { index: number }) {
  if (index === 1) {
    return (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 190 120">
        <path
          d="M17 82c38-42 106-54 153-16"
          stroke="currentColor"
          strokeDasharray="2 5"
          strokeWidth="1"
        />
        {[30, 66, 104, 139, 166].map((x, itemIndex) => (
          <g key={x}>
            <path d={`M${x} ${26 + itemIndex * 7}v62`} stroke="currentColor" />
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

  if (index === 2) {
    return (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 190 120">
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

  if (index === 3) {
    return (
      <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 190 120">
        {[32, 76, 120, 164].map((x) => (
          <path d={`M${x} 18v84`} key={x} stroke="currentColor" strokeDasharray="2 5" />
        ))}
        {[28, 62, 96].map((y) => (
          <path d={`M18 ${y}h162`} key={y} stroke="currentColor" strokeDasharray="2 5" />
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
        <path d="M32 28 76 62 120 28 164 96 76 96 120 62" stroke="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-full" fill="none" viewBox="0 0 190 120">
      <circle cx="95" cy="60" r="12" fill="currentColor" />
      {[0, 1, 2, 3, 4, 5, 6].map((item) => {
        const angle = (item / 7) * Math.PI * 2;
        const x = 95 + Math.cos(angle) * 48;
        const y = 60 + Math.sin(angle) * 40;

        return (
          <g key={item}>
            <path d={`M95 60 ${x} ${y}`} stroke="currentColor" strokeDasharray="2 5" />
            <circle cx={x} cy={y} fill={item === 2 ? "currentColor" : "none"} r="5" stroke="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Home() {
  return (
    <MotionRoot>
      <SiteHeader />
      <main>
        <section
          className="relative overflow-hidden border-b border-line/55 bg-background"
          data-motion="hero-section"
          id="home"
        >
          <div
            className="absolute inset-0 page-grid opacity-70"
            data-motion="hero-grid"
          />
          <HeroIndex />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-14 md:px-8 md:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:pb-16">
            <div className="flex min-h-[34rem] flex-col justify-center lg:min-h-[43rem]">
              <h1
                className="font-[var(--font-display)] text-7xl font-normal leading-none tracking-normal text-text sm:text-8xl md:text-9xl lg:text-[10rem]"
                data-motion="hero-title"
              >
                Thomas
              </h1>
              <p
                className="mt-8 max-w-xl text-balance text-xl leading-tight text-text-soft md:text-2xl"
                data-motion="hero-copy"
              >
                Building systems for AI, finance, and focus.
              </p>
              <div className="mt-5 h-1 w-full max-w-md bg-accent" />
              <p
                className="mt-8 max-w-lg text-pretty text-base leading-8 text-text-soft"
                data-motion="hero-copy"
              >
                I&apos;m Thomas, also known as 0xThomas. I build tools,
                research systems, and products across AI, markets, crypto, and
                personal operating systems.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink data-motion="hero-action" href="#projects">
                  View Projects
                </ButtonLink>
                <ButtonLink
                  data-motion="hero-action"
                  href="#notes"
                  variant="secondary"
                >
                  Read Notes
                </ButtonLink>
              </div>
              <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line/55 pt-5 font-mono text-[11px] text-text-soft">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent" />
                  System Status
                </span>
                <span>All systems operational</span>
              </div>
            </div>
            <HeroSystemMap />
          </div>
        </section>

        <section className="section-shell" id="about">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              title="Identity"
              description="A practical mix of building, research, market feedback, software craft, and systems thinking."
            />
            <div className="mt-10 grid gap-8 border-y border-line/55 py-9 md:grid-cols-[0.95fr_1.55fr]">
              <p className="max-w-sm text-sm leading-7 text-text-soft">
                Builder and researcher operating at the intersection of AI,
                finance, crypto, and human performance.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {identityFacts.map(([label, value]) => (
                  <div
                    className="border-l border-line/35 pl-5"
                    data-motion="card"
                    key={label}
                  >
                    <p className="rule-label text-muted">{label}</p>
                    <p className="mt-4 text-sm font-medium text-text">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {identities.map((identity, index) => (
                <article
                  className="border-l border-line/40 pl-4"
                  data-motion="card"
                  key={identity.title}
                >
                  <p className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-base font-semibold text-text">
                    {identity.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {identity.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell bg-background-alt" id="projects">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                title="Projects"
                description="Early systems and product experiments designed to become useful, observable, and compounding over time."
              />
              <a
                className="rule-label inline-flex items-center gap-3 text-text transition duration-200 hover:text-muted"
                href="#contact"
              >
                View all projects
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 8h9m0 0-3-3m3 3-3 3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-10 grid border border-line/55 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  className="grid min-h-[17rem] gap-8 border-b border-line/55 p-6 md:grid-cols-[0.72fr_1fr] md:p-8 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
                  data-motion="card"
                  key={project.name}
                >
                  <div>
                    <div className="flex items-start gap-5">
                      <p className="font-mono text-sm text-text-soft">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h3 className="text-xl font-semibold text-text">
                          {project.name}
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-text-soft">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase text-muted">
                      {projectTags[index].map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <p className="rule-label text-right text-text-soft">
                      {project.category}
                    </p>
                    <div className="h-32 text-text/70 md:h-40">
                      <ProjectFigure index={index} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell" id="notes">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                title="Research & Notes"
                description="A future library for public thinking, market observations, AI agent research, and product notes."
              />
              <a
                className="rule-label inline-flex items-center gap-3 text-text transition duration-200 hover:text-muted"
                href="#contact"
              >
                Browse all notes
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 8h9m0 0-3-3m3 3-3 3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-10 border border-line/55">
              {noteTopics.map((topic, index) => (
                <article
                  className="grid gap-4 border-b border-line/35 px-5 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_10rem]"
                  data-motion="card"
                  key={topic.title}
                >
                  <p className="font-mono text-sm text-text-soft">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="text-sm font-medium text-text">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {topic.description}
                    </p>
                  </div>
                  <p className="rule-label self-start text-muted md:text-right">
                    {topic.title.split(" ")[0]}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-muted">
              / Notes on systems, markets, and behavior.
            </p>
          </div>
        </section>

        <section className="section-shell bg-background-alt">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading title="Principles" />
            <ol className="mt-10 grid gap-8 md:grid-cols-5 md:gap-0">
              {principles.map((principle, index) => (
                <li
                  className="border-l border-line/40 pl-5 md:pr-6"
                  data-motion="principle"
                  key={principle}
                >
                  <span className="font-mono text-xs text-text-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-6 text-sm font-medium leading-6 text-text">
                    {principle}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-shell" id="contact">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading title="Contact" />
            <div
              className="mt-10 grid gap-10 border-y border-line/55 py-10 md:grid-cols-[0.85fr_1fr_0.8fr]"
              data-motion="contact-card"
            >
              <p className="max-w-xs text-sm leading-7 text-text-soft">
                Let&apos;s build, research, or exchange ideas.
              </p>
              <div className="grid gap-3">
                {contactLinks.map((link) => (
                  <a
                    className="grid grid-cols-[1.5rem_1fr] items-center gap-3 text-sm text-text transition duration-200 hover:text-muted"
                    data-motion="contact-link"
                    href={link.href}
                    key={link.label}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    <span className="font-mono text-xs text-muted">
                      {link.label.slice(0, 1)}
                    </span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-col justify-between gap-8">
                <p className="text-balance text-xl leading-snug text-text md:text-2xl">
                  Open to projects, research collaborations, and meaningful
                  conversations.
                </p>
                <ButtonLink href="mailto:hello@0xthomas.dev">
                  Start a Conversation
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </MotionRoot>
  );
}
