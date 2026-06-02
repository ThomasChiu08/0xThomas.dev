"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SystemScanSequenceProps = {
  basePath?: string;
  frameCount?: number;
  extension?: "webp" | "png";
};

const scanLabels = [
  { label: "AI", className: "left-[10%] top-[18%]" },
  { label: "Markets", className: "right-[9%] top-[22%]" },
  { label: "Crypto", className: "left-[12%] bottom-[20%]" },
  { label: "Focus", className: "right-[12%] bottom-[18%]" },
  {
    label: "Systems",
    className: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
] as const;

function getFrameSrc(basePath: string, frame: number, extension: "webp" | "png") {
  return `${basePath}/frame-${String(frame).padStart(3, "0")}.${extension}`;
}

export function SystemScanSequence({
  basePath = "/sequences/system-scan",
  frameCount = 72,
  extension = "webp",
}: SystemScanSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    const image = images[Math.max(0, Math.min(frame, images.length - 1))];

    if (!canvas || !image || !image.complete || !image.naturalWidth) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const canvasRatio = width / height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    let drawWidth = width;
    let drawHeight = height;
    let drawX = 0;
    let drawY = 0;

    if (imageRatio > canvasRatio) {
      drawWidth = height * imageRatio;
      drawX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / imageRatio;
      drawY = (height - drawHeight) / 2;
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      imagesRef.current = [];
      setHasLoadedFrame(false);
      return;
    }

    let cancelled = false;
    let firstFrameDrawn = false;

    const images = Array.from({ length: frameCount }, (_, index) => {
      const image = new Image();

      image.decoding = "async";
      image.src = getFrameSrc(basePath, index, extension);

      return image;
    });

    imagesRef.current = images;

    const framePromises = images.map(
      (image, index) =>
        new Promise<void>((resolve) => {
          const finish = () => {
            if (!cancelled && image.naturalWidth && !firstFrameDrawn) {
              firstFrameDrawn = true;
              setHasLoadedFrame(true);
              drawFrame(index);
            }

            resolve();
          };

          if (image.complete) {
            finish();
            return;
          }

          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
        }),
    );

    Promise.allSettled(framePromises).then(() => {
      if (cancelled) {
        return;
      }

      setHasLoadedFrame(true);
      drawFrame(currentFrameRef.current);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      imagesRef.current = [];
    };
  }, [basePath, drawFrame, extension, frameCount, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const redraw = () => drawFrame(currentFrameRef.current);
    const resizeObserver = new ResizeObserver(redraw);

    resizeObserver.observe(canvas);
    window.addEventListener("resize", redraw);
    redraw();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", redraw);
    };
  }, [drawFrame, prefersReducedMotion]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const section = sectionRef.current;
          const visual = visualRef.current;
          const canvas = canvasRef.current;
          const shouldReduce = context.conditions?.reduce;

          if (!section || !visual || !canvas || shouldReduce) {
            return;
          }

          const isDesktop = Boolean(context.conditions?.isDesktop);
          const q = gsap.utils.selector(section);
          const frameState = { frame: currentFrameRef.current };

          gsap.fromTo(
            q("[data-scan-label]"),
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: visual,
                start: "top 72%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.fromTo(
            q("[data-scan-panel]"),
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: visual,
                start: "top 76%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.to(frameState, {
            frame: frameCount - 1,
            ease: "none",
            snap: { frame: 1 },
            onUpdate: () => {
              currentFrameRef.current = Math.round(frameState.frame);
              drawFrame(currentFrameRef.current);
            },
            scrollTrigger: {
              trigger: visual,
              start: isDesktop ? "top 72px" : "top 78%",
              end: isDesktop ? "+=180%" : "bottom top",
              scrub: isDesktop ? 1.1 : 0.7,
              pin: isDesktop,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { dependencies: [drawFrame, frameCount], scope: sectionRef },
  );

  return (
    <section
      aria-label="System scan: AI, Markets, Crypto, Focus, Systems"
      className="relative overflow-hidden border-b border-line/70 bg-background-alt py-16 md:py-20"
      data-scan-sequence
      ref={sectionRef}
    >
      <div className="absolute inset-0 page-grid opacity-25" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div
          className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-[#060b10] shadow-[0_32px_110px_rgba(0,0,0,0.34)]"
          ref={visualRef}
        >
          <img
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              hasLoadedFrame && !prefersReducedMotion
                ? "opacity-0"
                : "opacity-100"
            }`}
            src={`${basePath}/poster.${extension}`}
          />
          <canvas
            aria-hidden="true"
            className={`absolute inset-0 size-full transition-opacity duration-500 ${
              hasLoadedFrame && !prefersReducedMotion
                ? "opacity-100"
                : "opacity-0"
            }`}
            ref={canvasRef}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,11,16,0.18)_48%,rgba(6,11,16,0.62)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(84,255,147,0.1),transparent_26%,transparent_74%,rgba(55,242,125,0.08))]" />
          {scanLabels.map((item) => (
            <div
              className={`absolute ${item.className}`}
              data-scan-label
              key={item.label}
            >
              <span
                className={`inline-flex rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[0_16px_48px_rgba(0,0,0,0.28)] ${
                  item.label === "Systems"
                    ? "border-accent/60 bg-accent/15 text-accent"
                    : "border-line/80 bg-background/75 text-text-soft"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
          <div
            className="absolute bottom-4 left-4 right-4 grid gap-3 rounded-lg border border-line/80 bg-background/80 p-4 backdrop-blur md:left-auto md:w-[22rem]"
            data-scan-panel
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                signal convergence
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                active
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["AI", "MKT", "CRY", "FOC"].map((label) => (
                <div
                  className="rounded-md border border-line/70 bg-surface/70 px-2 py-2 text-center font-mono text-[10px] text-text-soft"
                  key={label}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
