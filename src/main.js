import * as THREE from 'three'

// ─────────────────────────────────────────
// LOADER
// ─────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide')
  }, 2200)
})

// ─────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────
const cursor = document.getElementById('cursor')
const ring = document.getElementById('cursor-ring')
let mx = 0, my = 0, rx = 0, ry = 0

document.addEventListener('mousemove', e => {
  mx = e.clientX
  my = e.clientY
  cursor.style.left = mx + 'px'
  cursor.style.top = my + 'px'
})

function animateCursor() {
  rx += (mx - rx) * 0.11
  ry += (my - ry) * 0.11
  ring.style.left = rx + 'px'
  ring.style.top = ry + 'px'
  requestAnimationFrame(animateCursor)
}
animateCursor()

// Cursor hover effects
document.querySelectorAll('a, button, .proj-card, .skill-cat, .cert-card, .badge').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'
    cursor.style.height = '20px'
    ring.style.width = '60px'
    ring.style.height = '60px'
    ring.style.borderColor = 'var(--accent)'
  })
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'
    cursor.style.height = '12px'
    ring.style.width = '36px'
    ring.style.height = '36px'
    ring.style.borderColor = 'var(--primary)'
  })
})

// ─────────────────────────────────────────
// THREE.JS BACKGROUND
// ─────────────────────────────────────────
const canvas = document.getElementById('canvas-bg')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 55

// ── Particle Field 1 (cyan) ──
const P1 = 2000
const p1Geo = new THREE.BufferGeometry()
const p1Pos = new Float32Array(P1 * 3)
const p1Vel = new Float32Array(P1 * 3)
for (let i = 0; i < P1 * 3; i += 3) {
  p1Pos[i]   = (Math.random() - 0.5) * 220
  p1Pos[i+1] = (Math.random() - 0.5) * 220
  p1Pos[i+2] = (Math.random() - 0.5) * 220
  p1Vel[i]   = (Math.random() - 0.5) * 0.035
  p1Vel[i+1] = (Math.random() - 0.5) * 0.035
  p1Vel[i+2] = (Math.random() - 0.5) * 0.02
}
p1Geo.setAttribute('position', new THREE.BufferAttribute(p1Pos, 3))
const p1Mat = new THREE.PointsMaterial({ color: 0x00D4FF, size: 0.35, transparent: true, opacity: 0.65 })
const particles1 = new THREE.Points(p1Geo, p1Mat)
scene.add(particles1)

// ── Particle Field 2 (violet) ──
const P2 = 900
const p2Geo = new THREE.BufferGeometry()
const p2Pos = new Float32Array(P2 * 3)
for (let i = 0; i < P2 * 3; i += 3) {
  p2Pos[i]   = (Math.random() - 0.5) * 190
  p2Pos[i+1] = (Math.random() - 0.5) * 190
  p2Pos[i+2] = (Math.random() - 0.5) * 190
}
p2Geo.setAttribute('position', new THREE.BufferAttribute(p2Pos, 3))
const p2Mat = new THREE.PointsMaterial({ color: 0x7C3AED, size: 0.28, transparent: true, opacity: 0.45 })
const particles2 = new THREE.Points(p2Geo, p2Mat)
scene.add(particles2)

// ── Torus Knot (main 3D object) ──
const tkGeo = new THREE.TorusKnotGeometry(14, 3.8, 160, 18)
const tkMat = new THREE.MeshBasicMaterial({ color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.10 })
const torusKnot = new THREE.Mesh(tkGeo, tkMat)
scene.add(torusKnot)

// ── Icosahedron ──
const icoGeo = new THREE.IcosahedronGeometry(8, 1)
const icoMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: 0.13 })
const ico = new THREE.Mesh(icoGeo, icoMat)
ico.position.set(-42, -18, -25)
scene.add(ico)

// ── Floating ring ──
const ringGeo = new THREE.TorusGeometry(22, 0.35, 16, 100)
const ringMat = new THREE.MeshBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.06 })
const ring3d = new THREE.Mesh(ringGeo, ringMat)
ring3d.rotation.x = Math.PI / 3.5
scene.add(ring3d)

// ── Second ring ──
const ring2Geo = new THREE.TorusGeometry(35, 0.2, 16, 120)
const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.05 })
const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
ring2.rotation.y = Math.PI / 4
scene.add(ring2)

// Mouse parallax
let mouseX = 0, mouseY = 0
document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
})

// Animation loop
let t = 0
function animate() {
  requestAnimationFrame(animate)
  t += 0.007

  // Rotate objects
  torusKnot.rotation.x = t * 0.28
  torusKnot.rotation.y = t * 0.45
  ico.rotation.x = t * 0.38
  ico.rotation.z = t * 0.25
  ring3d.rotation.z = t * 0.08
  ring2.rotation.x = t * 0.05
  ring2.rotation.z = t * 0.07

  // Drift particles
  const pos = p1Geo.attributes.position.array
  for (let i = 0; i < P1 * 3; i += 3) {
    pos[i]   += p1Vel[i]
    pos[i+1] += p1Vel[i+1]
    pos[i+2] += p1Vel[i+2]
    if (pos[i] > 110) pos[i] = -110
    if (pos[i] < -110) pos[i] = 110
    if (pos[i+1] > 110) pos[i+1] = -110
    if (pos[i+1] < -110) pos[i+1] = 110
  }
  p1Geo.attributes.position.needsUpdate = true

  // Pulsing opacity
  p1Mat.opacity = 0.45 + Math.sin(t * 1.4) * 0.18

  // Mouse parallax camera movement
  camera.position.x += (mouseX * 9 - camera.position.x) * 0.028
  camera.position.y += (mouseY * 6 - camera.position.y) * 0.028
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}
animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ─────────────────────────────────────────
// TYPEWRITER EFFECT
// ─────────────────────────────────────────
const words = [
  'FULL STACK DEVELOPER',
  'PROBLEM SOLVER',
  'CSE @ LPU',
  'JAVA DEVELOPER',
  'BUILDING FOR THE WEB'
]
let wIndex = 0, cIndex = 0, deleting = false

function typeLoop() {
  const el = document.getElementById('typewriter')
  if (!el) return
  const word = words[wIndex]
  if (!deleting) {
    el.textContent = word.slice(0, ++cIndex)
    if (cIndex === word.length) {
      deleting = true
      setTimeout(typeLoop, 1800)
      return
    }
  } else {
    el.textContent = word.slice(0, --cIndex)
    if (cIndex === 0) {
      deleting = false
      wIndex = (wIndex + 1) % words.length
    }
  }
  setTimeout(typeLoop, deleting ? 48 : 85)
}
typeLoop()

// ─────────────────────────────────────────
// SCROLL HANDLERS
// ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY
  const docHeight = document.body.scrollHeight - window.innerHeight
  const progress = (scrollTop / docHeight) * 100

  // Progress bar
  document.getElementById('progress-bar').style.width = progress + '%'

  // Navbar scroll style
  document.getElementById('navbar').classList.toggle('scrolled', scrollTop > 60)

  // Scroll-to-top button
  document.getElementById('scroll-top').classList.toggle('visible', scrollTop > 400)

  // Animate skill bars when in view
  document.querySelectorAll('.skill-fill').forEach(bar => {
    if (isInViewport(bar) && bar.style.width === '0%' || bar.style.width === '') {
      bar.style.width = bar.dataset.w + '%'
    }
  })

  // Active nav link
  updateActiveNav()
})

function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.88
}

// ─────────────────────────────────────────
// REVEAL ON SCROLL (Intersection Observer)
// ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in')
    }
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
  revealObserver.observe(el)
})

// ─────────────────────────────────────────
// ACTIVE NAV HIGHLIGHT
// ─────────────────────────────────────────
const sections = ['hero', 'about', 'skills', 'projects', 'education', 'certifications', 'contact']

function updateActiveNav() {
  let current = ''
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 200) current = id
  })
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  })
}

// ─────────────────────────────────────────
// PROJECT CARD MOUSE TILT GLOW
// ─────────────────────────────────────────
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mx', x + '%')
    card.style.setProperty('--my', y + '%')
  })
})

// ─────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────
window.openMenu = function () {
  document.getElementById('mobileNav').classList.add('open')
  document.body.style.overflow = 'hidden'
}
window.closeMenu = function () {
  document.getElementById('mobileNav').classList.remove('open')
  document.body.style.overflow = ''
}

// ─────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────
window.sendMsg = function () {
  const name  = document.getElementById('fname').value.trim()
  const email = document.getElementById('femail').value.trim()
  const msg   = document.getElementById('fmsg').value.trim()

  if (!name || !email || !msg) {
    alert('Please fill in all fields.')
    return
  }

  // Show success message (replace with EmailJS integration)
  const successEl = document.getElementById('formSuccess')
  successEl.style.display = 'block'
  document.getElementById('fname').value = ''
  document.getElementById('femail').value = ''
  document.getElementById('fmsg').value = ''

  setTimeout(() => { successEl.style.display = 'none' }, 5000)
}

// ─────────────────────────────────────────
// ADVANCED 3D TILT CARD INTERACTIONS
// ─────────────────────────────────────────
class TiltCard {
  constructor(cardElement) {
    this.card = cardElement
    this.isHovering = false
    this.mouseX = 0
    this.mouseY = 0
    this.rotateX = 0
    this.rotateY = 0
    this.targetRotateX = 0
    this.targetRotateY = 0
    this.idleAnimationId = null
    
    this.init()
  }

  init() {
    // Mouse enter - start tilt tracking
    this.card.addEventListener('mouseenter', () => this.onMouseEnter())
    
    // Mouse move - calculate tilt
    this.card.addEventListener('mousemove', (e) => this.onMouseMove(e))
    
    // Mouse leave - reset tilt
    this.card.addEventListener('mouseleave', () => this.onMouseLeave())
    
    // Touch support for mobile
    this.card.addEventListener('touchstart', () => this.onTouchStart())
    this.card.addEventListener('touchmove', (e) => this.onTouchMove(e))
    this.card.addEventListener('touchend', () => this.onTouchEnd())
  }

  onMouseEnter() {
    this.isHovering = true
    this.card.classList.remove('idle')
    if (this.idleAnimationId) {
      cancelAnimationFrame(this.idleAnimationId)
    }
  }

  onMouseMove(e) {
    if (!this.isHovering) return

    const rect = this.card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate tilt angles (max 15 degrees)
    // rotateX = (mouseY / height - 0.5) * 15deg
    // rotateY = (mouseX / width - 0.5) * -15deg
    this.targetRotateX = ((y / height) - 0.5) * 15
    this.targetRotateY = ((x / width) - 0.5) * -15

    // Update shine/glow position
    const shineX = (x / width) * 100
    const shineY = (y / height) * 100
    this.card.style.setProperty('--shine-x', shineX + '%')
    this.card.style.setProperty('--shine-y', shineY + '%')

    // Update gradient glow position
    this.card.style.setProperty('--mx', shineX + '%')
    this.card.style.setProperty('--my', shineY + '%')

    // Smooth tilt animation with easing
    this.animateTilt()

    // Parallax effect for inner elements
    this.updateParallax(x, y, width, height)
  }

  onMouseLeave() {
    this.isHovering = false
    this.targetRotateX = 0
    this.targetRotateY = 0
    
    // Reset transforms smoothly
    this.card.style.setProperty('--tilt-x', '0deg')
    this.card.style.setProperty('--tilt-y', '0deg')

    // Start idle animation after a short delay
    setTimeout(() => {
      if (!this.isHovering) {
        this.card.classList.add('idle')
      }
    }, 300)
  }

  onTouchStart() {
    this.isHovering = true
    this.card.classList.remove('idle')
  }

  onTouchMove(e) {
    if (!this.isHovering || !e.touches.length) return

    const touch = e.touches[0]
    const rect = this.card.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Reduced tilt intensity for touch (8 degrees max)
    this.targetRotateX = ((y / rect.height) - 0.5) * 8
    this.targetRotateY = ((x / rect.width) - 0.5) * -8

    // Update shine position
    const shineX = (x / rect.width) * 100
    const shineY = (y / rect.height) * 100
    this.card.style.setProperty('--shine-x', shineX + '%')
    this.card.style.setProperty('--shine-y', shineY + '%')

    this.animateTilt()
    this.updateParallax(x, y, rect.width, rect.height)
  }

  onTouchEnd() {
    this.isHovering = false
    this.targetRotateX = 0
    this.targetRotateY = 0
    this.card.style.setProperty('--tilt-x', '0deg')
    this.card.style.setProperty('--tilt-y', '0deg')
    this.card.classList.add('idle')
  }

  animateTilt() {
    // Smooth easing with cubic-bezier interpolation
    const easing = 0.18 // Higher = faster response (0.1-0.3 range)
    
    this.rotateX += (this.targetRotateX - this.rotateX) * easing
    this.rotateY += (this.targetRotateY - this.rotateY) * easing

    this.card.style.setProperty('--tilt-x', this.rotateX.toFixed(2) + 'deg')
    this.card.style.setProperty('--tilt-y', this.rotateY.toFixed(2) + 'deg')

    // Continue animation if not converged
    if (Math.abs(this.targetRotateX - this.rotateX) > 0.1 || 
        Math.abs(this.targetRotateY - this.rotateY) > 0.1) {
      requestAnimationFrame(() => this.animateTilt())
    }
  }

  updateParallax(x, y, width, height) {
    // Inner content parallax (subtle 3D depth effect)
    const parallaxX = ((x / width) - 0.5) * 4 // 4px max offset
    const parallaxY = ((y / height) - 0.5) * 4

    this.card.querySelectorAll('> *').forEach((child, index) => {
      // Different layers move at different speeds for depth
      const speed = 1 - (index * 0.15)
      child.style.transform = `translateZ(${speed * 20}px) translateX(${parallaxX * speed}px) translateY(${parallaxY * speed}px)`
    })
  }
}

// Initialize 3D tilt on all cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.proj-card, .skill-cat, .cert-card')
  
  cards.forEach(card => {
    new TiltCard(card)
  })
})

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.proj-card, .skill-cat, .cert-card')
    cards.forEach(card => {
      if (!card.tiltInitialized) {
        new TiltCard(card)
        card.tiltInitialized = true
      }
    })
  })
} else {
  const cards = document.querySelectorAll('.proj-card, .skill-cat, .cert-card')
  cards.forEach(card => {
    if (!card.tiltInitialized) {
      new TiltCard(card)
      card.tiltInitialized = true
    }
  })
}
