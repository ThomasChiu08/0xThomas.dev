"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type MotionRootProps = {
  children: ReactNode;
};

export function MotionRoot({ children }: MotionRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;

        if (!root) {
          return;
        }

        const q = gsap.utils.selector(root);
        const targets = (selector: string) =>
          gsap.utils.toArray<HTMLElement | SVGElement>(q(selector));
        const systemLinks = gsap.utils.toArray<SVGPathElement>(
          q('[data-motion="system-link"]'),
        );

        systemLinks.forEach((path) => {
          const length = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
        });
        const fromTo = (
          selector: string,
          fromVars: gsap.TweenVars,
          toVars: gsap.TweenVars,
          position: gsap.Position,
        ) => {
          const elements = targets(selector);

          if (elements.length > 0) {
            heroTimeline.fromTo(elements, fromVars, toVars, position);
          }
        };

        fromTo(
          '[data-motion="site-header"]',
          { autoAlpha: 0, y: -18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0,
        );
        fromTo(
          '[data-motion="hero-title"]',
          { autoAlpha: 0, y: 42 },
          { autoAlpha: 1, y: 0 },
          0.12,
        );
        fromTo(
          '[data-motion="hero-copy"]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, stagger: 0.12 },
          0.28,
        );
        fromTo(
          '[data-motion="hero-action"]',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6 },
          0.48,
        );
        fromTo(
          '[data-motion="system-map"]',
          { autoAlpha: 0, scale: 0.97, y: 32 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.85 },
          0.28,
        );

        if (systemLinks.length > 0) {
          heroTimeline.to(
            systemLinks,
            {
              strokeDashoffset: 0,
              duration: 1.05,
              ease: "power2.inOut",
              stagger: 0.07,
            },
            0.76,
          );
        }

        fromTo(
          '[data-motion="system-node"]',
          { autoAlpha: 0, scale: 0.96, y: 16 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.07,
          },
          0.84,
        );
        fromTo(
          '[data-motion="system-progress"]',
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.85, ease: "power2.out" },
          1.1,
        );

        const revealTargets = gsap.utils.toArray<HTMLElement>(
          q(
            [
              '[data-motion="section-heading"]',
              '[data-motion="card"]',
              '[data-motion="principle"]',
              '[data-motion="contact-card"]',
              '[data-motion="contact-link"]',
            ].join(","),
          ),
        );

        if (revealTargets.length === 0) {
          return;
        }

        gsap.set(revealTargets, { autoAlpha: 0, y: 34 });

        ScrollTrigger.batch(revealTargets, {
          batchMax: 6,
          interval: 0.08,
          once: true,
          start: "top 84%",
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.68,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            });
          },
        });

        const heroSection = targets('[data-motion="hero-section"]')[0];
        const pageGrids = targets('[data-motion="hero-grid"]');

        if (heroSection && pageGrids.length > 0) {
          gsap.to(pageGrids, {
            y: 42,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
