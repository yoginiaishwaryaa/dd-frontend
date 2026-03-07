import { useEffect, useRef } from 'react'

interface RippleCanvasProps {
    className?: string
}

export function RippleCanvas({ className }: RippleCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const prevMouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const PARTICLE_SPACING = 12
        const INTERACTION_RADIUS = 30 // Larger radius for flow
        const DRAG_FORCE = 0.20 // Force of the flow
        const SPRING_STRENGTH = 0.05
        const FRICTION = 0.92
        const BASE_RADIUS = 8 // Radius of each water particle

        // Color Setup
        const COLOR = '#2A4D88' // Deep Blue

        let animationFrameId: number
        let particles: Particle[] = []

        class Particle {
            x: number
            y: number
            originX: number
            originY: number
            vx: number
            vy: number

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.originX = x
                this.originY = y
                this.vx = 0
                this.vy = 0
            }

            update(_width: number, _height: number, mvx: number, mvy: number) {
                // 1. Calculate distance to mouse/touch
                const dx = this.x - mouseRef.current.x
                const dy = this.y - mouseRef.current.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                // 2. Drag/Flow Force (Follow the mouse movement)
                if (distance < INTERACTION_RADIUS) {
                    const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS

                    // Add mouse velocity to particle velocity (Drag)
                    this.vx += mvx * force * DRAG_FORCE
                    this.vy += mvy * force * DRAG_FORCE
                }

                // 3. Spring Force (Return to origin)
                const springDx = this.originX - this.x
                const springDy = this.originY - this.y

                this.vx += springDx * SPRING_STRENGTH
                this.vy += springDy * SPRING_STRENGTH

                // 4. Update Position & Apply Friction
                this.vx *= FRICTION
                this.vy *= FRICTION
                this.x += this.vx
                this.y += this.vy
            }

            draw(ctx: CanvasRenderingContext2D) {
                // Draw as a simple circle
                ctx.beginPath()
                ctx.arc(this.x, this.y, BASE_RADIUS, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const handleResize = () => {
            // Set canvas size to match parent container (or specific size)
            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()

            // Fallback for foreignObject or initial render issues
            const width = rect.width || canvas.clientWidth || 800
            const height = rect.height || canvas.clientHeight || 200

            const dpr = window.devicePixelRatio || 1
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            // Re-init particles based on new size
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            // Reset particles to cover the new area
            const logicalWidth = width
            const logicalHeight = height

            particles = []
            const rows = Math.ceil(logicalHeight / PARTICLE_SPACING) + 2
            const cols = Math.ceil(logicalWidth / PARTICLE_SPACING) + 2

            for (let i = -1; i < cols; i++) {
                for (let j = -1; j < rows; j++) {
                    // Slightly offset rows for hexagonal packing feel
                    const offsetX = (j % 2) * (PARTICLE_SPACING / 2)
                    particles.push(new Particle(i * PARTICLE_SPACING + offsetX, j * PARTICLE_SPACING))
                }
            }
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = COLOR

            const width = canvas.width
            const height = canvas.height

            // Calculate Mouse Velocity
            const mvx = mouseRef.current.x - prevMouseRef.current.x
            const mvy = mouseRef.current.y - prevMouseRef.current.y

            // Update prev position
            prevMouseRef.current = { ...mouseRef.current }

            particles.forEach(p => {
                p.update(width, height, mvx, mvy)
                p.draw(ctx)
            })

            animationFrameId = requestAnimationFrame(render)
        }

        // Initial setup
        handleResize()
        window.addEventListener('resize', handleResize)
        render()

        // Event Listeners
        const updateMouse = (x: number, y: number) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: x - rect.left,
                y: y - rect.top
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            updateMouse(e.clientX, e.clientY)
        }

        const onLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        window.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mouseleave', onLeave)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', onMouseMove)
            canvas.removeEventListener('mouseleave', onLeave)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    )
}


