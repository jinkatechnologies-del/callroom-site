/**
 * Night sky background: stars and a soft crescent moon.
 * Pure SVG so it stays crisp at any screen size.
 */
export default function SkyBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <defs>
          <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1024" />
            <stop offset="55%" stopColor="#060810" />
            <stop offset="100%" stopColor="#060810" />
          </linearGradient>
        </defs>

        <rect width="1200" height="700" fill="url(#sky-fade)" />

        {/* Stars. The headline sits centered near the top, so the band
            x 220-980 / y 0-320 is deliberately kept empty: on a phone the
            SVG slices to roughly that center strip, and any star there
            lands right beside the words. */}
        <g fill="#EDF2FF">
          <circle cx="70" cy="80" r="2" opacity="0.5" />
          <circle cx="150" cy="210" r="1.5" opacity="0.35" />
          <circle cx="40" cy="300" r="1.5" opacity="0.4" />
          <circle cx="200" cy="350" r="1.5" opacity="0.3" />
          <circle cx="1030" cy="70" r="2" opacity="0.5" />
          <circle cx="1120" cy="180" r="1.5" opacity="0.4" />
          <circle cx="1160" cy="60" r="1.5" opacity="0.35" />
          <circle cx="1015" cy="280" r="1.5" opacity="0.3" />
        </g>

        {/* Moon: single-path crescent, crisp at any size */}
        <path
          d="M150,50 A40,40 0 0,0 150,130 A58,58 0 0,1 150,50 Z"
          fill="#EDF2FF"
          opacity="0.92"
        />
      </svg>
    </div>
  );
}
