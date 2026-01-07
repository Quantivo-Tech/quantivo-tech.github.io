import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface ShaderTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  config?: {
    amplitude?: number
    frequency?: number
    speed?: number
    decay?: number
  }
}

export function ShaderText({ text, className = "", style = {}, config = {} }: ShaderTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.OrthographicCamera
    renderer: THREE.WebGLRenderer
    material: THREE.ShaderMaterial
    mouse: THREE.Vector2
    time: number
    animationId: number | null
    isMouseMoving: boolean
    lastMouseTime: number
    mouseVelocity: number
    lastMousePosition: THREE.Vector2
  } | null>(null)

  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 })

  // Configuration with defaults
  const { amplitude = 0.02, frequency = 8.0, speed = 2.0, decay = 4.0 } = config

  // Vertex shader
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  // Fragment shader with realistic water physics
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform sampler2D u_texture;
    uniform float u_amplitude;
    uniform float u_frequency;
    uniform float u_speed;
    uniform float u_decay;
    uniform float u_mouseActivity;
    uniform float u_mouseVelocity;
    
    varying vec2 vUv;
    
    // Water physics constants
    const float WATER_SPEED = 0.3;
    const float SURFACE_TENSION = 0.8;
    const float VISCOSITY = 0.6;
    const float GRAVITY = 0.4;
    
    // Generate realistic water ripples
    float waterRipple(vec2 uv, vec2 center, float time, float intensity) {
      float dist = distance(uv, center);
      
      // Primary wave with realistic water physics
      float waveTime = time * WATER_SPEED;
      float phase = dist * u_frequency - waveTime;
      
      // Water wave equation: combines gravity waves and surface tension
      float gravityWave = sin(phase) * exp(-dist * u_decay);
      float capillaryWave = sin(phase * 3.0) * 0.3 * exp(-dist * u_decay * 2.0);
      
      // Combine waves with surface tension effect
      float primaryWave = (gravityWave + capillaryWave) * intensity;
      
      // Secondary reflection wave (water bouncing back)
      float reflectionPhase = dist * u_frequency * 0.7 + waveTime * 0.8;
      float reflection = sin(reflectionPhase) * 0.4 * exp(-dist * u_decay * 1.5) * intensity;
      
      // Tertiary interference patterns (realistic water behavior)
      float interferencePhase = dist * u_frequency * 1.3 - waveTime * 1.2;
      float interference = sin(interferencePhase) * 0.2 * exp(-dist * u_decay * 2.5) * intensity;
      
      return primaryWave + reflection + interference;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 mousePos = u_mouse;
      float dist = distance(mousePos, uv);
      
      // Create pebble-like impact effect
      float impactRadius = 0.6;
      float effectStrength = u_mouseActivity * smoothstep(impactRadius, 0.0, dist);
      
      // Velocity-based intensity (faster movement = bigger splash)
      float velocityImpact = smoothstep(0.0, 0.3, u_mouseVelocity);
      float rippleIntensity = u_amplitude * mix(0.2, 1.5, velocityImpact) * effectStrength;
      
      // Generate multiple wave layers for realistic water
      float wave1 = waterRipple(uv, mousePos, u_time, rippleIntensity);
      float wave2 = waterRipple(uv, mousePos, u_time * 0.8, rippleIntensity * 0.7);
      float wave3 = waterRipple(uv, mousePos, u_time * 1.2, rippleIntensity * 0.5);
      
      // Combine waves with realistic interference
      float totalWave = wave1 + wave2 * SURFACE_TENSION + wave3 * VISCOSITY;
      
      // Apply water distortion to UV coordinates
      vec2 waveOffset = vec2(
        totalWave * 0.4,
        totalWave * 0.6 + sin(uv.x * 10.0 + u_time * 0.5) * 0.1 * effectStrength
      );
      vec2 distortedUV = uv + waveOffset;
      
      // Sample texture with water distortion
      vec4 color = texture2D(u_texture, distortedUV);
      
      // Add realistic water caustics and underwater light effect
      float caustics = sin(dist * 20.0 - u_time * 2.0) * 0.1 + 
                      sin(dist * 15.0 + u_time * 1.5) * 0.08;
      caustics *= exp(-dist * 3.0) * effectStrength;
      
      // Water depth effect (darker in the "deeper" areas)
      float depth = abs(totalWave) * 0.3;
      vec3 waterTint = vec3(0.7, 0.9, 1.0); // Slight blue tint
      color.rgb = mix(color.rgb, color.rgb * waterTint, depth * effectStrength);
      
      // Add shimmering water surface highlights
      float shimmer = sin(uv.x * 30.0 + u_time * 3.0) * sin(uv.y * 25.0 - u_time * 2.5);
      shimmer *= exp(-dist * 5.0) * 0.15 * effectStrength;
      color.rgb += vec3(0.4, 0.7, 1.0) * (caustics + shimmer);
      
      gl_FragColor = color;
    }
  `

  // Check WebGL support
  const checkWebGLSupported = () => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      return !!gl
    } catch (e) {
      return false
    }
  }

  // Create texture from text
  const createTextTexture = (text: string, width: number, height: number) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas size with device pixel ratio for crisp text
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height)

    // Configure text rendering with larger font size and Raleway font
    ctx.fillStyle = "white"
    ctx.font = "300 80px Raleway, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Split text into two lines and center them properly
    const lines = text.split(", ")
    const line1 = lines[0] || "Where SaaS Brands"
    const line2 = lines[1] || "Meet Real Influence"

    // Calculate proper vertical centering with larger font
    const fontSize = 80
    const lineSpacing = 25 // Space between lines
    const totalTextHeight = fontSize * 2 + lineSpacing // Total height of both lines plus spacing
    const centerY = height / 2 // True center of canvas

    // Position lines symmetrically around the center
    const line1Y = centerY - totalTextHeight / 2 + fontSize / 2
    const line2Y = centerY + totalTextHeight / 2 - fontSize / 2

    // Draw text centered both horizontally and vertically
    ctx.fillText(line1, width / 2, line1Y)
    ctx.fillText(line2, width / 2, line2Y)

    // Create Three.js texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }

  // Initialize Three.js scene
  const initScene = () => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const rect = container.getBoundingClientRect()

    setTextDimensions({ width: rect.width, height: rect.height })

    // Create scene
    const scene = new THREE.Scene()

    // Create orthographic camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Transparent background

    // Create text texture
    const textTexture = createTextTexture(text, rect.width, rect.height)

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_resolution: { value: new THREE.Vector2(rect.width, rect.height) },
        u_texture: { value: textTexture },
        u_amplitude: { value: amplitude },
        u_frequency: { value: frequency },
        u_speed: { value: speed },
        u_decay: { value: decay },
        u_mouseActivity: { value: 0.0 },
        u_mouseVelocity: { value: 0.0 },
      },
      transparent: true,
    })

    // Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    sceneRef.current = {
      scene,
      camera,
      renderer,
      material,
      mouse: new THREE.Vector2(0.5, 0.5),
      time: 0,
      animationId: null,
      isMouseMoving: false,
      lastMouseTime: 0,
      mouseVelocity: 0,
      lastMousePosition: new THREE.Vector2(0.5, 0.5),
    }
  }

  // Animation loop
  const animate = () => {
    if (!sceneRef.current) return

    const { scene, camera, renderer, material } = sceneRef.current

    sceneRef.current.time += 0.016 // ~60fps

    // Simulate water physics - ripples continue after mouse stops
    const currentTime = Date.now()
    const timeSinceLastMove = currentTime - sceneRef.current.lastMouseTime
    // Longer fade for water-like persistence (4 seconds instead of 2)
    const mouseActivity = Math.max(0, 1 - timeSinceLastMove / 4000)

    // Update uniforms
    material.uniforms.u_time.value = sceneRef.current.time
    material.uniforms.u_mouse.value.copy(sceneRef.current.mouse)
    material.uniforms.u_mouseActivity.value = mouseActivity
    material.uniforms.u_mouseVelocity.value = sceneRef.current.mouseVelocity

    // Render
    renderer.render(scene, camera)

    sceneRef.current.animationId = requestAnimationFrame(animate)
  }

  // Handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current || !sceneRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = 1.0 - (event.clientY - rect.top) / rect.height // Flip Y coordinate

    const currentTime = Date.now()
    const deltaTime = currentTime - sceneRef.current.lastMouseTime

    // Calculate mouse velocity for pebble impact simulation
    const deltaX = x - sceneRef.current.lastMousePosition.x
    const deltaY = y - sceneRef.current.lastMousePosition.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = deltaTime > 0 ? distance / (deltaTime * 0.001) : 0

    // More responsive velocity for water impact (less smoothing)
    sceneRef.current.mouseVelocity = sceneRef.current.mouseVelocity * 0.6 + velocity * 0.4

    sceneRef.current.mouse.set(x, y)
    sceneRef.current.lastMousePosition.set(x, y)
    sceneRef.current.isMouseMoving = true
    sceneRef.current.lastMouseTime = currentTime
  }

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (!sceneRef.current) return
    sceneRef.current.lastMouseTime = Date.now()
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!sceneRef.current) return
    sceneRef.current.isMouseMoving = false
    sceneRef.current.mouseVelocity = 0
  }

  // Handle resize
  const handleResize = () => {
    if (!containerRef.current || !sceneRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const { renderer, material } = sceneRef.current

    renderer.setSize(rect.width, rect.height)
    material.uniforms.u_resolution.value.set(rect.width, rect.height)

    // Recreate texture with new dimensions
    const newTexture = createTextTexture(text, rect.width, rect.height)
    material.uniforms.u_texture.value = newTexture

    setTextDimensions({ width: rect.width, height: rect.height })
  }

  useEffect(() => {
    // Check WebGL support
    const isSupported = checkWebGLSupported()
    setIsWebGLSupported(isSupported)

    if (!isSupported) return

    // Initialize scene
    initScene()

    // Start animation
    if (sceneRef.current) {
      animate()
    }

    // Add event listeners
    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true })
      container.addEventListener("mouseenter", handleMouseEnter, { passive: true })
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    }
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      // Cleanup
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId)
        }
        sceneRef.current.renderer.dispose()
        sceneRef.current.material.dispose()
      }

      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [text, amplitude, frequency, speed, decay])

  if (!isWebGLSupported) {
    // Fallback for devices without WebGL support
    return (
      <div className={className} style={style}>
        <h1 className="text-6xl md:text-7xl font-light leading-tight text-white text-center" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
          <div className="block">Where SaaS Brands</div>
          <div className="block text-sky-400 mt-2">Meet Real Influence</div>
        </h1>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {/* Accessibility fallback - hidden but readable by screen readers */}
      <h1 className="sr-only">{text}</h1>

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          width: textDimensions.width,
          height: textDimensions.height,
        }}
      />
    </div>
  )
}
