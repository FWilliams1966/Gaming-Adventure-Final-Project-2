import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function GameScene({ gameState, onStateChange }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const playerRef = useRef({ x: 0, y: 1, z: 0, velocity: { x: 0, y: 0, z: 0 } })
  const inputRef = useRef({})
  const targetMeshesRef = useRef([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const lastShotRef = useRef(0)
  const animationFrameRef = useRef(0)
  const waveRef = useRef(1)
  const audioContextRef = useRef(null)
  const particlesRef = useRef([])
  const shakeRef = useRef({ intensity: 0, duration: 0 })
  const [isPointerLocked, setIsPointerLocked] = useState(false)
  const [showStartOverlay, setShowStartOverlay] = useState(true)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [targetsLeft, setTargetsLeft] = useState(0)
  const [wave, setWave] = useState(1)
  const [ammo, setAmmo] = useState(30)
  const [maxAmmo] = useState(30)
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    setScore(0)
    setHealth(100)
    waveRef.current = 1
    setWave(1)
    setShowStartOverlay(true)
    setTargetsLeft(0)
    setAmmo(30)
    setIsGameOver(false)
    targetMeshesRef.current = []
    particlesRef.current = []
    shakeRef.current = { intensity: 0, duration: 0 }

    // Scene Setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)
    scene.fog = new THREE.Fog(0x87ceeb, 100, 1000)
    sceneRef.current = scene

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 2, 5)
    cameraRef.current = camera

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Audio Context Setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioContext

    // Sound generation functions
    function playSound(freq, duration, type = 'sine', volume = 0.3) {
      try {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioContext.currentTime + duration)
        gain.gain.setValueAtTime(volume, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
        osc.connect(gain)
        gain.connect(audioContext.destination)
        osc.start(audioContext.currentTime)
        osc.stop(audioContext.currentTime + duration)
      } catch (e) {
        // Audio context may be blocked
      }
    }

    function fireSound() {
      playSound(200, 0.1, 'sine', 0.2)
    }

    function hitSound() {
      playSound(600, 0.08, 'sine', 0.25)
      playSound(400, 0.12, 'sine', 0.15)
    }

    function waveCompleteSound() {
      playSound(800, 0.15, 'sine', 0.2)
      setTimeout(() => playSound(1000, 0.15, 'sine', 0.2), 100)
    }

    function gameOverSound() {
      playSound(400, 0.2, 'sine', 0.3)
      setTimeout(() => playSound(300, 0.25, 'sine', 0.3), 150)
    }

    // Particle system setup
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(300 * 3)
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffff00,
      transparent: true,
      sizeAttenuation: true
    })
    const particlePoints = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particlePoints)

    // Cleanup reference
    rendererRef.current = renderer
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.far = 200
    directionalLight.shadow.camera.left = -100
    directionalLight.shadow.camera.right = 100
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    scene.add(directionalLight)

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Player Cube (placeholder)
    const playerGeometry = new THREE.BoxGeometry(1, 2, 1)
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
    const player = new THREE.Mesh(playerGeometry, playerMaterial)
    player.position.set(0, 1, 0)
    player.castShadow = true
    player.receiveShadow = true
    scene.add(player)

    // Sample Obstacles
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2)
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 })

    for (let i = 0; i < 5; i++) {
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
      obstacle.position.set(
        (Math.random() - 0.5) * 80,
        1,
        (Math.random() - 0.5) * 80
      )
      obstacle.castShadow = true
      obstacle.receiveShadow = true
      scene.add(obstacle)
    }

    // Target shooter setup
    const targetGeometry = new THREE.IcosahedronGeometry(0.9, 0)
    const targetPalette = [0xff6b6b, 0x60a5fa, 0x34d399, 0xfacc15, 0xc084fc]

    function makeTarget() {
      const color = targetPalette[Math.floor(Math.random() * targetPalette.length)]
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.18,
        roughness: 0.25,
        metalness: 0.05
      })
      const mesh = new THREE.Mesh(targetGeometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        1.5 + Math.random() * 4,
        -20 - Math.random() * 70
      )
      mesh.userData = {
        speed: 2 + Math.random() * 2.5,
        sway: 0.6 + Math.random() * 0.8,
        spawnX: mesh.position.x,
        spawnY: mesh.position.y,
        spawnZ: mesh.position.z,
        driftPhase: Math.random() * Math.PI * 2,
        active: true
      }
      scene.add(mesh)
      return mesh
    }

    function respawnTarget(mesh) {
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        1.5 + Math.random() * 4,
        -20 - Math.random() * 70
      )
      mesh.userData.speed = 2 + Math.random() * 2.5
      mesh.userData.sway = 0.6 + Math.random() * 0.8
      mesh.userData.spawnX = mesh.position.x
      mesh.userData.spawnY = mesh.position.y
      mesh.userData.spawnZ = mesh.position.z
      mesh.userData.driftPhase = Math.random() * Math.PI * 2
      mesh.userData.active = true
      mesh.visible = true
    }

    function removeTarget(mesh, respawnDelay = 900) {
      mesh.visible = false
      mesh.userData.active = false
      // Trigger screen shake on enemy escape
      shakeRef.current = { intensity: 0.1, duration: 0.3 }
      window.setTimeout(() => {
        if (!sceneRef.current || !mesh.parent) return
        respawnTarget(mesh)
      }, respawnDelay)
    }

    function ensureTargets(count) {
      while (targetMeshesRef.current.length < count) {
        const target = makeTarget()
        targetMeshesRef.current.push(target)
      }
      setTargetsLeft(targetMeshesRef.current.filter((mesh) => mesh.visible).length)
    }

    ensureTargets(6)

    // Input Handling
    const handleKeyDown = (e) => {
      inputRef.current[e.key.toLowerCase()] = true
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        if (document.pointerLockElement === renderer.domElement) {
          shoot()
        }
      }
    }
    const handleKeyUp = (e) => {
      inputRef.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)

    // Mouse look
    let pitch = 0
    const handleMouseMove = (e) => {
      if (document.pointerLockElement !== renderer.domElement) return
      const deltaX = e.movementX * 0.005
      const deltaY = e.movementY * 0.005

      camera.rotation.order = 'YXZ'
      camera.rotation.y -= deltaX
      pitch -= deltaY
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))
      camera.rotation.x = pitch
    }

    window.addEventListener('mousemove', handleMouseMove)

    function requestPointerLock() {
      const target = renderer.domElement
      const pointerLock = target.requestPointerLock || target.mozRequestPointerLock || target.webkitRequestPointerLock
      if (pointerLock) {
        pointerLock.call(target)
      }
    }

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement || document.mozPointerLockElement === renderer.domElement
      setIsPointerLocked(locked)
      setShowStartOverlay(!locked)
    }

    function shoot() {
      const now = performance.now()
      if (now - lastShotRef.current < 200) {
        return
      }
      if (ammo <= 0) {
        return
      }

      lastShotRef.current = now

      // Play fire sound
      fireSound()

      // Decrease ammo
      setAmmo((currentAmmo) => Math.max(0, currentAmmo - 1))

      const raycaster = raycasterRef.current
      raycaster.setFromCamera({ x: 0, y: 0 }, camera)
      const hits = raycaster.intersectObjects(targetMeshesRef.current.filter((mesh) => mesh.visible), false)

      if (hits.length > 0) {
        const hit = hits[0].object
        const hitPoint = hits[0].point

        // Play hit sound
        hitSound()

        // Create particle burst
        for (let i = 0; i < 12; i++) {
          const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
          )
          particlesRef.current.push({
            position: hitPoint.clone(),
            velocity,
            life: 0.6,
            maxLife: 0.6
          })
        }

        // Flash target
        const originalColor = hit.material.color.getHex()
        const originalEmissive = hit.material.emissive.getHex()
        hit.material.color.setHex(0xffffff)
        hit.material.emissive.setHex(0xffffff)
        setTimeout(() => {
          hit.material.color.setHex(originalColor)
          hit.material.emissive.setHex(originalEmissive)
        }, 100)

        setScore((currentScore) => currentScore + 10)
        setTargetsLeft((currentTargets) => currentTargets)
        removeTarget(hit)
      } else {
        // Screen shake on miss
        shakeRef.current = { intensity: 0.05, duration: 0.15 }
      }
    }

    const handleCanvasClick = () => {
      if (document.pointerLockElement === renderer.domElement) {
        shoot()
        return
      }
      requestPointerLock()
    }

    renderer.domElement.addEventListener('click', handleCanvasClick)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('mozpointerlockchange', handlePointerLockChange)

    // Animation Loop
    const clock = new THREE.Clock()
    let lastTime = 0

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (!gameState.isRunning) {
        renderer.render(scene, camera)
        return
      }

      const delta = clock.getDelta()
      lastTime += delta

      // Update particles
      const aliveParticles = []
      particlesRef.current.forEach((p) => {
        p.life -= delta
        if (p.life > 0) {
          p.position.add(p.velocity.clone().multiplyScalar(delta))
          p.velocity.y -= 5 * delta // gravity
          aliveParticles.push(p)
        }
      })
      particlesRef.current = aliveParticles

      // Update particle geometry
      if (particlePoints && aliveParticles.length > 0) {
        const positions = new Float32Array(aliveParticles.length * 3)
        aliveParticles.forEach((p, i) => {
          positions[i * 3] = p.position.x
          positions[i * 3 + 1] = p.position.y
          positions[i * 3 + 2] = p.position.z
        })
        particlePoints.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particlePoints.geometry.attributes.position.needsUpdate = true
      }

      // Apply screen shake
      let shakeOffset = new THREE.Vector3(0, 0, 0)
      if (shakeRef.current.duration > 0) {
        shakeRef.current.duration -= delta
        const shakeFactor = shakeRef.current.duration / 0.3
        shakeOffset.x = (Math.random() - 0.5) * shakeRef.current.intensity * shakeFactor
        shakeOffset.y = (Math.random() - 0.5) * shakeRef.current.intensity * shakeFactor
        shakeOffset.z = (Math.random() - 0.5) * shakeRef.current.intensity * 0.1 * shakeFactor
      }

      // Player Movement
      const moveSpeed = 10
      const acceleration = new THREE.Vector3()

      if (inputRef.current['w']) {
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y)
        acceleration.add(forward.multiplyScalar(moveSpeed))
      }
      if (inputRef.current['s']) {
        const backward = new THREE.Vector3(0, 0, 1)
        backward.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y)
        acceleration.add(backward.multiplyScalar(moveSpeed))
      }
      if (inputRef.current['a']) {
        const left = new THREE.Vector3(-1, 0, 0)
        left.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y)
        acceleration.add(left.multiplyScalar(moveSpeed))
      }
      if (inputRef.current['d']) {
        const right = new THREE.Vector3(1, 0, 0)
        right.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y)
        acceleration.add(right.multiplyScalar(moveSpeed))
      }

      // Apply gravity
      const gravity = -9.8
      playerRef.current.velocity.y += gravity * delta
      playerRef.current.velocity.x += acceleration.x * delta
      playerRef.current.velocity.z += acceleration.z * delta

      // Friction
      playerRef.current.velocity.x *= 0.9
      playerRef.current.velocity.z *= 0.9

      // Update position
      playerRef.current.x += playerRef.current.velocity.x * delta
      playerRef.current.z += playerRef.current.velocity.z * delta
      playerRef.current.y += playerRef.current.velocity.y * delta

      // Ground collision
      if (playerRef.current.y < 1) {
        playerRef.current.y = 1
        playerRef.current.velocity.y = 0

        if (inputRef.current[' ']) {
          playerRef.current.velocity.y = 5
        }
      }

      // Update camera position with shake
      camera.position.set(
        playerRef.current.x + shakeOffset.x,
        playerRef.current.y + 0.5 + shakeOffset.y,
        playerRef.current.z + shakeOffset.z
      )

      // Update player mesh for reference
      player.position.set(playerRef.current.x, playerRef.current.y, playerRef.current.z)

      // Animate targets and apply simple pressure mechanic
      let visibleTargets = 0
      targetMeshesRef.current.forEach((mesh) => {
        if (!mesh.visible) {
          return
        }

        visibleTargets += 1
        mesh.userData.driftPhase += delta * mesh.userData.sway
        mesh.position.x = mesh.userData.spawnX + Math.sin(mesh.userData.driftPhase) * 3.5
        mesh.position.y = mesh.userData.spawnY + Math.cos(mesh.userData.driftPhase * 1.3) * 1.2
        mesh.position.z += mesh.userData.speed * delta
        mesh.rotation.y += delta * 1.1
        mesh.rotation.x += delta * 0.6

        if (mesh.position.z > playerRef.current.z + 6) {
          removeTarget(mesh, 100)
          setHealth((currentHealth) => {
            const newHealth = Math.max(0, currentHealth - 8)
            if (newHealth === 0) {
              gameOverSound()
              setIsGameOver(true)
            }
            return newHealth
          })
        }
      })

      setTargetsLeft(visibleTargets)
      if (visibleTargets === 0 && !isGameOver) {
        const nextWave = waveRef.current + 1
        waveRef.current = nextWave
        setWave(nextWave)
        waveCompleteSound()
        setAmmo(30)
        const targetCount = 5 + Math.min(3, Math.floor(nextWave / 2))
        ensureTargets(targetCount)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', handleCanvasClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('mozpointerlockchange', handlePointerLockChange)

      if (renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      renderer.dispose()
    }
  }, [gameState.isRunning])

  return (
    <div ref={containerRef} className="game-scene-shell">
      <div className="game-hud">
        <div className="game-hud-left">
          <strong>Controls</strong>
          <span>WASD move · Mouse aim · Click or Space shoot</span>
        </div>
        <div className="game-hud-stats">
          <span className="hud-pill">Score {score}</span>
          <span className="hud-pill">Health {health}</span>
          <span className={ammo <= 5 ? 'hud-pill ammo-low' : 'hud-pill'}>Ammo {ammo}/{maxAmmo}</span>
          <span className="hud-pill">Targets {targetsLeft}</span>
          <span className="hud-pill active">Wave {wave}</span>
        </div>
        <div className="game-hud-right">
          <span className={isPointerLocked ? 'hud-pill active' : 'hud-pill'}>
            {isPointerLocked ? 'Pointer locked' : 'Click to play'}
          </span>
        </div>
      </div>

      <div className="game-crosshair" aria-hidden="true" />

      {showStartOverlay && (
        <button type="button" className="game-start-overlay" onClick={() => {
          setShowStartOverlay(false)
          const canvas = containerRef.current?.querySelector('canvas')
          const pointerLock = canvas?.requestPointerLock || canvas?.mozRequestPointerLock || canvas?.webkitRequestPointerLock
          if (pointerLock && canvas) {
            pointerLock.call(canvas)
          }
        }}>
          <span>Click to start</span>
          <small>Use WASD, mouse, click to shoot, and Space to fire</small>
        </button>
      )}

      {isGameOver && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <div className="game-over-stats">
              <p>Final Score: <strong>{score}</strong></p>
              <p>Wave Reached: <strong>{wave}</strong></p>
              <p>Targets Destroyed: <strong>{Math.floor(score / 10)}</strong></p>
            </div>
            <button type="button" className="game-over-restart" onClick={() => {
              window.location.reload()
            }}>
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
