/**
 * Immersive WebGL world v2.9.4 — smooth scroll (no monogram nova) + emblem craft.
 * Readable extruded KM monogram; glass shell frames (does not bury) the mark.
 * World uses heavily-filtered worldVelocity; UI velocity stays lively for PillNav.
 * Reduced-motion → null (CSS scene poster handles fallback).
 */
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import {
  FPS_CRITICAL,
  FPS_DOWNGRADE,
  FPS_RECOVER,
  QUALITY_PRESETS,
  detectInitialQuality,
  nextHigher,
  nextLower,
  type QualityLevel,
  type WorldQualityPreset,
} from './worldQuality'

export type WorldPointers = {
  x: number
  y: number
  ndcX: number
  ndcY: number
  scroll: number
  /** Lively scroll speed for UI (PillNav stretch). */
  velocity: number
  /** Heavily filtered / low-gain speed for the 3D world (cinematic, no nova). */
  worldVelocity: number
}

type RuntimeFX = {
  /** Effective DPR cap (may drop below preset on low FPS) */
  dpr: number
  allowCA: boolean
  allowNoise: boolean
  bloomScale: number
  fps: number
}

type QualityCtx = {
  preset: WorldQualityPreset
  runtime: MutableRefObject<RuntimeFX>
  setLevel: (l: QualityLevel) => void
  level: QualityLevel
}

const QualityContext = createContext<QualityCtx | null>(null)

function useQuality() {
  const ctx = useContext(QualityContext)
  if (!ctx) throw new Error('QualityContext missing')
  return ctx
}

const ABYSS_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ABYSS_FRAG = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform vec2 uPtr;
uniform float uScroll;
uniform float uVel;
uniform float uFbmSteps;
varying vec2 vUv;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p, float steps){
  float v=0.;float a=.5;
  for(int i=0;i<6;i++){
    if(float(i)>=steps) break;
    v+=a*noise(p);p*=2.15;a*=.5;
  }
  return v;
}

void main(){
  vec2 uv=vUv;
  vec2 p=(uv-.5)*vec2(1.75,1.);
  p+=uPtr*.16;
  float t=uTime*.045;
  float sc=clamp(uScroll,0.,1.);
  float vel=clamp(uVel,0.,1.5);
  float steps=uFbmSteps;

  float n=fbm(p*1.15+vec2(t*.55,t*.3), steps);
  float band=smoothstep(.22,.88,n);
  float dust=fbm(p*3.4-vec2(t*.22,-t*.18), steps);
  float silk=fbm(p*2.2+vec2(-t*.15,t*.4), max(steps-1., 2.));

  vec3 deep=vec3(.015,.02,.045);
  vec3 navy=vec3(.035,.05,.1);
  vec3 indigo=vec3(.28,.42,.82);
  vec3 cyan=vec3(.32,.75,1.);
  vec3 gold=vec3(.9,.68,.3);
  vec3 mag=vec3(.6,.28,.78);
  vec3 terra=vec3(.78,.35,.18);

  vec3 col=mix(deep,navy,uv.y*.65+.12);
  col+=indigo*band*.28;
  col+=mix(cyan,gold,sc)*.1*dust;
  col+=mag*pow(band,2.2)*.08*(.35+sc*.7);
  col+=terra*silk*.04*(.2+sc);

  float flareY=uv.y-.48+uPtr.y*.025+sin(t*1.4)*.008;
  // Mild ambient band only — vel barely widens/brightens (no scroll nova)
  float flare=exp(-abs(flareY)*(58.-vel*3.)) * (.32+.18*sin(t*2.2+uv.x*7.)+vel*.06);
  col+=vec3(.75,.88,1.)*flare*(.28+vel*.06);
  col+=cyan*flare*.14;
  col+=gold*flare*.06*sc;

  float flare2=exp(-abs(uv.y-.62+uPtr.y*.015)*82.) * (.12+.02*vel);
  col+=vec3(.55,.7,1.)*flare2*.16;

  float shaft=smoothstep(.55,1.,uv.x)*exp(-abs(uv.y-.45)*3.2)*(.08+dust*.06);
  col+=gold*shaft*(.35+sc*.4);

  float vig=smoothstep(1.25,.18,length((uv-.5)*vec2(1.15,1.3)));
  col*=mix(.38,1.,vig);
  gl_FragColor=vec4(col,1.);
}
`

function AbyssPlane({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { level } = useQuality()
  const mat = useRef<THREE.ShaderMaterial>(null)
  const fbmSteps = level === 'high' ? 5 : level === 'medium' ? 4 : 3
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPtr: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uVel: { value: 0 },
      uFbmSteps: { value: fbmSteps },
    }),
    [fbmSteps],
  )
  useFrame((s) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value = s.clock.elapsedTime
    mat.current.uniforms.uPtr.value.set(ptr.current.ndcX * 0.45, ptr.current.ndcY * 0.45)
    mat.current.uniforms.uScroll.value = ptr.current.scroll
    mat.current.uniforms.uVel.value = THREE.MathUtils.lerp(
      mat.current.uniforms.uVel.value,
      Math.min(ptr.current.worldVelocity * 0.85, 0.35),
      0.06,
    )
  })
  return (
    <mesh position={[0, 0, -14]} scale={[44, 26, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={mat}
        vertexShader={ABYSS_VERT}
        fragmentShader={ABYSS_FRAG}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

/** SVG-space paths from public/logos/km-hex-seal.svg — y-down → y-up, bbox-centered. */
function shapeFromPts(pts: [number, number][], scale: number, cx: number, cy: number): THREE.Shape {
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => {
    const nx = (x - cx) * scale
    const ny = -(y - cy) * scale
    if (i === 0) s.moveTo(nx, ny)
    else s.lineTo(nx, ny)
  })
  s.closePath()
  return s
}

/** Legible interlocking KM + terra accent bar (matches 2D hex-seal spirit). */
function kmMonogramShapes(scale = 0.0135): { letters: THREE.Shape[]; accent: THREE.Shape } {
  // Combined K+M bbox center (SVG viewBox 240)
  const cx = 134
  const cy = 121
  const kPts: [number, number][] = [
    [56, 72],
    [76, 72],
    [76, 114],
    [116, 72],
    [139, 72],
    [90, 120.5],
    [140, 168],
    [116, 168],
    [76, 124.5],
    [76, 168],
    [56, 168],
  ]
  const mPts: [number, number][] = [
    [126, 72],
    [147, 72],
    [169, 129],
    [191, 72],
    [212, 72],
    [212, 170],
    [192, 170],
    [192, 124],
    [172, 170],
    [156, 170],
    [136, 124],
    [136, 170],
    [116, 170],
  ]
  // Terra accent stroke ≈ M76 120.5 H126, stroke-width 5
  const accentPts: [number, number][] = [
    [76, 118],
    [126, 118],
    [126, 123],
    [76, 123],
  ]
  return {
    letters: [shapeFromPts(kPts, scale, cx, cy), shapeFromPts(mPts, scale, cx, cy)],
    accent: shapeFromPts(accentPts, scale, cx, cy),
  }
}

function FilamentOrbits({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const group = useRef<THREE.Group>(null)
  const mats = useMemo(() => {
    const chrome = new THREE.MeshPhysicalMaterial({
      color: '#c8d8ff',
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1,
      iridescence: 1,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [80, 720],
      emissive: new THREE.Color('#3a5aaa'),
      emissiveIntensity: 0.22,
      envMapIntensity: 1.8,
    })
    const warm = new THREE.MeshStandardMaterial({
      color: '#c45d2c',
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color('#c45d2c'),
      emissiveIntensity: 0.7,
    })
    const cyan = new THREE.MeshStandardMaterial({
      color: '#7ee0ff',
      metalness: 0.7,
      roughness: 0.2,
      emissive: new THREE.Color('#4ab8e8'),
      emissiveIntensity: 0.45,
    })
    return { chrome, warm, cyan }
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const sc = ptr.current.scroll
    group.current.children.forEach((child, i) => {
      const speed = 0.22 + i * 0.07
      // Concentric: soft incline, shared Y spin — no lopsided chaos
      child.rotation.x = 0.1 + Math.sin(t * speed * 0.45 + i) * 0.08
      child.rotation.y = t * (0.12 + i * 0.04)
      child.rotation.z = Math.cos(t * 0.1 + i * 0.5) * 0.06
      child.position.y = -2.2 - i * 0.35 - sc * 0.4
    })
  })

  const segs = preset.filamentSegments
  const radii = [1.25, 0.95, 0.72, 0.5]
  const tubes = [0.016, 0.011, 0.009, 0.007]
  const materials = [mats.chrome, mats.warm, mats.cyan, mats.chrome]
  // Coaxial stack — no x/z drift
  const offsets: [number, number, number][] = [
    [0, -2.35, 0],
    [0, -2.55, 0],
    [0, -2.75, 0],
    [0, -2.95, 0],
  ]

  return (
    <group ref={group}>
      {segs.map((seg, i) => (
        <mesh key={i} material={materials[i]} position={offsets[i]}>
          <torusGeometry args={[radii[i], tubes[i], seg[0], seg[1]]} />
        </mesh>
      ))}
    </group>
  )
}

function HeroEmblem({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const group = useRef<THREE.Group>(null)
  const glyphs = useRef<THREE.Group>(null)
  const damp = useRef({ x: 0, y: 0 })
  const [tg, rg] = preset.emblemGlassSegments
  const [sw, sh] = preset.emblemSphereSeg

  const ringMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e0eaff',
        metalness: 0.95,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 1,
        iridescenceIOR: 1.55,
        iridescenceThicknessRange: [80, 820],
        emissive: new THREE.Color('#2a4a8a'),
        emissiveIntensity: 0.22,
        envMapIntensity: 2.0,
      }),
    [],
  )
  /** Outer glass / lens — frames the mark; low opacity so glyphs stay readable. */
  const shellMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f2f6ff',
        metalness: 0.04,
        roughness: 0.05,
        transmission: preset.level === 'low' ? 0.72 : 0.94,
        thickness: preset.level === 'low' ? 0.45 : 0.95,
        ior: 1.42,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        iridescence: preset.level === 'low' ? 0.35 : 0.75,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [40, 420],
        transparent: true,
        opacity: preset.level === 'low' ? 0.42 : 0.32,
        envMapIntensity: preset.level === 'low' ? 0.9 : 1.6,
        depthWrite: false,
      }),
    [preset.level],
  )
  /** Dense letter faces — no muddy transmission; cool emissive for contrast. */
  const letterMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#eef3ff',
        metalness: 0.28,
        roughness: 0.24,
        transmission: 0,
        clearcoat: 0.55,
        clearcoatRoughness: 0.18,
        emissive: new THREE.Color('#a8c0ff'),
        emissiveIntensity: 0.42,
        envMapIntensity: 1.15,
      }),
    [],
  )
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c45d2c',
        metalness: 0.85,
        roughness: 0.18,
        emissive: new THREE.Color('#c45d2c'),
        emissiveIntensity: 0.85,
      }),
    [],
  )

  const { letterGeos, accentGeo } = useMemo(() => {
    const { letters, accent } = kmMonogramShapes(0.0135)
    const depth = 0.22
    const letterGeos = letters.map((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.016,
        bevelSegments: 2,
        curveSegments: 1,
      })
      geo.translate(0, 0, -depth * 0.5)
      return geo
    })
    const accentGeo = new THREE.ExtrudeGeometry(accent, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelSegments: 1,
      curveSegments: 1,
    })
    accentGeo.translate(0, 0, depth * 0.5 - 0.02)
    return { letterGeos, accentGeo }
  }, [])

  useEffect(
    () => () => {
      letterGeos.forEach((g) => g.dispose())
      accentGeo.dispose()
      ringMat.dispose()
      shellMat.dispose()
      letterMat.dispose()
      accentMat.dispose()
    },
    [letterGeos, accentGeo, ringMat, shellMat, letterMat, accentMat],
  )

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const sc = ptr.current.scroll

    damp.current.x = THREE.MathUtils.lerp(damp.current.x, ptr.current.ndcX, 0.055)
    damp.current.y = THREE.MathUtils.lerp(damp.current.y, ptr.current.ndcY, 0.055)
    const px = damp.current.x
    const py = damp.current.y

    // Slow elegant idle — gentle Y spin + soft float; no velocity scale punch
    const idleY = t * 0.1
    const idleX = Math.sin(t * 0.32) * 0.055
    const idleZ = Math.sin(t * 0.2) * 0.02

    group.current.rotation.y = idleY + px * 0.18
    group.current.rotation.x = idleX + py * 0.1
    group.current.rotation.z = idleZ + px * 0.015

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, px * 0.5, 0.05)
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      0.25 + Math.sin(t * 0.4) * 0.12 - sc * 3.2,
      0.055,
    )
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -1.0 - sc * 7.5, 0.055)
    group.current.scale.setScalar(1)

    // Counter-rotate glyphs so KM stays more camera-facing while ring spins
    if (glyphs.current) {
      glyphs.current.rotation.y = THREE.MathUtils.lerp(
        glyphs.current.rotation.y,
        -idleY * 0.7 - px * 0.1,
        0.09,
      )
      glyphs.current.rotation.x = THREE.MathUtils.lerp(
        glyphs.current.rotation.x,
        -idleX * 0.55 - py * 0.05,
        0.09,
      )
    }
  })

  const nLights = preset.pointLights

  return (
    <group ref={group} position={[0, 0.25, -1]} scale={1.2}>
      {/* Front-facing glass torus — coaxial frame */}
      <mesh material={shellMat}>
        <torusGeometry args={[2.2, 0.28, Math.max(16, Math.floor(tg * 0.7)), rg]} />
      </mesh>
      {/* Equatorial chrome ring — intentional balanced orbit */}
      <mesh material={ringMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.085, Math.min(16, Math.floor(tg / 3)), rg]} />
      </mesh>
      {/* Inner concentric chrome halo (no vertical meridian) */}
      <mesh material={ringMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.04, Math.min(12, Math.floor(tg / 4)), Math.max(48, Math.floor(rg * 0.75))]} />
      </mesh>
      {/* Thin glass lens — transparent so letters read through */}
      <mesh material={shellMat} scale={[1.05, 1.05, 0.12]}>
        <sphereGeometry args={[1.15, sw, sh]} />
      </mesh>
      <group ref={glyphs} position={[0, 0, 0.06]}>
        {letterGeos.map((geo, i) => (
          <mesh key={i} geometry={geo} material={letterMat} />
        ))}
        <mesh geometry={accentGeo} material={accentMat} />
      </group>
      <FilamentOrbits ptr={ptr} />
      {nLights >= 1 ? (
        <pointLight position={[1.6, 1.3, 2.2]} intensity={2.8} color="#8ec8ff" distance={14} />
      ) : null}
      {nLights >= 2 ? (
        <pointLight position={[-1.9, -0.6, 1.6]} intensity={1.8} color="#c45d2c" distance={11} />
      ) : null}
      {nLights >= 3 ? (
        <pointLight position={[0, 0.2, 3.2]} intensity={1.1} color="#d0a0ff" distance={9} />
      ) : null}
    </group>
  )
}

function MicroParticles({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const count = preset.particles
  const ref = useRef<THREE.Points>(null)
  const { pos, phase } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.random() * 16 - 5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = -Math.random() * 26 - 1.5
      phase[i] = Math.random() * Math.PI * 2
    }
    return { pos, phase }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const a = ref.current.geometry.attributes.position.array as Float32Array
    const vel = ptr.current.worldVelocity
    // Stride update on low: every other particle for CPU relief
    const stride = preset.level === 'low' ? 2 : 1
    for (let i = 0; i < count; i += stride) {
      const i3 = i * 3
      a[i3 + 1] += Math.sin(t * 0.28 + phase[i]) * 0.004
      a[i3] += 0.0025 + ptr.current.ndcX * 0.004 + vel * 0.002
      if (a[i3] > 13) a[i3] = -7
      a[i3 + 2] += ptr.current.scroll * 0.003
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.position.x = ptr.current.ndcX * -0.55
    ref.current.position.y = ptr.current.ndcY * -0.3 - ptr.current.scroll * 1.8
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = preset.particleOpacity * 0.85 + Math.min(vel * 0.15, 0.06)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={preset.particleSize}
        color="#e8c56a"
        transparent
        opacity={preset.particleOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CyanDust({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const count = preset.cyanDust
  const ref = useRef<THREE.Points>(null)
  const { pos, phase } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = -Math.random() * 20 - 4
      phase[i] = Math.random() * Math.PI * 2
    }
    return { pos, phase }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const a = ref.current.geometry.attributes.position.array as Float32Array
    const stride = preset.level === 'low' ? 2 : 1
    for (let i = 0; i < count; i += stride) {
      const i3 = i * 3
      a[i3] += Math.sin(t * 0.15 + phase[i]) * 0.002
      a[i3 + 1] += 0.0015
      if (a[i3 + 1] > 7) a[i3 + 1] = -7
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.position.x = ptr.current.ndcX * 0.3
    ref.current.position.y = -ptr.current.scroll * 1.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={preset.cyanSize}
        color="#7ec8ff"
        transparent
        opacity={preset.cyanOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function BokehField({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const group = useRef<THREE.Group>(null)
  const orbs = useMemo(() => {
    const list: { p: [number, number, number]; s: number; o: number; c: string }[] = []
    for (let i = 0; i < preset.bokeh; i++) {
      const warm = i % 7 === 0
      list.push({
        p: [-9 + Math.random() * 7, (Math.random() - 0.5) * 9, 0.5 + Math.random() * 5],
        s: 0.32 + Math.random() * 1.4,
        o: 0.08 + Math.random() * 0.22,
        c: warm ? '#e8c56a' : i % 5 === 0 ? '#c48aff' : '#6a9eff',
      })
    }
    return list
  }, [preset.bokeh])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const vel = ptr.current.worldVelocity
    group.current.position.x = ptr.current.ndcX * -1.45
    group.current.position.y = ptr.current.ndcY * -0.85 - ptr.current.scroll * 1.0
    group.current.scale.setScalar(1 + Math.min(vel * 0.08, 0.02))
    group.current.children.forEach((c, i) => {
      c.position.y = orbs[i].p[1] + Math.sin(t * 0.32 + i * 0.7) * 0.32
      c.position.x = orbs[i].p[0] + Math.cos(t * 0.18 + i) * 0.12
    })
  })

  const seg = preset.bokehSegments
  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.p}>
          <sphereGeometry args={[o.s, seg, seg]} />
          <meshBasicMaterial
            color={o.c}
            transparent
            opacity={o.o}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

function Silhouettes({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const g = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    g.current.rotation.y = t * 0.06
    g.current.position.x = -3.8 + ptr.current.ndcX * 0.7
    g.current.position.y = ptr.current.ndcY * 0.4 - ptr.current.scroll * 1.5
    g.current.position.z = -6 - ptr.current.scroll * 2
  })
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#5a7abb',
        transparent: true,
        opacity: 0.14,
        transmission: preset.level === 'low' ? 0.2 : 0.55,
        thickness: 0.7,
        roughness: 0.28,
        metalness: 0.15,
        iridescence: preset.level === 'low' ? 0.2 : 0.8,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 400],
        side: THREE.DoubleSide,
      }),
    [preset.level],
  )
  const sphereSeg = preset.level === 'high' ? 24 : 16
  return (
    <group ref={g} position={[-3.8, 0.5, -6]} scale={2.0}>
      <mesh material={mat} rotation={[0.4, 0.2, 0.1]}>
        <sphereGeometry args={[0.95, sphereSeg, sphereSeg]} />
      </mesh>
      <mesh material={mat} position={[0, -1.25, 0]} rotation={[0.8, 0, 0]}>
        <coneGeometry args={[0.75, 2.4, 5]} />
      </mesh>
      {preset.level !== 'low' ? (
        <mesh material={mat} position={[0.35, -0.15, 0.55]} rotation={[0.2, 0.5, 1.2]}>
          <torusGeometry args={[0.6, 0.09, 6, 20]} />
        </mesh>
      ) : null}
      <mesh material={mat} position={[-0.5, 0.6, -0.4]} rotation={[0.5, 1.1, 0]}>
        <icosahedronGeometry args={[0.45, 0]} />
      </mesh>
    </group>
  )
}

function CursorRibbons({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset } = useQuality()
  const MAX = preset.ribbonMax
  const history = useRef<THREE.Vector3[]>([])
  const ages = useRef<number[]>([])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setDrawRange(0, 0)
    return g
  }, [MAX])
  const glowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setDrawRange(0, 0)
    return g
  }, [MAX])
  // Skip third tube trail on medium/low — keeps light-tube feel with less overdraw
  const useTube = preset.level === 'high'
  const tubeGeo = useMemo(() => {
    if (!useTube) return null
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setDrawRange(0, 0)
    return g
  }, [MAX, useTube])

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )
  const glowMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )
  const tubeMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#a8d8ff',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  const cA = useMemo(() => new THREE.Color('#7ec8ff'), [])
  const cB = useMemo(() => new THREE.Color('#e8c56a'), [])
  const cC = useMemo(() => new THREE.Color('#c45d2c'), [])
  const cD = useMemo(() => new THREE.Color('#c48aff'), [])
  const tmp = useMemo(() => new THREE.Color(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const { ndcX, ndcY, worldVelocity, scroll } = ptr.current
    const velocity = worldVelocity
    target.set(ndcX * 6.5, ndcY * 3.6, -1.2 - scroll * 3.5)
    const last = history.current[history.current.length - 1]
    // Steady spawn — no flash denser trail on every scroll tick
    const spawnThresh = velocity > 0.12 ? 0.028 : 0.04
    if (!last || last.distanceTo(target) > spawnThresh) {
      history.current.push(target.clone())
      ages.current.push(0)
      if (history.current.length > MAX) {
        history.current.shift()
        ages.current.shift()
      }
    } else last.lerp(target, 0.45)

    for (let i = 0; i < ages.current.length; i++) ages.current[i] += 1 / 60

    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const col = geo.getAttribute('color') as THREE.BufferAttribute
    const gpos = glowGeo.getAttribute('position') as THREE.BufferAttribute
    const gcol = glowGeo.getAttribute('color') as THREE.BufferAttribute
    const tpos = tubeGeo?.getAttribute('position') as THREE.BufferAttribute | undefined
    const n = history.current.length

    for (let i = 0; i < n; i++) {
      const p = history.current[i]
      const life = 1 - Math.min(ages.current[i] / 1.8, 1)
      const along = i / Math.max(1, n - 1)
      const weave = Math.sin(state.clock.elapsedTime * 3.8 + i * 0.45) * 0.07 * (velocity + 0.2)
      pos.setXYZ(i, p.x, p.y + weave, p.z)
      gpos.setXYZ(i, p.x * 1.03, p.y - weave * 1.6, p.z - 0.25)
      tpos?.setXYZ(i, p.x * 0.98, p.y + weave * 0.5, p.z + 0.15)

      tmp.copy(cA).lerp(cB, along * 0.5).lerp(cD, Math.sin(along * Math.PI) * 0.3)
      tmp.multiplyScalar(life * (0.55 + along * 0.45))
      col.setXYZ(i, tmp.r, tmp.g, tmp.b)
      tmp.copy(cC).lerp(cA, along).multiplyScalar(life * 0.55)
      gcol.setXYZ(i, tmp.r, tmp.g, tmp.b)
    }
    pos.needsUpdate = true
    col.needsUpdate = true
    gpos.needsUpdate = true
    gcol.needsUpdate = true
    if (tpos) tpos.needsUpdate = true
    geo.setDrawRange(0, n)
    glowGeo.setDrawRange(0, n)
    tubeGeo?.setDrawRange(0, n)
    mat.opacity = 0.48 + Math.min(velocity * 0.35, 0.12)
    glowMat.opacity = 0.2 + Math.min(velocity * 0.25, 0.08)
    tubeMat.opacity = 0.18 + Math.min(velocity * 0.2, 0.07)
  })

  const lineA = useMemo(() => new THREE.Line(geo, mat), [geo, mat])
  const lineB = useMemo(() => new THREE.Line(glowGeo, glowMat), [glowGeo, glowMat])
  const lineC = useMemo(
    () => (tubeGeo ? new THREE.Line(tubeGeo, tubeMat) : null),
    [tubeGeo, tubeMat],
  )
  return (
    <group>
      <primitive object={lineA} />
      <primitive object={lineB} />
      {lineC ? <primitive object={lineC} /> : null}
    </group>
  )
}

function ScrollCamera({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { camera } = useThree()

  useFrame((state) => {
    const sc = ptr.current.scroll

    let tx = 0
    let ty = 0
    let tz = 6.2
    let lx = 0
    let ly = 0
    let lz = -3
    let baseFov = 48

    if (sc < 0.18) {
      const t = sc / 0.18
      tx = THREE.MathUtils.lerp(0, 0.4, t)
      ty = THREE.MathUtils.lerp(0, 0.15, t)
      tz = THREE.MathUtils.lerp(6.2, 5.4, t)
      ly = THREE.MathUtils.lerp(0, -0.35, t)
      lz = THREE.MathUtils.lerp(-3, -4.5, t)
      baseFov = THREE.MathUtils.lerp(48, 46, t)
    } else if (sc < 0.42) {
      const t = (sc - 0.18) / 0.24
      tx = THREE.MathUtils.lerp(0.4, -0.55, t)
      ty = THREE.MathUtils.lerp(0.15, 0.55, t)
      tz = THREE.MathUtils.lerp(5.4, 3.8, t)
      lx = THREE.MathUtils.lerp(0, 0.2, t)
      ly = THREE.MathUtils.lerp(-0.35, -0.9, t)
      lz = THREE.MathUtils.lerp(-4.5, -7, t)
      baseFov = THREE.MathUtils.lerp(46, 52, t)
    } else if (sc < 0.72) {
      const t = (sc - 0.42) / 0.3
      tx = THREE.MathUtils.lerp(-0.55, 0.35, t)
      ty = THREE.MathUtils.lerp(0.55, 0.9, t)
      tz = THREE.MathUtils.lerp(3.8, 2.2, t)
      lx = THREE.MathUtils.lerp(0.2, -0.15, t)
      ly = THREE.MathUtils.lerp(-0.9, -1.4, t)
      lz = THREE.MathUtils.lerp(-7, -10, t)
      baseFov = THREE.MathUtils.lerp(52, 44, t)
    } else {
      const t = Math.min(1, (sc - 0.72) / 0.28)
      tx = THREE.MathUtils.lerp(0.35, 0, t)
      ty = THREE.MathUtils.lerp(0.9, 1.15, t)
      tz = THREE.MathUtils.lerp(2.2, 1.4, t)
      ly = THREE.MathUtils.lerp(-1.4, -1.8, t)
      lz = THREE.MathUtils.lerp(-10, -12, t)
      baseFov = THREE.MathUtils.lerp(44, 42, t)
    }

    tx += ptr.current.ndcX * 0.7
    ty += ptr.current.ndcY * 0.38
    // No velocity FOV/z punch — scroll recession stays continuous

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.065)
    camera.lookAt(lx + tx * 0.2, ly, lz)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, baseFov, 0.08)
      camera.updateProjectionMatrix()
    }
    camera.position.x += Math.sin(state.clock.elapsedTime * 0.22) * 0.003
    camera.position.y += Math.cos(state.clock.elapsedTime * 0.18) * 0.002
  })
  return null
}

/** Adaptive DPR + FX flags from smoothed FPS; may step quality level on sustained pain */
function AdaptiveController({
  onLevelHint,
}: {
  onLevelHint: (l: QualityLevel) => void
}) {
  const { gl } = useThree()
  const { preset, runtime, level } = useQuality()
  const frames = useRef(0)
  const last = useRef(performance.now())
  const smoothFps = useRef(60)
  const lowStreak = useRef(0)
  const highStreak = useRef(0)
  const hintCooldown = useRef(0)

  useFrame(() => {
    frames.current += 1
    const now = performance.now()
    const elapsed = now - last.current
    if (elapsed >= 500) {
      const fps = (frames.current * 1000) / elapsed
      frames.current = 0
      last.current = now
      smoothFps.current = smoothFps.current * 0.65 + fps * 0.35
      runtime.current.fps = smoothFps.current

      const targetDpr = Math.min(
        preset.dprMax,
        typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      )
      let dpr = targetDpr
      if (smoothFps.current < FPS_CRITICAL) dpr = preset.dprMin
      else if (smoothFps.current < FPS_DOWNGRADE)
        dpr = Math.max(preset.dprMin, Math.min(targetDpr, 1.1))
      runtime.current.dpr = dpr
      const cur = gl.getPixelRatio()
      if (Math.abs(cur - dpr) > 0.05) gl.setPixelRatio(dpr)

      // Soft-disable expensive post when struggling (even on high preset)
      runtime.current.allowCA =
        preset.chromaticAberration && smoothFps.current >= FPS_DOWNGRADE
      runtime.current.allowNoise = preset.noise && smoothFps.current >= FPS_DOWNGRADE
      runtime.current.bloomScale = smoothFps.current < FPS_CRITICAL ? 0.65 : 1

      if (hintCooldown.current > 0) {
        hintCooldown.current -= elapsed
      } else if (smoothFps.current < FPS_CRITICAL) {
        lowStreak.current += 1
        highStreak.current = 0
        if (lowStreak.current >= 3 && level !== 'low') {
          onLevelHint(nextLower(level))
          lowStreak.current = 0
          hintCooldown.current = 4000
        }
      } else if (smoothFps.current > FPS_RECOVER) {
        highStreak.current += 1
        lowStreak.current = 0
        if (highStreak.current >= 5 && level !== 'high') {
          // Only recover toward detected ceiling — handled by parent clamp
          onLevelHint(nextHigher(level))
          highStreak.current = 0
          hintCooldown.current = 5000
        }
      } else {
        lowStreak.current = 0
        highStreak.current = 0
      }
    }
  })
  return null
}

function PostFX({ ptr }: { ptr: MutableRefObject<WorldPointers> }) {
  const { preset, runtime } = useQuality()
  const caRef = useRef<{ offset: THREE.Vector2 }>(null)
  const [fx, setFx] = useState({ ca: preset.chromaticAberration, noise: preset.noise, bloom: 1 })

  useFrame(() => {
    const r = runtime.current
    const next = {
      ca: r.allowCA,
      noise: r.allowNoise,
      bloom: r.bloomScale,
    }
    if (next.ca !== fx.ca || next.noise !== fx.noise || Math.abs(next.bloom - fx.bloom) > 0.05) {
      setFx(next)
    }
    if (caRef.current && next.ca) {
      const v = Math.min(ptr.current.worldVelocity * 0.0006, 0.0008)
      const base = 0.001
      caRef.current.offset.set(base + v, base * 0.8 + v * 0.7)
    }
  })

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={preset.bloomIntensity * fx.bloom}
        luminanceThreshold={preset.bloomThreshold}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      {fx.ca ? (
        <ChromaticAberration
          ref={caRef as never}
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.0008)}
        />
      ) : null}
      {preset.vignette ? <Vignette offset={0.22} darkness={0.72} /> : null}
      {fx.noise ? <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} /> : null}
    </EffectComposer>
  )
}

function Scene({ ptr, active }: { ptr: MutableRefObject<WorldPointers>; active: boolean }) {
  const { preset } = useQuality()
  if (!active) return null
  return (
    <>
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 7, 30]} />
      <ambientLight intensity={0.14} />
      <directionalLight position={[4, 8, 5]} intensity={0.65} color="#b8d0ff" />
      {preset.level !== 'low' ? (
        <directionalLight position={[-5, 2, -3]} intensity={0.25} color="#c45d2c" />
      ) : null}
      <AbyssPlane ptr={ptr} />
      <Silhouettes ptr={ptr} />
      <MicroParticles ptr={ptr} />
      <CyanDust ptr={ptr} />
      <Float speed={0.42} rotationIntensity={0.05} floatIntensity={0.26}>
        <HeroEmblem ptr={ptr} />
      </Float>
      <BokehField ptr={ptr} />
      <CursorRibbons ptr={ptr} />
      <ScrollCamera ptr={ptr} />
      {preset.environment ? (
        <Environment preset="night" environmentIntensity={preset.envIntensity} />
      ) : null}
      <PostFX ptr={ptr} />
    </>
  )
}

function QualityProvider({
  children,
  level,
  setLevel,
}: {
  children: ReactNode
  level: QualityLevel
  setLevel: (l: QualityLevel) => void
}) {
  const preset = QUALITY_PRESETS[level]
  const runtime = useRef<RuntimeFX>({
    dpr: preset.dprMax,
    allowCA: preset.chromaticAberration,
    allowNoise: preset.noise,
    bloomScale: 1,
    fps: 60,
  })
  const value = useMemo(
    () => ({ preset, runtime, setLevel, level }),
    [preset, setLevel, level],
  )
  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>
}

export function ImmersiveWorld({
  ptr,
  reduced,
  onQualityChange,
}: {
  ptr: MutableRefObject<WorldPointers>
  reduced: boolean
  onQualityChange?: (level: QualityLevel) => void
}) {
  const ceiling = useMemo(() => detectInitialQuality(), [])
  const [level, setLevelRaw] = useState<QualityLevel>(ceiling)
  const [visible, setVisible] = useState(true)
  const [canvasReady, setCanvasReady] = useState(false)
  const worldRef = useRef<HTMLDivElement>(null)

  const setLevel = useCallback(
    (next: QualityLevel) => {
      const rank = { low: 0, medium: 1, high: 2 }
      // Never exceed device ceiling; allow downgrade freely
      const clamped = rank[next] > rank[ceiling] ? ceiling : next
      setLevelRaw((prev) => {
        if (prev === clamped) return prev
        onQualityChange?.(clamped)
        return clamped
      })
    },
    [ceiling, onQualityChange],
  )

  useEffect(() => {
    onQualityChange?.(level)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- announce initial only

  useEffect(() => {
    const onVis = () => {
      const pageVisible = document.visibilityState === 'visible'
      const el = worldRef.current
      const onscreen = el ? el.getBoundingClientRect().height > 0 : true
      setVisible(pageVisible && onscreen)
    }
    document.addEventListener('visibilitychange', onVis)

    let io: IntersectionObserver | null = null
    let ro: ResizeObserver | null = null
    const el = worldRef.current

    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting && document.visibilityState === 'visible')
        },
        { threshold: 0.01 },
      )
      io.observe(el)
    }
    if (el && 'ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect
        if (!cr) return
        const dead = cr.width < 2 || cr.height < 2
        if (dead) setVisible(false)
        else if (document.visibilityState === 'visible') setVisible(true)
      })
      ro.observe(el)
    }

    // Defer canvas mount one frame for faster first paint of HUD/CSS
    const raf = requestAnimationFrame(() => setCanvasReady(true))

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      io?.disconnect()
      ro?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  if (reduced) return null

  const preset = QUALITY_PRESETS[level]

  return (
    <div className="im-world" ref={worldRef} aria-hidden="true" data-quality={level}>
      {canvasReady ? (
        <QualityProvider level={level} setLevel={setLevel}>
          <Canvas
            key={level}
            dpr={[preset.dprMin, preset.dprMax]}
            gl={{
              antialias: preset.antialias,
              alpha: false,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              stencil: false,
              depth: true,
            }}
            camera={{ position: [0, 0, 6.2], fov: 48, near: 0.1, far: 90 }}
            style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
            frameloop={visible ? 'always' : 'never'}
          >
            <AdaptiveController onLevelHint={setLevel} />
            <Suspense fallback={null}>
              <Scene ptr={ptr} active={visible} />
            </Suspense>
          </Canvas>
        </QualityProvider>
      ) : null}
    </div>
  )
}

export type { QualityLevel }
