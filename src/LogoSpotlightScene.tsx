/**
 * Night Dossier v2.5 — center-stage WebGL set (Active Theory energy).
 * Extruded clean hex KM + volumetric fog, soft particles, pointer key light,
 * scroll parallax, subtle bloom. Hireable craft — not neon circus.
 */
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

export type PointerNorm = { x: number; y: number }
export type SceneProps = {
  active: boolean
  pointer: PointerNorm
  scrollT: number
}

function hexShape(scale = 1): THREE.Shape {
  const pts: [number, number][] = [
    [32, 5.5],
    [54.5, 18.5],
    [54.5, 45.5],
    [32, 58.5],
    [9.5, 45.5],
    [9.5, 18.5],
  ]
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => {
    const nx = (x - 32) * scale
    const ny = -(y - 32) * scale
    if (i === 0) s.moveTo(nx, ny)
    else s.lineTo(nx, ny)
  })
  s.closePath()
  return s
}

function letterShapes(scale = 1): THREE.Shape[] {
  const toLocal = (x: number, y: number): [number, number] => [
    (x - 32) * scale,
    -(y - 32) * scale,
  ]

  const kStem = new THREE.Shape()
  ;[
    [15, 19],
    [20.4, 19],
    [20.4, 45],
    [15, 45],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) kStem.moveTo(nx, ny)
    else kStem.lineTo(nx, ny)
  })
  kStem.closePath()

  const kUpper = new THREE.Shape()
  ;[
    [20.4, 30.2],
    [30.2, 19],
    [36.4, 19],
    [24.2, 32.2],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) kUpper.moveTo(nx, ny)
    else kUpper.lineTo(nx, ny)
  })
  kUpper.closePath()

  const kLower = new THREE.Shape()
  ;[
    [24.2, 32.2],
    [36.8, 45],
    [30.4, 45],
    [20.4, 33.4],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) kLower.moveTo(nx, ny)
    else kLower.lineTo(nx, ny)
  })
  kLower.closePath()

  const mLeft = new THREE.Shape()
  ;[
    [33.5, 19],
    [39.1, 19],
    [39.1, 45],
    [33.5, 45],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) mLeft.moveTo(nx, ny)
    else mLeft.lineTo(nx, ny)
  })
  mLeft.closePath()

  const mPeakL = new THREE.Shape()
  ;[
    [39.1, 19],
    [44.9, 34.2],
    [41.6, 45],
    [37.4, 45],
    [39.1, 32.6],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) mPeakL.moveTo(nx, ny)
    else mPeakL.lineTo(nx, ny)
  })
  mPeakL.closePath()

  const mPeakR = new THREE.Shape()
  ;[
    [44.9, 34.2],
    [50.8, 19],
    [56.5, 19],
    [56.5, 45],
    [51.2, 45],
    [51.2, 32.6],
    [45.8, 45],
    [41.6, 45],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) mPeakR.moveTo(nx, ny)
    else mPeakR.lineTo(nx, ny)
  })
  mPeakR.closePath()

  const accent = new THREE.Shape()
  ;[
    [20.4, 31.4],
    [33.5, 31.4],
    [33.5, 33.0],
    [20.4, 33.0],
  ].forEach(([x, y], i) => {
    const [nx, ny] = toLocal(x, y)
    if (i === 0) accent.moveTo(nx, ny)
    else accent.lineTo(nx, ny)
  })
  accent.closePath()

  return [kStem, kUpper, kLower, mLeft, mPeakL, mPeakR, accent]
}

function MarkMesh({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  // Slightly larger + deeper = more sculptural center-stage presence
  const scale = 0.098

  const hexGeo = useMemo(() => {
    const shape = hexShape(scale)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.042,
      bevelSegments: 4,
      curveSegments: 1,
    })
    geo.center()
    geo.translate(0, 0, -0.16)
    return geo
  }, [])

  const letterGeos = useMemo(() => {
    return letterShapes(scale).map((shape, idx) => {
      const depth = idx === 6 ? 0.09 : 0.145
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.014,
        bevelSegments: 2,
        curveSegments: 1,
      })
      geo.translate(0, 0, 0.155)
      return geo
    })
  }, [])

  const plateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#161412',
        metalness: 0.48,
        roughness: 0.42,
        emissive: new THREE.Color('#1c1917'),
        emissiveIntensity: 0.18,
      }),
    [],
  )

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c45d2c',
        metalness: 0.65,
        roughness: 0.28,
        emissive: new THREE.Color('#c45d2c'),
        emissiveIntensity: 0.48,
      }),
    [],
  )

  const ivoryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f5f0e8',
        metalness: 0.28,
        roughness: 0.32,
        emissive: new THREE.Color('#f5f0e8'),
        emissiveIntensity: 0.18,
      }),
    [],
  )

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c45d2c',
        metalness: 0.5,
        roughness: 0.28,
        emissive: new THREE.Color('#c45d2c'),
        emissiveIntensity: 0.7,
      }),
    [],
  )

  const edgeGeo = useMemo(() => {
    const shape = hexShape(scale * 1.025)
    const hole = hexShape(scale * 0.935)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: false,
      curveSegments: 1,
    })
    geo.translate(0, 0, 0.17)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!active || !group.current) return
    group.current.rotation.y += delta * 0.085
  })

  useEffect(
    () => () => {
      hexGeo.dispose()
      edgeGeo.dispose()
      letterGeos.forEach((g) => g.dispose())
      plateMat.dispose()
      rimMat.dispose()
      ivoryMat.dispose()
      accentMat.dispose()
    },
    [hexGeo, edgeGeo, letterGeos, plateMat, rimMat, ivoryMat, accentMat],
  )

  return (
    <group ref={group} position={[0, 0.28, 0]} rotation={[0.2, -0.28, 0.035]}>
      <Float speed={0.65} rotationIntensity={0.12} floatIntensity={0.2}>
        <mesh geometry={hexGeo} material={plateMat} />
        <mesh geometry={edgeGeo} material={rimMat} />
        {letterGeos.map((geo, i) => (
          <mesh key={i} geometry={geo} material={i === 6 ? accentMat : ivoryMat} />
        ))}
      </Float>
    </group>
  )
}

/** Soft dust field — living volume around the mark. */
function ParticleField({ active, pointer }: { active: boolean; pointer: PointerNorm }) {
  const points = useRef<THREE.Points>(null)
  const count = 680

  const { positions, phases, bases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    const base = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Biased toward a volumetric cone around the mark
      const r = 0.6 + Math.pow(Math.random(), 0.65) * 4.8
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.42) * 5.8
      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r * 0.9 - 0.8
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph, bases: base }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.032,
        color: new THREE.Color('#a8b6d4'),
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(({ clock }) => {
    if (!active || !points.current) return
    const t = clock.elapsedTime
    const attr = points.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const drift = Math.sin(t * 0.32 + phases[i]) * 0.12
      arr[ix] = bases[ix] + pointer.x * 0.22 + Math.cos(t * 0.15 + phases[i]) * 0.06
      arr[ix + 1] = bases[ix + 1] + drift
      arr[ix + 2] = bases[ix + 2] + pointer.y * 0.12
    }
    attr.needsUpdate = true
    points.current.rotation.y = t * 0.018
  })

  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )

  return <points ref={points} geometry={geo} material={mat} />
}

/** Soft fog slabs — fake volumetric depth without heavy shaders. */
function FogVolumes({ pointer }: { pointer: PointerNorm }) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (a.current) {
      a.current.position.x = pointer.x * 0.35
      a.current.position.y = -0.2 + Math.sin(t * 0.2) * 0.08
      const mat = a.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.07 + Math.sin(t * 0.35) * 0.015
    }
    if (b.current) {
      b.current.position.x = -pointer.x * 0.25
      b.current.rotation.z = t * 0.04
      const mat = b.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.05 + Math.cos(t * 0.28) * 0.012
    }
  })

  return (
    <>
      <mesh ref={a} position={[0, -0.15, -0.4]} scale={[5.5, 2.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#8b9dc3"
          transparent
          opacity={0.075}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={b} position={[0.4, 0.6, -1.2]} scale={[4.2, 3.4, 1]} rotation={[0.15, 0, 0.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#c45d2c"
          transparent
          opacity={0.045}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

/** Soft ground disc — anchors mark in a stage, not a void. */
function StageFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.95, 0.2]}>
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial
          color="#12100e"
          metalness={0.25}
          roughness={0.85}
          transparent
          opacity={0.62}
          emissive="#1c1917"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Soft spotlight pool on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.94, 0.2]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial
          color="#f5f0e8"
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function Lights({ pointer }: { pointer: PointerNorm }) {
  const key = useRef<THREE.SpotLight>(null)
  const follow = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.SpotLight>(null)
  const target = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    // Premium pointer follow — smooth, constrained, never washes the stage
    if (follow.current) {
      const tx = pointer.x * 2.2
      const ty = 1.35 + pointer.y * 1.1
      follow.current.position.x += (tx - follow.current.position.x) * 0.07
      follow.current.position.y += (ty - follow.current.position.y) * 0.07
      // Intensity breathes slightly with pointer magnitude (subtle)
      const mag = Math.min(1, Math.hypot(pointer.x, pointer.y))
      follow.current.intensity = 0.85 + mag * 0.55
    }
    if (key.current) {
      key.current.position.x += (1.85 + pointer.x * 0.55 - key.current.position.x) * 0.045
      key.current.position.y += (4.35 + pointer.y * 0.28 - key.current.position.y) * 0.045
    }
    if (rim.current) {
      rim.current.position.x += (-3.4 - pointer.x * 0.35 - rim.current.position.x) * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} color="#7a8aad" />
      <hemisphereLight args={['#2a3348', '#100e0c', 0.32]} />
      <primitive object={target} position={[0, 0.25, 0]} />
      {/* Strong ivory key — sculptural highlight on extruded mark */}
      <spotLight
        ref={key}
        position={[1.9, 4.4, 5.0]}
        angle={0.28}
        penumbra={0.92}
        intensity={5.6}
        color="#f5f0e8"
        distance={22}
        decay={1.35}
        target={target}
      />
      {/* Tight secondary key from front-left — depth on bevels */}
      <spotLight
        position={[-1.2, 3.2, 4.5]}
        angle={0.4}
        penumbra={0.85}
        intensity={1.35}
        color="#d4cfc6"
        distance={16}
        decay={1.6}
        target={target}
      />
      {/* Terracotta rim */}
      <spotLight
        ref={rim}
        position={[-3.5, 1.7, -2.5]}
        angle={0.48}
        penumbra={0.78}
        intensity={2.15}
        color="#c45d2c"
        distance={15}
        decay={1.65}
      />
      <directionalLight position={[4.5, 0.6, 2.0]} intensity={0.32} color="#9aabcf" />
      {/* Pointer-reactive warm fill — kept soft so UI text stays readable */}
      <pointLight
        ref={follow}
        position={[0, 1.35, 3.4]}
        intensity={0.95}
        color="#d4c4b0"
        distance={9}
        decay={2.1}
      />
    </>
  )
}

function Atmosphere({ active, pointer, scrollT }: SceneProps) {
  const root = useRef<THREE.Group>(null)
  const { scene, camera } = useThree()

  useEffect(() => {
    // Deeper fog = volumetric room feel
    scene.fog = new THREE.FogExp2('#1c1917', 0.062)
    return () => {
      scene.fog = null
    }
  }, [scene])

  useFrame(() => {
    if (!root.current) return
    // Intentional scroll settle: drift down, ease back, slight dim via scale
    const y = -scrollT * 1.45
    const z = scrollT * 0.55
    const s = 1 - scrollT * 0.12
    root.current.position.y += (y - root.current.position.y) * 0.055
    root.current.position.z += (z - root.current.position.z) * 0.055
    root.current.scale.setScalar(root.current.scale.x + (s - root.current.scale.x) * 0.055)
    // Subtle stage tilt toward pointer
    root.current.rotation.x += (pointer.y * 0.055 - root.current.rotation.x) * 0.035
    root.current.rotation.y += (pointer.x * 0.07 - root.current.rotation.y) * 0.035
    // Camera ease on scroll — slight push-in then settle back feel via FOV proxy (pos)
    camera.position.y += (0.35 - scrollT * 0.25 - camera.position.y) * 0.04
  })

  return (
    <group ref={root}>
      <Lights pointer={pointer} />
      <StageFloor />
      <FogVolumes pointer={pointer} />
      <ParticleField active={active} pointer={pointer} />
      <MarkMesh active={active} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.62}
          luminanceThreshold={0.48}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </group>
  )
}

export function LogoSpotlightScene({ active, pointer, scrollT }: SceneProps) {
  return (
    <Canvas
      className="dd-logo-spotlight-canvas"
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.35, 6.6], fov: 28, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#000000'), 0)
        gl.toneMappingExposure = 1.18
      }}
      frameloop={active ? 'always' : 'never'}
    >
      <Atmosphere active={active} pointer={pointer} scrollT={scrollT} />
    </Canvas>
  )
}
