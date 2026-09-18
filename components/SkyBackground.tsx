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
          <filter id="moon-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        <rect width="1200" height="700" fill="url(#sky-fade)" />

        {/* Stars */}
        <g fill="#EDF2FF">
          <circle cx="120" cy="90" r="2" opacity="0.5" />
          <circle cx="260" cy="150" r="1.5" opacity="0.4" />
          <circle cx="400" cy="70" r="2" opacity="0.6" />
          <circle cx="520" cy="180" r="1.5" opacity="0.35" />
          <circle cx="680" cy="100" r="2" opacity="0.5" />
          <circle cx="800" cy="60" r="1.5" opacity="0.4" />
          <circle cx="940" cy="150" r="2" opacity="0.55" />
          <circle cx="1060" cy="90" r="1.5" opacity="0.4" />
          <circle cx="1150" cy="200" r="2" opacity="0.45" />
          <circle cx="60" cy="220" r="1.5" opacity="0.35" />
          <circle cx="340" cy="230" r="1.5" opacity="0.4" />
          <circle cx="760" cy="220" r="1.5" opacity="0.4" />
        </g>

        {/* Moon: soft thin crescent */}
        <g filter="url(#moon-soft)">
          <circle cx="150" cy="90" r="42" fill="#EDF2FF" opacity="0.9" />
          <circle cx="163" cy="80" r="39" fill="#0b1024" />
        </g>
      </svg>
    </div>
  );
}
