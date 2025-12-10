<template>
  <canvas ref="canvas" class="fixed inset-0 pointer-events-none z-0"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMouse } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
const { x, y } = useMouse({ type: 'client' }) // Use client coordinates (relative to viewport)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

const particles: Particle[] = []
const particleCount = 50 // Number of particles
const mouseDistance = 200

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0

const initParticles = () => {
  if (!canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height
  
  particles.length = 0
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1
    })
  }
}

const draw = () => {
  if (!ctx || !canvas.value) return
  
  const w = canvas.value.width
  const h = canvas.value.height
  
  ctx.clearRect(0, 0, w, h)
  
  // Update and draw particles
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    
    // Wrap around screen
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0
    
    // Draw particle
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx!.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
    ctx!.fill()
    
    // Connect to mouse
    const dx = x.value - p.x
    const dy = y.value - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < mouseDistance) {
      ctx!.beginPath()
      ctx!.moveTo(p.x, p.y)
      ctx!.lineTo(x.value, y.value)
      const opacity = 1 - dist / mouseDistance
      ctx!.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.5})` // Blue glow
      ctx!.lineWidth = 1
      ctx!.stroke()
      
      // Slight attraction to mouse
      p.x += dx * 0.005
      p.y += dy * 0.005
    }
    
    // Connect to other particles nearby
    /*
    particles.forEach(p2 => {
      const dx2 = p.x - p2.x
      const dy2 = p.y - p2.y
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
      
      if (dist2 < 100) {
        ctx!.beginPath()
        ctx!.moveTo(p.x, p.y)
        ctx!.lineTo(p2.x, p2.y)
        const opacity = 1 - dist2 / 100
        ctx!.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`
        ctx!.stroke()
      }
    })
    */
  })
  
  animationId = requestAnimationFrame(draw)
}

const resize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    initParticles()
  }
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    draw()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
})
</script>
