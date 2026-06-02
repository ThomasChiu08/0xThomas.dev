const mapNodes = [
  { label: "Agents", className: "left-[18%] top-[22%]" },
  { label: "Markets", className: "right-[12%] top-[27%]" },
  { label: "Data", className: "left-[22%] bottom-[28%]" },
  { label: "Focus", className: "right-[20%] bottom-[20%]" },
] as const;

const contourPaths = Array.from({ length: 24 }, (_, index) => {
  const offset = index * 5.4;
  const start = 70 + offset;
  const controlA = 160 + index * 2;
  const controlB = 315 - index * 3;
  const end = 476 - offset * 0.66;

  return `M${start} ${342 - index * 2.7} C${controlA} ${96 + index * 0.8} ${controlB} ${88 + index * 5.8} ${end} ${168 + index * 5.1} C${410 - index * 3.2} ${308 + index * 4.2} ${215 + index * 4.1} ${366 - index * 1.5} ${start + 24} ${342 - index * 2.7}`;
});

export function HeroSystemMap() {
  return (
    <div
      className="relative min-h-[28rem] overflow-hidden border-t border-line/45 pt-8 lg:min-h-[40rem] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
      data-motion="system-map"
    >
      <div className="absolute inset-0 paper-noise opacity-35 mix-blend-multiply" />
      <div className="absolute left-4 top-5 hidden font-mono text-[11px] leading-5 text-muted lg:block">
        <p>fig. 2</p>
        <p className="mt-5 uppercase text-text">agent</p>
        <p className="uppercase text-text">topology</p>
        <p className="uppercase text-text">map</p>
      </div>
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-6 mx-auto h-[24rem] w-full max-w-[42rem] text-text lg:top-8 lg:h-[37rem]"
        fill="none"
        viewBox="0 0 560 520"
      >
        <g opacity="0.18">
          {Array.from({ length: 14 }, (_, index) => (
            <path
              d={`M${114 + index * 24} 56v405`}
              key={`v-${index}`}
              stroke="currentColor"
              strokeDasharray="2 8"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 10 }, (_, index) => (
            <path
              d={`M80 ${96 + index * 38}h432`}
              key={`h-${index}`}
              stroke="currentColor"
              strokeDasharray="2 8"
              strokeWidth="1"
            />
          ))}
        </g>
        <g opacity="0.34">
          {contourPaths.map((path, index) => (
            <path
              d={path}
              data-motion="system-link"
              key={path}
              stroke="currentColor"
              strokeWidth={index % 5 === 0 ? "1.2" : "0.8"}
            />
          ))}
        </g>
        <path
          d="M124 370 C205 292 235 234 290 258 C358 291 342 384 468 416"
          data-motion="system-link"
          stroke="currentColor"
          strokeDasharray="5 9"
          strokeWidth="1.4"
        />
        <path
          d="M126 222 C199 130 304 128 371 185 C433 238 433 330 357 385"
          data-motion="system-link"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <g fill="currentColor">
          {[
            [126, 222],
            [184, 312],
            [234, 154],
            [290, 258],
            [357, 385],
            [371, 185],
            [468, 416],
            [482, 144],
            [98, 356],
            [312, 88],
          ].map(([cx, cy]) => (
            <circle
              cx={cx}
              cy={cy}
              data-motion="system-node"
              key={`${cx}-${cy}`}
              r="3.2"
            />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth="1.2">
          <path d="M492 77h16M500 69v16" />
          <path d="M78 172h10M83 167v10" />
          <path d="M433 308h10M438 303v10" />
          <rect height="7" width="7" x="110" y="408" />
          <rect height="5" width="5" x="448" y="110" />
        </g>
        <path
          d="M300 246h42"
          data-motion="system-progress"
          stroke="var(--color-accent)"
          strokeLinecap="square"
          strokeWidth="8"
        />
      </svg>

      {mapNodes.map((node) => (
        <div
          className={`absolute hidden ${node.className} lg:block`}
          data-motion="system-node"
          key={node.label}
        >
          <span className="rule-label border-b border-line/45 pb-1 text-text">
            {node.label}
          </span>
        </div>
      ))}

      <div className="absolute bottom-2 right-0 hidden w-64 font-mono text-[11px] leading-5 text-text-soft lg:block">
        {[
          ["AGENTS", "128"],
          ["MARKETS", "24"],
          ["DATA PIPELINES", "36"],
          ["EXECUTIONS", "91"],
        ].map(([label, value]) => (
          <div className="grid grid-cols-[1fr_auto] gap-3" key={label}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
