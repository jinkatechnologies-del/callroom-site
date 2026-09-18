import Image from "next/image";

/**
 * Night sky background: moon + stars (from brand art, cropped clean)
 * layered with hand-drawn cloud silhouettes matching the brand's cloud color.
 * No building artwork included, per brand direction.
 */
export default function SkyBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src="/brand/sky-only.png"
        alt=""
        fill
        priority
        className="object-cover object-top opacity-70"
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-2/3 w-full"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        {/* Hospital silhouette, tucked to the right, low opacity */}
        <g opacity="0.18">
          <path
            d="M855 500V290h25v-40h40v40h25V500Z"
            fill="#4F8EF7"
          />
          {/* cross */}
          <rect x="897" y="255" width="6" height="24" fill="#EDF2FF" />
          <rect x="888" y="264" width="24" height="6" fill="#EDF2FF" />
          {/* window grid */}
          <g fill="#060810" opacity="0.55">
            <rect x="872" y="320" width="18" height="22" />
            <rect x="908" y="320" width="18" height="22" />
            <rect x="872" y="360" width="18" height="22" />
            <rect x="908" y="360" width="18" height="22" />
            <rect x="872" y="400" width="18" height="22" />
            <rect x="908" y="400" width="18" height="22" />
          </g>
        </g>

        <g opacity="0.55" fill="#21406c">
          <path d="M-50 340 Q0 300 60 320 Q90 280 150 300 Q190 270 240 300 Q280 290 300 320 L300 400 L-50 400 Z" />
          <path d="M900 300 Q950 260 1010 280 Q1050 250 1110 275 Q1160 260 1200 285 L1200 400 L900 400 Z" />
        </g>
        <g opacity="0.3" fill="#21406c">
          <path d="M550 420 Q610 385 690 405 Q740 380 810 400 Q860 390 900 415 L900 500 L550 500 Z" />
        </g>
      </svg>
    </div>
  );
}
