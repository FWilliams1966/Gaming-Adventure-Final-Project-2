import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import App from './App'
import GameScene from './components/GameScene'
import './styles/global.css'

function GameLaunchPage() {
  const navigate = useNavigate()
  const { gameSlug } = useParams()
  const [gameState, setGameState] = React.useState({ isRunning: true })

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#eff6ff' }}>
      <div style={{ padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '18px' }}>Launching Game</strong>
          <span style={{ color: '#c8dcff' }}>{gameSlug}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/games/play/${gameSlug}`)}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '10px 16px',
            fontWeight: 800,
            cursor: 'pointer',
            color: '#07101f',
            background: 'linear-gradient(115deg, #ffffff, #60a5fa, #34d399)'
          }}
        >
          Exit Game
        </button>
      </div>
      <div style={{ height: 'calc(100vh - 68px)' }}>
        <GameScene gameState={gameState} onStateChange={setGameState} />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/games/play/:gameSlug/launch" element={<GameLaunchPage />} />
        <Route path="*" element={<App />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
