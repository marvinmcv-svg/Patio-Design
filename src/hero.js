// Three.js particle wordmark: assembles from a spiral galaxy, repels from cursor, sparkles,
// swirls back into a galaxy on scroll. Colors follow the Patio Design leaf (lime → emerald).
import * as THREE from 'three'

export function createHero(canvas, { lines = ['PATIO', 'DESIGN'], phone = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !phone, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : 2))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 4000)
  camera.position.z = 900
  let W = 1, H = 1, points, mat, raf = 0, visible = true, disposed = false
  const mouse = new THREE.Vector2(9999, 9999)
  let scrollP = 0

  function sample() {
    const N = phone ? 6000 : 30000
    const c = document.createElement('canvas')
    const cw = 1400, ch = 640
    c.width = cw; c.height = ch
    const g = c.getContext('2d', { willReadFrequently: true })
    const fit = (text, maxW, start) => {
      let s = start
      g.font = `600 ${s}px Poppins, sans-serif`
      while (g.measureText(text).width > maxW && s > 20) { s -= 4; g.font = `600 ${s}px Poppins, sans-serif` }
      return s
    }
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'
    const s1 = fit(lines[0], cw * 0.8, 245)
    g.font = `600 ${s1}px Poppins, sans-serif`; g.fillText(lines[0], cw / 2, ch * 0.25)
    const s2 = fit(lines[1], cw * 0.8, s1)
    g.font = `600 ${s2}px Poppins, sans-serif`; g.fillText(lines[1], cw / 2, ch * 0.7)
    const data = g.getImageData(0, 0, cw, ch).data
    const pts = []
    const step = phone ? 4 : 2
    for (let y = 0; y < ch; y += step) for (let x = 0; x < cw; x += step) if (data[(y * cw + x) * 4 + 3] > 128) pts.push([x, y])
    const target = new Float32Array(N * 3), galaxy = new Float32Array(N * 3), color = new Float32Array(N * 3), seed = new Float32Array(N)
    const cA = new THREE.Color('#dff07a'), cB = new THREE.Color('#5fb83f'), cC = new THREE.Color('#a9d86b'), cD = new THREE.Color('#0c9a52'), tmp = new THREE.Color()
    const scale = 1.0
    for (let i = 0; i < N; i++) {
      const p = pts[(Math.random() * pts.length) | 0]
      const x = (p[0] - cw / 2) * scale, y = -(p[1] - ch / 2) * scale
      target.set([x + (Math.random() - 0.5) * 1.5, y + (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 18], i * 3)
      const arm = i % 3, r = Math.pow(Math.random(), 0.6) * 900, a = r * 0.009 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.6
      galaxy.set([Math.cos(a) * r, Math.sin(a) * r * 0.55, (Math.random() - 0.5) * 220], i * 3)
      const line2 = p[1] > ch * 0.55
      const t = (p[0] / cw)
      tmp.copy(line2 ? cC : cA).lerp(line2 ? cD : cB, t)
      color.set([tmp.r, tmp.g, tmp.b], i * 3)
      seed[i] = Math.random()
    }
    return { N, target, galaxy, color, seed }
  }

  function build() {
    const { N, target, galaxy, color, seed } = sample()
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(target, 3))
    geo.setAttribute('aGalaxy', new THREE.BufferAttribute(galaxy, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uAssemble: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector3(9999, 9999, 0) }, uSize: { value: phone ? 3.0 : 2.6 }, uPR: { value: renderer.getPixelRatio() }, uScale: { value: 1 } },
      vertexShader: `
        attribute vec3 aGalaxy; attribute vec3 aColor; attribute float aSeed;
        uniform float uT, uAssemble, uScroll, uSize, uPR, uScale; uniform vec3 uMouse;
        varying vec3 vColor; varying float vA;
        void main(){
          float k = clamp(uAssemble - aSeed*0.35, 0.0, 1.0); k = k*k*(3.0-2.0*k);
          k *= 1.0 - smoothstep(0.0, 1.0, uScroll);
          vec3 g = aGalaxy; float ang = uT*0.06 + length(g.xy)*0.0006;
          g.xy = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * g.xy;
          vec3 p = mix(g, position*uScale, k);
          p.z += sin(uT*1.3 + aSeed*30.0)*4.0*k;
          vec2 d = p.xy - uMouse.xy; float dist = length(d);
          p.xy += normalize(d+0.0001) * smoothstep(140.0, 0.0, dist) * 55.0 * k;
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          gl_Position = projectionMatrix * mv;
          float tw = 0.65 + 0.35*sin(uT*3.0 + aSeed*60.0);
          gl_PointSize = uSize * uPR * (900.0 / -mv.z) * (aSeed > 0.985 ? 2.2 : 1.0);
          vColor = aColor * (aSeed > 0.985 ? 1.6 : 1.0); vA = tw * mix(0.55, 1.0, k);
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vA;
        void main(){ vec2 c = gl_PointCoord-0.5; float d = length(c); if(d>0.5) discard; gl_FragColor = vec4(vColor, vA*smoothstep(0.5,0.0,d)); }`,
    })
    points = new THREE.Points(geo, mat)
    scene.add(points)
  }

  function resize() {
    const r = canvas.getBoundingClientRect()
    W = r.width; H = r.height
    renderer.setSize(W, H, false)
    camera.aspect = W / H; camera.updateProjectionMatrix()
    // fit 1400px-wide wordmark into ~92% of the view width at z=0
    const visW = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect
    const visH = visW / camera.aspect
    if (mat) mat.uniforms.uScale.value = Math.min((visW * 0.8) / 1400, (visH * 0.85) / 640)
  }

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect()
    const visW = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect
    mouse.set(((e.clientX - r.left) / r.width - 0.5) * visW, -((e.clientY - r.top) / r.height - 0.5) * (visW / camera.aspect))
  }
  const onLeave = () => mouse.set(9999, 9999)
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop() })
  io.observe(canvas)

  const clock = new THREE.Clock()
  let assemble = 0
  function loop() {
    if (disposed || !visible || document.hidden) { raf = 0; return }
    raf = requestAnimationFrame(loop)
    const t = clock.getElapsedTime()
    assemble = Math.min(1.35, assemble + 0.008)
    mat.uniforms.uT.value = t
    mat.uniforms.uAssemble.value = assemble
    mat.uniforms.uScroll.value += (scrollP - mat.uniforms.uScroll.value) * 0.08
    mat.uniforms.uMouse.value.lerp(new THREE.Vector3(mouse.x, mouse.y, 0), 0.15)
    points.rotation.y = Math.sin(t * 0.15) * 0.06
    renderer.render(scene, camera)
  }
  const onVis = () => { if (!document.hidden && !raf) loop() }

  ;(async () => {
    try { await Promise.race([document.fonts.load('600 300px Poppins'), new Promise((r) => setTimeout(r, 2500))]) } catch {}
    if (disposed) return
    build(); resize(); loop()
  })()
  addEventListener('resize', resize)
  if (!phone) { addEventListener('pointermove', onMove); canvas.parentElement.addEventListener('pointerleave', onLeave) }
  document.addEventListener('visibilitychange', onVis)

  return {
    setScroll(p) { scrollP = p },
    destroy() {
      disposed = true; cancelAnimationFrame(raf); io.disconnect()
      removeEventListener('resize', resize); removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis)
      points?.geometry.dispose(); mat?.dispose(); renderer.dispose()
    },
  }
}
