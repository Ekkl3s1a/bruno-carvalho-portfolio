import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Constants ─────────────────────────────────────────────────
const N = 4500   // particle count

// Section IDs (order matters — matches DOM)
type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'certifications' | 'contact'

let _globalMorphTo: ((id: SectionId) => void) | null = null

// Framework cluster colours
const CLR = {
  teal:   new THREE.Color('#2DD4BF'),
  teal2:  new THREE.Color('#7AE7DA'),
  teal3:  new THREE.Color('#113d3a'),
  angular:new THREE.Color('#E40035'),
  vue:    new THREE.Color('#42d392'),
  react:  new THREE.Color('#61DAFB'),
  ts:     new THREE.Color('#3178C6'),
  back:   new THREE.Color('#A78BFA'),
  gold:   new THREE.Color('#FBBF24'),
}

// ── Position generators ───────────────────────────────────────

function genHero(): Float32Array {
  const p = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    p[i*3]   = (Math.random() - .5) * 12
    p[i*3+1] = (Math.random() - .5) * 9
    p[i*3+2] = (Math.random() - .5) * 4
  }
  return p
}

function genAbout(): Float32Array {
  const p = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const theta  = Math.random() * Math.PI * 2
    const phi    = Math.acos(2 * Math.random() - 1)
    const r      = 2.8 + Math.random() * 1.2
    p[i*3]   = r * Math.sin(phi) * Math.cos(theta)
    p[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
    p[i*3+2] = r * Math.cos(phi)
  }
  return p
}

function genSkills(): Float32Array {
  const p = new Float32Array(N * 3)
  // 5 clusters: Angular, Vue, React, TypeScript, Backend
  const centres = [[-3,1.5,0],[0,2.2,0],[3,1.5,0],[-2,-1.2,0],[2,-1.2,0]]
  const each    = Math.floor(N / centres.length)
  for (let c = 0; c < centres.length; c++) {
    for (let i = 0; i < each; i++) {
      const idx = (c * each + i) * 3
      p[idx]   = centres[c][0] + (Math.random() - .5) * .9
      p[idx+1] = centres[c][1] + (Math.random() - .5) * .9
      p[idx+2] = centres[c][2] + (Math.random() - .5) * .5
    }
  }
  return p
}

function genProjects(): Float32Array {
  const p    = new Float32Array(N * 3)
  const cols = 52, rows = 7
  const sp   = 0.19
  for (let i = 0; i < N; i++) {
    const gi   = i % (cols * rows)
    p[i*3]   = (gi % cols - cols/2) * sp
    p[i*3+1] = (Math.floor(gi / cols) - rows/2) * sp * 1.6
    p[i*3+2] = (Math.random() - .5) * .35
  }
  return p
}

function genCertifications(): Float32Array {
  const p = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const t = i / N
    const x = (t - .5) * 8
    const y = Math.sin(t * Math.PI) * 1.4
    const z = (Math.random() - .5) * .6
    p[i*3] = x; p[i*3+1] = y; p[i*3+2] = z
  }
  return p
}

function genContact(): Float32Array {
  const p = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const t     = i / N
    const angle = t * Math.PI * 16
    const r     = (1 - t) * 3.5
    p[i*3]   = Math.cos(angle) * r
    p[i*3+1] = Math.sin(angle) * r
    p[i*3+2] = (t - .5) * 2
  }
  return p
}

// ── Colour generators ─────────────────────────────────────────

function colHero(): Float32Array {
  const c = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const m   = Math.random()
    const col = m < .55 ? CLR.teal : m < .78 ? CLR.teal2 : CLR.teal3
    c[i*3] = col.r; c[i*3+1] = col.g; c[i*3+2] = col.b
  }
  return c
}

function colSkills(): Float32Array {
  const c    = new Float32Array(N * 3)
  const each = Math.floor(N / 5)
  const palette = [CLR.angular, CLR.vue, CLR.react, CLR.ts, CLR.back]
  for (let ci = 0; ci < 5; ci++) {
    const col = palette[ci]
    for (let i = 0; i < each; i++) {
      const idx = (ci * each + i) * 3
      c[idx] = col.r; c[idx+1] = col.g; c[idx+2] = col.b
    }
  }
  return c
}

function colCerts(): Float32Array {
  const c = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const t   = i / N
    const col = t < .5 ? CLR.teal : CLR.gold
    c[i*3] = col.r; c[i*3+1] = col.g; c[i*3+2] = col.b
  }
  return c
}

export function getMorphTo() {
  return _globalMorphTo
}

// ── Main composable ───────────────────────────────────────────

export function useBackground3D(canvasRef: Ref<HTMLCanvasElement | undefined>) {
  // Three.js handles
  let scene:    THREE.Scene
  let camera:   THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let geo:      THREE.BufferGeometry
  let mat:      THREE.ShaderMaterial
  let pts:      THREE.Points
  let rafId:    number
  let time = 0

  // Morph buffers
  const posNow = new Float32Array(N * 3)
  const posSrc = new Float32Array(N * 3)
  const posDst = new Float32Array(N * 3)
  const morphObj = { t: 0 }

  // Pre-bake all states
  const STATES: Record<SectionId, Float32Array> = {
    hero:           genHero(),
    about:          genAbout(),
    skills:         genSkills(),
    projects:       genProjects(),
    certifications: genCertifications(),
    contact:        genContact(),
  }

  const COLOURS: Partial<Record<SectionId, Float32Array>> = {
    hero:           colHero(),
    skills:         colSkills(),
    certifications: colCerts(),
  }

  // ── Scene init ──────────────────────────────────────────────
  function init(canvas: HTMLCanvasElement) {
    const W = window.innerWidth, H = window.innerHeight

    scene    = new THREE.Scene()
    camera   = new THREE.PerspectiveCamera(75, W/H, .1, 100)
    camera.position.z = 3

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0, 0)

    // Geometry
    geo = new THREE.BufferGeometry()
    posNow.set(STATES.hero)
    posDst.set(STATES.hero)
    geo.setAttribute('position', new THREE.BufferAttribute(posNow.slice(), 3))

    const heroCol = colHero()
    geo.setAttribute('color',    new THREE.BufferAttribute(heroCol, 3))

    // Custom shader — soft circle, additive blending
    mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uSize:    { value: 2.8 },
        uOpacity: { value: .75 },
        uTime:    { value: 0 },
      },
      vertexShader: /* glsl */`
        uniform float uSize;
        uniform float uTime;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (300.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        uniform float uOpacity;
        void main() {
          float d = distance(gl_PointCoord, vec2(.5));
          if (d > .5) discard;
          float a = smoothstep(.5, .0, d) * uOpacity;
          gl_FragColor = vec4(vColor, a);
        }
      `,
    })

    pts = new THREE.Points(geo, mat)
    scene.add(pts)

    window.addEventListener('resize', onResize, { passive: true })
  }

  // ── Morph to section ────────────────────────────────────────
  function morphTo(id: SectionId) {
    gsap.killTweensOf(morphObj)
    posSrc.set(posNow)
    posDst.set(STATES[id])
    morphObj.t = 0

    // Update colours if section has specific palette
    if (COLOURS[id]) {
      geo.setAttribute('color', new THREE.BufferAttribute(COLOURS[id]!.slice(), 3))
    }

    gsap.to(morphObj, {
      t: 1,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate() {
        const t = morphObj.t
        for (let i = 0; i < N * 3; i++) {
          posNow[i] = posSrc[i] + (posDst[i] - posSrc[i]) * t
        }
        geo.attributes.position.needsUpdate = true
      },
    })
  }

  // ── ScrollTrigger wiring ─────────────────────────────────────
  function setupScrollTriggers() {
    const sections: Array<{ id: SectionId; sel: string }> = [
      { id: 'hero',           sel: '#hero' },
      { id: 'about',          sel: '#about' },
      { id: 'skills',         sel: '#skills' },
      { id: 'projects',       sel: '#projects' },
      { id: 'certifications', sel: '#certifications' },
      { id: 'contact',        sel: '#contact' },
    ]

    sections.forEach(({ id, sel }) => {
      if (!document.querySelector(sel)) return
      ScrollTrigger.create({
        trigger:      sel,
        start:        'top 58%',
        onEnter:      () => morphTo(id),
        onEnterBack:  () => morphTo(id),
      })
    })

    // ── Deep Dive: camera + opacity tied to hero scroll ───────
    const hero = document.querySelector('#hero')
    if (hero) {
      gsap.to(camera.position, {
        z: 1.4,
        y: -.6,
        ease: 'none',
        scrollTrigger: {
          trigger:    '#hero',
          start:      'top top',
          end:        'bottom top',
          scrub:      1.2,
          onUpdate: (self) => {
            if (mat?.uniforms) {
              mat.uniforms.uOpacity.value = .75 - self.progress * .22
            }
          },
        },
      })
    }
  }

  // ── Render loop ──────────────────────────────────────────────
  function loop() {
    rafId = requestAnimationFrame(loop)
    time += .004
    if (pts) {
      pts.rotation.y = Math.sin(time * .18) * .08
      pts.rotation.x = Math.cos(time * .13) * .04
    }
    if (mat?.uniforms) mat.uniforms.uTime.value = time
    renderer?.render(scene, camera)
  }

  function onResize() {
    const W = window.innerWidth, H = window.innerHeight
    camera.aspect = W / H
    camera.updateProjectionMatrix()
    renderer.setSize(W, H)
  }

  // ── Lifecycle ────────────────────────────────────────────────
  onMounted(() => {
    if (!canvasRef.value) return
    init(canvasRef.value)
    loop()
    setTimeout(setupScrollTriggers, 120)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    ScrollTrigger.getAll().forEach(t => t.kill())
    renderer?.dispose()
    geo?.dispose()
    mat?.dispose()
  })

  _globalMorphTo = morphTo

  return { morphTo }
}