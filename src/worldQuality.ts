/**
 * v2.9.1 — quality presets + device heuristics for ImmersiveWorld.
 * high = ceiling look (leaner than raw v2.9); medium/low dial down intentionally.
 */

export type QualityLevel = 'high' | 'medium' | 'low'

export type WorldQualityPreset = {
  level: QualityLevel
  /** Cap device pixel ratio */
  dprMax: number
  dprMin: number
  antialias: boolean
  /** Gold micro-dust */
  particles: number
  particleSize: number
  particleOpacity: number
  /** Cyan depth dust */
  cyanDust: number
  cyanSize: number
  cyanOpacity: number
  /** Soft orbs */
  bokeh: number
  bokehSegments: number
  /** Cursor trail history length */
  ribbonMax: number
  /** Post */
  bloomIntensity: number
  bloomThreshold: number
  chromaticAberration: boolean
  noise: boolean
  vignette: boolean
  /** Scene */
  environment: boolean
  envIntensity: number
  pointLights: number
  filamentSegments: [radial: number, tubular: number][]
  emblemGlassSegments: [tubular: number, radial: number]
  emblemSphereSeg: [w: number, h: number]
}

export const QUALITY_PRESETS: Record<QualityLevel, WorldQualityPreset> = {
  high: {
    level: 'high',
    dprMax: 1.75,
    dprMin: 1,
    antialias: true,
    // v2.9 was 2200 / 900 / 42 / 96 — ~32% cut, density via size/opacity
    particles: 1480,
    particleSize: 0.038,
    particleOpacity: 0.82,
    cyanDust: 580,
    cyanSize: 0.022,
    cyanOpacity: 0.5,
    bokeh: 28,
    bokehSegments: 12,
    ribbonMax: 64,
    bloomIntensity: 0.95,
    bloomThreshold: 0.34,
    chromaticAberration: true,
    noise: true,
    vignette: true,
    environment: true,
    envIntensity: 0.65,
    pointLights: 3,
    filamentSegments: [
      [8, 72],
      [6, 56],
      [6, 48],
      [5, 36],
    ],
    emblemGlassSegments: [48, 96],
    emblemSphereSeg: [36, 24],
  },
  medium: {
    level: 'medium',
    dprMax: 1.25,
    dprMin: 1,
    antialias: false,
    particles: 980,
    particleSize: 0.044,
    particleOpacity: 0.85,
    cyanDust: 380,
    cyanSize: 0.026,
    cyanOpacity: 0.52,
    bokeh: 18,
    bokehSegments: 8,
    ribbonMax: 42,
    bloomIntensity: 0.72,
    bloomThreshold: 0.4,
    chromaticAberration: false,
    noise: false,
    vignette: true,
    environment: true,
    envIntensity: 0.45,
    pointLights: 2,
    filamentSegments: [
      [6, 48],
      [5, 36],
      [4, 28],
    ],
    emblemGlassSegments: [32, 64],
    emblemSphereSeg: [24, 16],
  },
  low: {
    level: 'low',
    dprMax: 1,
    dprMin: 1,
    antialias: false,
    particles: 620,
    particleSize: 0.052,
    particleOpacity: 0.88,
    cyanDust: 220,
    cyanSize: 0.03,
    cyanOpacity: 0.55,
    bokeh: 10,
    bokehSegments: 6,
    ribbonMax: 28,
    bloomIntensity: 0.5,
    bloomThreshold: 0.48,
    chromaticAberration: false,
    noise: false,
    vignette: true,
    environment: false,
    envIntensity: 0,
    pointLights: 1,
    filamentSegments: [
      [5, 32],
      [4, 24],
    ],
    emblemGlassSegments: [24, 48],
    emblemSphereSeg: [16, 12],
  },
}

/** FPS thresholds for runtime dial-down / recovery within a session */
export const FPS_DOWNGRADE = 38
export const FPS_CRITICAL = 26
export const FPS_RECOVER = 52

type NavWithMemory = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function detectInitialQuality(): QualityLevel {
  if (typeof window === 'undefined') return 'high'
  const nav = navigator as NavWithMemory
  const saveData = Boolean(nav.connection?.saveData)
  const coarse =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth > 0 && window.innerWidth < 768
  const mem = nav.deviceMemory
  const cores = nav.hardwareConcurrency ?? 4

  if (saveData) return 'low'
  if (mem !== undefined && mem <= 4) return 'low'
  if (coarse || small) return 'medium'
  if (cores <= 4 && (mem === undefined || mem <= 8)) return 'medium'
  return 'high'
}

export function nextLower(level: QualityLevel): QualityLevel {
  if (level === 'high') return 'medium'
  return 'low'
}

export function nextHigher(level: QualityLevel): QualityLevel {
  if (level === 'low') return 'medium'
  return 'high'
}
