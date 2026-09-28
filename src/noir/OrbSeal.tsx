/** 11 Orb Seal — seal ring nested inside signal orb (from mock E+). No square plate. */
export function OrbSeal({
  className,
  title = 'KM Orb Seal',
  idPrefix = 'orb',
}: {
  className?: string
  title?: string
  idPrefix?: string
}) {
  const g = (name: string) => `${idPrefix}-${name}`
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id={g('orb')} cx="36%" cy="28%" r="64%">
          <stop offset="0%" stopColor="#3e3e44" />
          <stop offset="28%" stopColor="#1c1c20" />
          <stop offset="62%" stopColor="#0c0c0e" />
          <stop offset="100%" stopColor="#030303" />
        </radialGradient>
        <radialGradient id={g('glass')} cx="40%" cy="34%" r="48%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#9ec9e8" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g('core')} cx="48%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#1a1610" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={g('eq')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="12%" stopColor="#d4af37" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#f0d878" stopOpacity="1" />
          <stop offset="88%" stopColor="#d4af37" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g('seal')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d878" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a7020" />
        </linearGradient>
        <clipPath id={g('clip')}>
          <circle cx="100" cy="100" r="56" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="74" fill="#d4af37" opacity="0.05" />
      <circle cx="100" cy="100" r="66" fill={`url(#${g('orb')})`} stroke="#1a1a1e" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="66" fill={`url(#${g('glass')})`} />
      <circle cx="100" cy="100" r="48" fill={`url(#${g('core')})`} />
      <g clipPath={`url(#${g('clip')})`}>
        <circle cx="100" cy="100" r="40" fill="none" stroke={`url(#${g('seal')})`} strokeWidth="2.4" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="#d4af37" strokeWidth="0.7" opacity="0.5" />
        <circle cx="100" cy="100" r="28" fill="#0a0a0a" stroke="#d4af37" strokeWidth="1.15" />
        <path
          d="M86 72 A30 30 0 0 1 114 72"
          fill="none"
          stroke="#f0d878"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M84 74 A28 28 0 0 1 112 74"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.55"
          opacity="0.35"
        />
        <path
          d="M88 128 A26 26 0 0 0 112 128"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.9"
          opacity="0.45"
        />
        <circle
          cx="100"
          cy="100"
          r="43"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.35"
          strokeDasharray="1.5 3"
          opacity="0.4"
        />
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fontFamily="Georgia, 'Iowan Old Style', 'Palatino Linotype', serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="400"
          fill={`url(#${g('seal')})`}
        >
          KM
        </text>
        <g fill="none" stroke="#d4af37" strokeWidth="0.65" opacity="0.6">
          <path d="M100 60 L104 68 L100 65 L96 68 Z" />
          <path d="M100 140 L104 132 L100 135 L96 132 Z" />
          <path d="M60 100 L68 96 L65 100 L68 104 Z" />
          <path d="M140 100 L132 96 L135 100 L132 104 Z" />
        </g>
      </g>
      <ellipse cx="100" cy="100" rx="66" ry="17" fill="none" stroke={`url(#${g('eq')})`} strokeWidth="1.7" />
      <path d="M34 90 Q100 74 166 90" fill="none" stroke="#d4af37" strokeWidth="0.55" opacity="0.28" />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#f0d878" strokeWidth="0.45" opacity="0.22" />
      <ellipse cx="76" cy="68" rx="16" ry="10" fill="#ffffff" opacity="0.13" />
      <ellipse cx="72" cy="64" rx="6" ry="4" fill="#ffffff" opacity="0.25" />
      <path d="M152 76 Q164 100 152 124" fill="none" stroke="#f0d878" strokeWidth="1.1" opacity="0.4" />
      <circle cx="162" cy="98" r="2.4" fill="#f0d878" opacity="0.92" />
      <ellipse cx="100" cy="168" rx="34" ry="5" fill="#d4af37" opacity="0.08" />
    </svg>
  )
}
