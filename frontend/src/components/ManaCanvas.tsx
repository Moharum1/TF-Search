import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { ManaCanvasHandle, ParticleColor, ParticleKind } from '../types/grimoire'

interface ParticleOptions {
  type?: ParticleKind
  x?: number
  y?: number
  size?: number
  vx?: number
  vy?: number
  alpha?: number
  life?: number
  colorType?: ParticleColor
}

class ManaParticle {
  type: ParticleKind = 'mote'
  x = 0
  y = 0
  size = 1
  vx = 0
  vy = 0
  angle = 0
  spin = 0
  swayPhase = 0
  swaySpeed = 0.02
  alpha = 0.5
  life = Infinity
  maxLife = Infinity
  colorType: ParticleColor = 'cyan'

  constructor(width: number, height: number, options: ParticleOptions = {}) {
    this.reset(width, height, options)
  }

  reset(width: number, height: number, options: ParticleOptions = {}) {
    this.type = options.type ?? (Math.random() < 0.32 ? 'petal' : 'mote')
    this.x = options.x ?? Math.random() * width
    this.y = options.y ?? Math.random() * height
    this.size =
      this.type === 'petal'
        ? (options.size ?? Math.random() * 5 + 4.5)
        : (options.size ?? Math.random() * 2.2 + 0.8)

    this.vx = options.vx ?? Math.random() * 0.45 - 0.15
    this.vy = options.vy ?? -(Math.random() * 0.45 + 0.15)
    this.angle = Math.random() * Math.PI * 2
    this.spin = (Math.random() - 0.5) * 0.02
    this.swayPhase = Math.random() * Math.PI * 2
    this.swaySpeed = 0.015 + Math.random() * 0.015
    this.alpha = options.alpha ?? Math.random() * 0.55 + 0.2
    this.life = options.life ?? Infinity
    this.maxLife = this.life
    this.colorType =
      options.colorType ?? (this.type === 'petal' ? 'cyan' : Math.random() < 0.55 ? 'gold' : 'cyan')
  }

  update(width: number, height: number, mouse: { x: number; y: number }) {
    this.swayPhase += this.swaySpeed
    this.x += this.vx + Math.sin(this.swayPhase) * 0.35
    this.y += this.vy
    this.angle += this.spin

    const dx = this.x - mouse.x
    const dy = this.y - mouse.y
    const dist = Math.hypot(dx, dy)
    if (dist < 110 && dist > 1) {
      const force = (110 - dist) / 110
      this.x += (dx / dist) * force * 0.9
      this.y += (dy / dist) * force * 0.9
    }

    if (this.life !== Infinity) {
      this.life -= 1
      this.vx *= 0.985
      this.vy *= 0.985
      this.vy -= 0.012
    } else {
      if (this.y < -30) {
        this.y = height + 20
        this.x = Math.random() * width
      }
      if (this.x > width + 30) this.x = -20
      if (this.x < -30) this.x = width + 20
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDawn: boolean) {
    const lifeRatio = this.life === Infinity ? 1 : Math.max(0, this.life / this.maxLife)
    const currentAlpha = this.alpha * lifeRatio
    if (currentAlpha <= 0.01) return

    const cyanRGB = isDawn ? '58, 143, 183' : '139, 224, 255'
    const goldRGB = isDawn ? '166, 124, 55' : '228, 198, 134'
    const rgb = this.colorType === 'cyan' ? cyanRGB : goldRGB

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)

    if (this.type === 'petal') {
      ctx.beginPath()
      ctx.moveTo(0, -this.size)
      ctx.bezierCurveTo(
        this.size * 0.85,
        -this.size * 0.3,
        this.size * 0.65,
        this.size * 0.7,
        0,
        this.size,
      )
      ctx.bezierCurveTo(
        -this.size * 0.65,
        this.size * 0.7,
        -this.size * 0.85,
        -this.size * 0.3,
        0,
        -this.size,
      )
      ctx.fillStyle = `rgba(${rgb}, ${currentAlpha})`
      ctx.shadowColor = `rgba(${rgb}, ${currentAlpha * 0.9})`
      ctx.shadowBlur = isDawn ? 4 : 10
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, this.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb}, ${currentAlpha})`
      ctx.shadowColor = `rgba(${rgb}, ${currentAlpha})`
      ctx.shadowBlur = isDawn ? 3 : 8
      ctx.fill()
    }

    ctx.restore()
  }
}

const AMBIENT_COUNT = 55

export const ManaCanvas = forwardRef<ManaCanvasHandle>(function ManaCanvas(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<ManaParticle[]>([])
  const sizeRef = useRef({ width: window.innerWidth, height: window.innerHeight })
  const timeoutsRef = useRef<number[]>([])

  const spawnBurst = (cx: number, cy: number, count = 26, type: ParticleKind = 'petal') => {
    const { width, height } = sizeRef.current
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3.4 + 0.8
      particlesRef.current.push(
        new ManaParticle(width, height, {
          type: Math.random() < 0.72 ? type : 'mote',
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          alpha: 0.85,
          life: 95 + Math.random() * 65,
          colorType: Math.random() < 0.7 ? 'cyan' : 'gold',
        }),
      )
    }
  }

  useImperativeHandle(ref, () => ({
    spawnBurst,
    spawnSpark: (x: number, y: number) => {
      const { width, height } = sizeRef.current
      particlesRef.current.push(
        new ManaParticle(width, height, {
          type: 'mote',
          x,
          y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.4 + 0.5),
          size: Math.random() * 2 + 1.2,
          alpha: 0.9,
          life: 48,
          colorType: Math.random() < 0.5 ? 'gold' : 'cyan',
        }),
      )
    },
    castFlowerField: () => {
      const { width, height } = sizeRef.current
      for (let i = 0; i < 5; i += 1) {
        const timeoutId = window.setTimeout(() => {
          const x = (width / 6) * (i + 1)
          spawnBurst(x, height - 30, 18, 'petal')
        }, i * 110)
        timeoutsRef.current.push(timeoutId)
      }
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mouse = { x: -999, y: -999 }

    const resizeCanvas = () => {
      sizeRef.current.width = canvas.width = window.innerWidth
      sizeRef.current.height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)

    particlesRef.current = Array.from(
      { length: AMBIENT_COUNT },
      () => new ManaParticle(sizeRef.current.width, sizeRef.current.height),
    )

    let animationFrameId = 0
    const animate = () => {
      const { width, height } = sizeRef.current
      const isDawn = document.documentElement.getAttribute('data-theme') === 'dawn'
      ctx.clearRect(0, 0, width, height)

      const list = particlesRef.current
      for (let i = list.length - 1; i >= 0; i -= 1) {
        const p = list[i]
        p.update(width, height, mouse)
        p.draw(ctx, isDawn)
        if (p.life !== Infinity && p.life <= 0) {
          list.splice(i, 1)
        }
      }

      animationFrameId = window.requestAnimationFrame(animate)
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      timeoutsRef.current.forEach((id) => window.clearTimeout(id))
      timeoutsRef.current = []
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="mana-canvas" />
      <div className="atmosphere-vignette" />
    </>
  )
})
