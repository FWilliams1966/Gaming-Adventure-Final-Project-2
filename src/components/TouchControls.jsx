import React, { useRef, useState } from 'react'
import './TouchControls.css'

export default function TouchControls({ onStateChange }) {
  const [joystickActive, setJoystickActive] = useState(false)
  const joystickRef = useRef(null)
  const baseRef = useRef(null)

  const handleJoystickStart = (e) => {
    setJoystickActive(true)
  }

  const handleJoystickMove = (e) => {
    if (!joystickActive || !baseRef.current) return

    const touch = e.touches[0]
    const base = baseRef.current.getBoundingClientRect()
    const centerX = base.left + base.width / 2
    const centerY = base.top + base.height / 2

    const distance = Math.sqrt(
      Math.pow(touch.clientX - centerX, 2) + Math.pow(touch.clientY - centerY, 2)
    )
    const maxDistance = base.width / 2

    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX)
    const x = Math.cos(angle) * Math.min(distance, maxDistance)
    const y = Math.sin(angle) * Math.min(distance, maxDistance)

    if (joystickRef.current) {
      joystickRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
    }
  }

  const handleJoystickEnd = () => {
    setJoystickActive(false)
    if (joystickRef.current) {
      joystickRef.current.style.transform = 'translate(-50%, -50%)'
    }
  }

  return (
    <div className="touch-controls">
      <div
        className="joystick-container"
        ref={baseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div className="joystick-base">
          <div
            className="joystick-knob"
            ref={joystickRef}
          ></div>
        </div>
      </div>

      <div className="button-group">
        <button className="action-btn jump-btn" onTouchStart={() => {
          const event = new KeyboardEvent('keydown', { key: ' ' })
          window.dispatchEvent(event)
        }}>
          <span>JUMP</span>
        </button>

        <button className="action-btn attack-btn" onTouchStart={() => {
          onStateChange({ score: Math.floor(Math.random() * 100) })
        }}>
          <span>ATTACK</span>
        </button>
      </div>

      <div className="gyro-info">
        Tilt your device to look around
      </div>
    </div>
  )
}
