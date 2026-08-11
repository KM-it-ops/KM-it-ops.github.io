import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type RefObject,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

type Vec2 = { x: number; y: number }

function Lens({
  active,
  phase,
  pointer,
  scale = 1,
}: {
  active: boolean
  phase: number
  pointer: RefObject<Vec2>
  scale?: number
}) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const ringC = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)

  const coreMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f4f7ff',
        metalness: 0.2,
        roughness: 0.12,
        transmission: 0.28,
        thickness: 1.1,
        ior: 1.4,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [120, 540],
        transparent: true,
        opacity: 0.94,
        emissive: new THREE.Color('#6b7cff'),
        emissiveIntensity: 0.08,
      }),
    [],
  )

  const ringMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f2f2f7',
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 0.9,
        iridescence: 0.9,
        iridescenceThicknessRange: [200, 700],
        emissive: new THREE.Color('#9eb6ff'),
        emissiveIntensity: 0.12,
      }),
    [],
  )

  useFrame((state, delta) => {
    if (!active || !group.current) return
    const t = state.clock.elapsedTime
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    group.current.rotation.y += delta * (0.12 + phase * 0.08)
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      py * 0.35 + Math.sin(t * 0.35) * 0.06,
      0.04,
    )
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -px * 0.2,
      0.04,
    )
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      px * 0.45,
      0.05,
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      py * 0.28,
      0.05,
    )

    const breathe = (1 + Math.sin(t * 1.1) * 0.02 + phase * 0.1) * scale
    if (core.current) core.current.scale.setScalar(breathe)

    const open = (1.65 + phase * 1.2) * scale
    if (ringA.current) {
      ringA.current.scale.setScalar(
        THREE.MathUtils.lerp(ringA.current.scale.x, open, 0.05),
      )
      ringA.current.rotation.x += delta * 0.2
    }
    if (ringB.current) {
      ringB.current.scale.setScalar(
        THREE.MathUtils.lerp(ringB.current.scale.x, open * 1.28, 0.05),
      )
      ringB.current.rotation.y -= delta * 0.16
    }
    if (ringC.current) {
      ringC.current.scale.setScalar(
        THREE.MathUtils.lerp(ringC.current.scale.x, open * 1.55, 0.05),
      )
      ringC.current.rotation.z += delta * 0.11
    }

    coreMat.iridescenceThicknessRange = [120 + phase * 200, 540 + phase * 360]
    if (light.current) {
      light.current.intensity = 1.25 + Math.sin(t * 2) * 0.18 + phase * 0.7
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.12} floatIntensity={0.32}>
        <mesh ref={core} material={coreMat}>
          <sphereGeometry args={[1.05, 96, 96]} />
        </mesh>
      </Float>
      <mesh ref={ringA} rotation={[Math.PI / 2.2, 0.15, 0]} material={ringMat}>
        <torusGeometry args={[1.55, 0.012, 16, 180]} />
      </mesh>
      <mesh ref={ringB} rotation={[0.55, 0.8, 0.2]} material={ringMat}>
        <torusGeometry args={[1.55, 0.008, 12, 160]} />
      </mesh>
      <mesh ref={ringC} rotation={[1.1, -0.4, 0.5]} material={ringMat}>
        <torusGeometry args={[1.55, 0.005, 12, 160]} />
      </mesh>
      <pointLight
        ref={light}
        position={[2.2, 1.4, 2]}
        intensity={1.3}
        color="#dbe7ff"
      />
    </group>
  )
}

function PointerTracker({
  raw,
  smooth,
  enabled,
}: {
  raw: MutableRefObject<Vec2>
  smooth: MutableRefObject<Vec2>
  enabled: boolean
}) {
  const { size } = useThree()

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      raw.current.x = (e.clientX / window.innerWidth) * 2 - 1
      raw.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      raw.current.x = 0
      raw.current.y = 0
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, raw, size])

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 5.5)
    smooth.current.x += (raw.current.x - smooth.current.x) * k
    smooth.current.y += (raw.current.y - smooth.current.y) * k
  })

  return null
}

type Props = {
  reducedMotion: boolean
  visible: boolean
  phase?: number
  allowPointer?: boolean
  className?: string
  cameraZ?: number
  lensScale?: number
}

export function HeroScene({
  reducedMotion,
  visible,
  phase = 0,
  allowPointer = true,
  className = 'hero-canvas',
  cameraZ = 5.4,
  lensScale = 1,
}: Props) {
  const raw = useRef<Vec2>({ x: 0, y: 0 })
  const smooth = useRef<Vec2>({ x: 0, y: 0 })

  if (reducedMotion) {
    return <div className={`hero-poster ${className}`} aria-hidden />
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, cameraZ], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#000000'), 0)
          gl.toneMappingExposure = 1.15
        }}
        frameloop={visible ? 'always' : 'never'}
      >
        <fog attach="fog" args={['#070b0a', 9, 18]} />
        <ambientLight intensity={0.32} />
        <directionalLight position={[5, 7, 4]} intensity={1.7} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.55} color="#8eb6ff" />
        <directionalLight position={[0, -3, 2]} intensity={0.4} color="#c4b5fd" />
        <Suspense fallback={null}>
          <PointerTracker raw={raw} smooth={smooth} enabled={allowPointer && visible} />
          <Lens active={visible} phase={phase} pointer={smooth} scale={lensScale} />
        </Suspense>
      </Canvas>
    </div>
  )
}
