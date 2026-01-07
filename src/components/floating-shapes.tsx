import { useEffect, useRef } from "react"
import * as THREE from "three"

interface FloatingShapesProps {
  className?: string
  opacity?: number
  speed?: number
  count?: number
}

export function FloatingShapes({
  className = "",
  opacity = 0.15,
  speed = 0.5,
  count = 8
}: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    shapes: THREE.Mesh[]
    animationId: number | null
    mouse: { x: number; y: number }
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Create shapes
    const shapes: THREE.Mesh[] = []
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TorusGeometry(1, 0.4, 8, 16),
      new THREE.SphereGeometry(1, 16, 16),
    ]

    const material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: opacity,
    })

    for (let i = 0; i < count; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const mesh = new THREE.Mesh(geometry.clone(), material.clone())

      mesh.position.x = (Math.random() - 0.5) * 50
      mesh.position.y = (Math.random() - 0.5) * 30
      mesh.position.z = (Math.random() - 0.5) * 20

      const scale = 0.5 + Math.random() * 2
      mesh.scale.set(scale, scale, scale)

      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01 * speed,
          y: (Math.random() - 0.5) * 0.01 * speed,
          z: (Math.random() - 0.5) * 0.01 * speed,
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      }

      shapes.push(mesh)
      scene.add(mesh)
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      shapes,
      animationId: null,
      mouse: { x: 0, y: 0 },
    }

    // Animation
    let time = 0
    const animate = () => {
      if (!sceneRef.current) return
      time += 0.016

      sceneRef.current.shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x
        shape.rotation.y += shape.userData.rotationSpeed.y
        shape.rotation.z += shape.userData.rotationSpeed.z

        shape.position.y = shape.userData.originalY +
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 2
      })

      // Subtle parallax on mouse
      const targetX = sceneRef.current.mouse.x * 2
      const targetY = sceneRef.current.mouse.y * 2
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return
      sceneRef.current.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      sceneRef.current.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      sceneRef.current.camera.aspect = rect.width / rect.height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(rect.width, rect.height)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [opacity, speed, count])

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />
}
