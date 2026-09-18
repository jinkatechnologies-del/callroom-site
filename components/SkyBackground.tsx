/**
 * Night sky background: pure SVG, no raster images.
 * Crisp at any screen size, with the gradient baked in so text always
 * sits on a clean, predictable backdrop rather than a patchy image.
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

        {/* Moon */}
        <circle cx="150" cy="90" r="40" fill="#EDF2FF" opacity="0.85" />
        <circle cx="168" cy="78" r="34" fill="#0b1024" />

        {/* Hospital silhouette, tucked to the right, low opacity */}
        <g opacity="0.16">
          <path
            d="M855 500V290h25v-40h40v40h25V500Z"
            fill="#4F8EF7"
          />
          <rect x="897" y="255" width="6" height="24" fill="#EDF2FF" />
          <rect x="888" y="264" width="24" height="6" fill="#EDF2FF" />
          <g fill="#060810" opacity="0.55">
            <rect x="872" y="320" width="18" height="22" />
            <rect x="908" y="320" width="18" height="22" />
            <rect x="872" y="360" width="18" height="22" />
            <rect x="908" y="360" width="18" height="22" />
            <rect x="872" y="400" width="18" height="22" />
            <rect x="908" y="400" width="18" height="22" />
          </g>
        </g>

        {/* Clouds, kept low so they never sit behind the headline */}
        <g opacity="0.5" fill="#21406c">
          <path d="M-50 340 Q0 300 60 320 Q90 280 150 300 Q190 270 240 300 Q280 290 300 320 L300 420 L-50 420 Z" />
          <path d="M900 300 Q950 260 1010 280 Q1050 250 1110 275 Q1160 260 1200 285 L1200 420 L900 420 Z" />
        </g>
        <g opacity="0.28" fill="#21406c">
          <path d="M550 420 Q610 385 690 405 Q740 380 810 400 Q860 390 900 415 L900 500 L550 500 Z" />
        </g>
      </svg>
    </div>
  );
}
