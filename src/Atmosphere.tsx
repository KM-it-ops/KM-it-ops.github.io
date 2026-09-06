/**
 * Night Dossier v2.7 — Active Theory cinematic atmosphere.
 * Multi-layer aurora silk, denser elegant particles, stronger pointer coupling,
 * scroll-scrubbed color shift, soft vignette / light shafts / engineered grain.
 * No 3D logo. Lazy, pause-aware; prefers-reduced-motion → static CSS poster.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotionPref } from './motion'

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_ptr;
uniform float u_scroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  // Stronger pointer parallax (engineered, not twitchy)
  p += u_ptr * 0.11;
  float t = u_time * 0.042;
  float sc = clamp(u_scroll, 0.0, 1.0);

  // Depth layers — silk / aurora / ribbon / underglow
  float n1 = fbm(p * 1.25 + vec2(t * 0.65, t * 0.32));
  float n2 = fbm(p * 2.05 - vec2(t * 0.38, -t * 0.52) + n1 * 0.42);
  float n3 = fbm(p * 3.1 + vec2(-t * 0.22, t * 0.41) + n2 * 0.25);
  float band = smoothstep(0.22, 0.78, n1 * 0.45 + n2 * 0.4 + n3 * 0.2);
  float ribbon = smoothstep(0.4, 0.88, fbm(p * 0.85 + vec2(-t * 0.28, t * 0.48)));
  float silk = smoothstep(0.35, 0.9, fbm(p * 1.7 + vec2(t * 0.18, -t * 0.3) + ribbon * 0.2));

  vec3 deep = vec3(0.078, 0.071, 0.063);      // #141210
  vec3 paper = vec3(0.110, 0.098, 0.090);     // #1c1917
  vec3 indigo = vec3(0.545, 0.616, 0.765);    // #8b9dc3
  vec3 indigoSoft = vec3(0.604, 0.671, 0.812);
  vec3 indigoDeep = vec3(0.35, 0.42, 0.58);
  vec3 terra = vec3(0.769, 0.365, 0.173);     // #c45d2c
  vec3 warm = vec3(0.72, 0.55, 0.38);

  // Scroll-scrubbed palette: indigo-forward at top → warmer terracotta wash deeper
  vec3 accentA = mix(indigo, mix(indigoSoft, warm, 0.35), sc);
  vec3 accentB = mix(indigoDeep, terra, sc * 0.55);
  vec3 accentC = mix(terra, indigo, 0.35 + sc * 0.25);

  vec3 col = mix(deep, paper, uv.y * 0.5 + 0.18);
  col += accentA * band * 0.28;
  col += indigoSoft * ribbon * 0.16;
  col += accentB * silk * 0.14;
  col += accentC * pow(ribbon * band, 1.45) * 0.14;
  col += warm * pow(silk * n3, 2.0) * 0.06 * (0.4 + sc * 0.6);

  // Soft light shafts (diagonal, low contrast — engineered stage)
  float shaft1 = pow(max(0.0, 1.0 - abs((p.x * 0.7 + p.y * 1.1 + 0.15 + u_ptr.x * 0.08) * 1.8)), 3.2);
  float shaft2 = pow(max(0.0, 1.0 - abs((p.x * -0.55 + p.y * 1.0 - 0.35 + u_ptr.y * 0.06) * 2.1)), 3.5);
  col += indigo * shaft1 * 0.07;
  col += accentC * shaft2 * 0.045;

  // Upper glow pool + pointer-biased secondary pool
  float pool = exp(-length((uv - vec2(0.52 + u_ptr.x * 0.04, 0.16 - u_ptr.y * 0.02)) * vec2(1.55, 2.35)) * 2.9);
  float pool2 = exp(-length((uv - vec2(0.28 + u_ptr.x * 0.05, 0.55)) * vec2(2.2, 1.8)) * 3.4);
  col += indigo * pool * 0.18;
  col += accentC * pool2 * 0.08;

  // Cinematic vignette
  float vig = smoothstep(1.35, 0.22, length(p * vec2(1.08, 1.25)));
  col *= mix(0.62, 1.0, vig);

  // Fine film grain in-shader (engineered, not wallpaper)
  float grain = (hash(gl_FragCoord.xy + fract(u_time * 17.0)) - 0.5) * 0.035;
  col += grain;

  // Scroll settles atmosphere (content stays primary)
  float fade = mix(1.0, 0.32, sc);
  col = mix(paper, col, fade);

  gl_FragColor = vec4(col, 1.0);
}
`

type Particle = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  warm: boolean
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

function useScrollT(enabled: boolean) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!enabled) {
      setT(0)
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop
        const vh = window.innerHeight || 1
        const raw = Math.min(1, Math.max(0, y / (vh * 1.55)))
        setT(raw * raw)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])
  return t
}

function usePointer(enabled: boolean) {
  const ref = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }
    const onMove = (e: MouseEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])
  return ref
}

function usePageVisible() {
  const [visible, setVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState !== 'hidden',
  )
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
  return visible
}

function AuroraCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollT = useScrollT(active)
  const pointer = usePointer(active)
  const scrollRef = useRef(0)
  scrollRef.current = scrollT

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uPtr = gl.getUniformLocation(prog, 'u_ptr')
    const uScroll = gl.getUniformLocation(prog, 'u_scroll')

    let raf = 0
    let start = performance.now()
    let w = 0
    let h = 0
    const ptrSmooth = { x: 0, y: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, Math.floor(window.innerWidth * dpr))
      h = Math.max(1, Math.floor(window.innerHeight * dpr))
      canvas.width = w
      canvas.height = h
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      gl.viewport(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = (now: number) => {
      // Snappier pointer coupling than v2.6
      ptrSmooth.x += (pointer.current.x - ptrSmooth.x) * 0.065
      ptrSmooth.y += (pointer.current.y - ptrSmooth.y) * 0.065
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uPtr, ptrSmooth.x, ptrSmooth.y)
      gl.uniform1f(uScroll, scrollRef.current)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [active, pointer])

  return <canvas ref={canvasRef} className="dd-atmos-aurora" aria-hidden="true" />
}

function ParticleField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollT = useScrollT(active)
  const pointer = usePointer(active)
  const scrollRef = useRef(0)
  scrollRef.current = scrollT

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const particles: Particle[] = []
    // Denser but elegant — soft points, not snow
    const COUNT = 92

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.floor(window.innerWidth * dpr)
      h = Math.floor(window.innerHeight * dpr)
      canvas.width = w
      canvas.height = h
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      if (!particles.length) {
        for (let i = 0; i < COUNT; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.45 + Math.random() * 1.65,
            vx: (Math.random() - 0.5) * 0.14,
            vy: -0.06 - Math.random() * 0.16,
            a: 0.1 + Math.random() * 0.32,
            warm: Math.random() > 0.78,
          })
        }
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const dim = 1 - scrollRef.current * 0.7
      const px = pointer.current.x
      const py = pointer.current.y
      for (const p of particles) {
        // Subtle pointer attraction — elegant coupling
        p.vx += px * 0.0032
        p.vy += -py * 0.0018
        p.vx *= 0.992
        p.vy = p.vy * 0.995 - 0.002
        p.x += p.vx
        p.y += p.vy
        if (p.y < -12) {
          p.y = h + 12
          p.x = Math.random() * w
          p.vx = (Math.random() - 0.5) * 0.14
        }
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
        const alpha = p.a * dim
        ctx.beginPath()
        if (p.warm) {
          ctx.fillStyle = `rgba(196, 93, 44, ${alpha * 0.85})`
        } else {
          ctx.fillStyle = `rgba(154, 171, 207, ${alpha})`
        }
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, pointer])

  return <canvas ref={canvasRef} className="dd-atmos-particles" aria-hidden="true" />
}

export function Atmosphere() {
  const reduced = useReducedMotionPref()
  const visible = usePageVisible()
  const scrollT = useScrollT(!reduced)
  const live = !reduced && visible

  const style = reduced
    ? undefined
    : ({ opacity: 0.58 + (1 - scrollT) * 0.42 } as CSSProperties)

  return (
    <div className="dd-atmos" aria-hidden="true" style={style}>
      {reduced ? (
        <div className="dd-atmos-poster" />
      ) : (
        <>
          <AuroraCanvas active={live} />
          <ParticleField active={live} />
        </>
      )}
      <div className="dd-atmos-veil" />
      <div className="dd-atmos-shafts" />
      <div className="dd-atmos-vignette" />
      <div className="dd-atmos-grain" />
    </div>
  )
}
