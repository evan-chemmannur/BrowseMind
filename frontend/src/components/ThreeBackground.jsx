import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ---- Particles ----
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 80 : 250
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    const phases = []

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      velocities.push({ x: (Math.random() - 0.5) * 0.02, y: 0.03 + Math.random() * 0.04 })
      phases.push(Math.random() * Math.PI * 2)
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({ 
      color: 0x22D3EE, 
      size: 0.18, 
      transparent: true, 
      opacity: 0.35,
      sizeAttenuation: true
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ---- 3D Shapes ----
    const shapeMat = (color) => new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    })

    const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(5, 0), shapeMat(0x7C3AED))
    icosa.position.set(-18, 6, -10)
    scene.add(icosa)

    const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(4, 1.2, 80, 12), shapeMat(0x06B6D4))
    torusKnot.position.set(18, -5, -15)
    scene.add(torusKnot)

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), shapeMat(0x22D3EE))
    octa.position.set(0, -14, -8)
    scene.add(octa)

    // ---- Animation ----
    let frame = 0
    const animate = () => {
      const raf = requestAnimationFrame(animate)
      frame++

      const pos = pGeo.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3]     += Math.sin(phases[i] + frame * 0.008) * 0.015
        pos[i * 3 + 1] += velocities[i].y
        if (pos[i * 3 + 1] > 40) pos[i * 3 + 1] = -40
      }
      pGeo.attributes.position.needsUpdate = true

      icosa.rotation.x += 0.0015
      icosa.rotation.y += 0.001

      torusKnot.rotation.x += 0.001
      torusKnot.rotation.z += 0.0012

      octa.rotation.y += 0.002
      octa.rotation.x += 0.0008

      renderer.render(scene, camera)
    }
    const rafId = requestAnimationFrame(animate)

    // ---- Resize ----
    const onResize = () => {
      const w2 = mount.clientWidth
      const h2 = mount.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 50%), linear-gradient(180deg, #020010 0%, #050020 50%, #020010 100%)'
      }}
    />
  )
}
