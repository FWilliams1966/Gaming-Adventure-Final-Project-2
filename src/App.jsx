import React, { useState, useEffect } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const pages = [
  { id: 'home', path: '/home', label: 'Home' },
  { id: 'games', path: '/games', label: 'Games' },
  { id: 'community', path: '/community', label: 'Community' },
  { id: 'profile', path: '/profile', label: 'Profile' },
  { id: 'support', path: '/support', label: 'Support' }
]

const fpsShowcase = [
  { title: 'Doom Eternal', year: 2020, genre: 'Sci-Fi' },
  { title: 'Half-Life: Alyx', year: 2020, genre: 'Sci-Fi' },
  { title: 'Valorant', year: 2020, genre: 'Tactical' },
  { title: 'Call of Duty: Modern Warfare', year: 2019, genre: 'Military' },
  { title: 'Apex Legends', year: 2019, genre: 'Battle Royale' },
  { title: 'Battlefield V', year: 2018, genre: 'Military' },
  { title: 'DOOM', year: 2016, genre: 'Sci-Fi' },
  { title: 'Titanfall 2', year: 2016, genre: 'Sci-Fi' },
  { title: 'Rainbow Six Siege', year: 2015, genre: 'Tactical' },
  { title: 'Destiny', year: 2014, genre: 'Space' },
  { title: 'BioShock Infinite', year: 2013, genre: 'Sci-Fi' },
  { title: 'Battlefield 3', year: 2011, genre: 'Military' }
]

function makeGameSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const playableGames = fpsShowcase.map((game) => ({
  ...game,
  slug: makeGameSlug(game.title)
}))

const featuredPromos = [
  {
    title: 'Titanfall 2',
    slug: 'titanfall-2',
    tagline: 'Mechs, pilots, and fast online battles built for momentum.',
    badge: 'MECH ACTION',
    accent: 'rgba(59, 130, 246, 0.86)',
    glow: 'rgba(34, 197, 94, 0.34)'
  },
  {
    title: 'Battlefield V',
    slug: 'battlefield-v',
    tagline: 'Massive front lines and cinematic war zones ready for squads.',
    badge: 'SQUAD WAR',
    accent: 'rgba(239, 68, 68, 0.88)',
    glow: 'rgba(250, 204, 21, 0.34)'
  },
  {
    title: 'Call of Duty: Modern Warfare',
    slug: 'call-of-duty-modern-warfare',
    tagline: 'Fast matchmaking, tactical loadouts, and high-pressure firefights.',
    badge: 'TACTICAL OPS',
    accent: 'rgba(147, 51, 234, 0.86)',
    glow: 'rgba(59, 130, 246, 0.34)'
  },
  {
    title: 'Valorant',
    slug: 'valorant',
    tagline: 'Precision duels, agent skills, and ranked climbs with your friends.',
    badge: 'RANKED PLAY',
    accent: 'rgba(34, 197, 94, 0.86)',
    glow: 'rgba(255, 255, 255, 0.28)'
  }
]

function getGameInitials(title) {
  return title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function buildGameAvatar(title, accent, glow, badge) {
  const initials = getGameInitials(title)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${title} avatar">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#08111f" />
        </linearGradient>
        <radialGradient id="shine" cx="30%" cy="28%" r="70%">
          <stop offset="0%" stop-color="${glow}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${glow}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="128" height="128" rx="24" fill="url(#bg)" />
      <circle cx="92" cy="34" r="30" fill="url(#shine)" />
      <path d="M18 96C33 82 44 71 59 59c12-10 26-18 51-26" stroke="rgba(255,255,255,0.22)" stroke-width="6" stroke-linecap="round" fill="none" />
      <circle cx="40" cy="44" r="18" fill="rgba(255,255,255,0.12)" />
      <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="900" letter-spacing="2">${initials}</text>
      <text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="12" font-weight="700">${badge}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function loadStoredAccounts() {
  try {
    const raw = localStorage.getItem('accounts')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

function saveStoredAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts))
}

// Simple Login Panel for Homepage
function LoginPanel({ user, setUser }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [accountPrompt, setAccountPrompt] = useState('')

  function persistSession(userObj) {
    localStorage.setItem('user', JSON.stringify(userObj))
    setUser(userObj)
  }

  function handleLogin(e) {
    e.preventDefault()
    const storedAccounts = loadStoredAccounts()
    const matchedAccount = storedAccounts.find((account) => account.email.toLowerCase() === email.trim().toLowerCase())

    if (!email.trim()) {
      setMessage('Please enter an email to continue.')
      return
    }

    if (!password.trim()) {
      setMessage('Please enter your password.')
      return
    }

    if (!matchedAccount) {
      setMessage('No account found. Create a new account first.')
      return
    }

    if (matchedAccount.password !== password) {
      setMessage('Incorrect password.')
      return
    }

    persistSession({
      email: matchedAccount.email,
      displayName: matchedAccount.displayName
    })
    setMessage('')
    setAccountPrompt('')
  }

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    setEmail('')
    setPassword('')
  }

  function handleCreateAccount(e) {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedDisplayName = displayName.trim()

    if (!trimmedDisplayName) {
      setMessage('Please enter a display name.')
      return
    }

    if (!trimmedEmail) {
      setMessage('Please enter an email address.')
      return
    }

    if (!password.trim() || password.length < 6) {
      setMessage('Use at least 6 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const storedAccounts = loadStoredAccounts()
    if (storedAccounts.some((account) => account.email.toLowerCase() === trimmedEmail)) {
      setMessage('An account with that email already exists. Sign in instead.')
      return
    }

    const nextAccount = {
      email: trimmedEmail,
      displayName: trimmedDisplayName,
      password
    }

    saveStoredAccounts([...storedAccounts, nextAccount])
    persistSession({
      email: nextAccount.email,
      displayName: nextAccount.displayName
    })
    setMessage('Account created. You are signed in.')
    setAccountPrompt('')
    setMode('signin')
  }

  if (user) {
    return (
      <div className="login-panel">
        <div className="greeting">
          <strong>Welcome back,</strong>
          <span className="gamer-name">{user.displayName}</span>
        </div>
        <div className="login-actions">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-panel login-portal">
      <div className="login-copy">
        <span className="guest-badge">{mode === 'signup' ? 'New user portal' : 'Guest mode'}</span>
        <p>
          {mode === 'signup'
            ? 'Create a new player account and unlock your profile, progress, and account menu.'
            : 'Sign in with your email and password to unlock your profile and account menu.'}
        </p>
      </div>
      <form className="login-form" onSubmit={mode === 'signup' ? handleCreateAccount : handleLogin}>
        {mode === 'signup' && (
          <input
            className="login-input"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            required
          />
        )}
        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        {mode === 'signup' && (
          <input
            className="login-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
          />
        )}
        <div className="login-actions">
          <button type="submit" className="login-btn">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
          <button
            type="button"
            className="create-account-btn"
            onClick={() => {
              setMessage('')
              setAccountPrompt('')
              setMode((currentMode) => (currentMode === 'signup' ? 'signin' : 'signup'))
            }}
          >
            {mode === 'signup' ? 'Use existing account' : 'Create account'}
          </button>
        </div>
        {message && <p className="login-message">{message}</p>}
        {accountPrompt && <p className="login-message">{accountPrompt}</p>}
      </form>
    </div>
  )
}

function PromoGallery() {
  const navigate = useNavigate()

  return (
    <section className="promo-gallery" aria-label="Featured game promotions">
      {featuredPromos.map((game) => (
        <article
          className="promo-card"
          key={game.slug}
          style={{
            '--promo-accent': game.accent,
            '--promo-glow': game.glow
          }}
        >
          <img
            className="game-avatar-image"
            src={buildGameAvatar(game.title, game.accent, game.glow, game.badge)}
            alt={`${game.title} avatar`}
            width="128"
            height="128"
          />
          <div className="promo-thumb" aria-hidden="true">
            <div className="promo-thumb-core" />
            <div className="promo-thumb-glint" />
          </div>
          <div className="promo-art">
            <div className="promo-shape promo-shape-a" />
            <div className="promo-shape promo-shape-b" />
            <div className="promo-shape promo-shape-c" />
            <div className="promo-title-block">
              <span className="promo-badge">{game.badge}</span>
              <h3>{game.title}</h3>
            </div>
          </div>
          <p>{game.tagline}</p>
          <div className="promo-actions">
            <button
              type="button"
              className="promo-play-btn"
              onClick={() => navigate(`/games/play/${game.slug}/launch`)}
            >
              Play Online
            </button>
            <button
              type="button"
              className="promo-secondary-btn"
              onClick={() => navigate('/games/search')}
            >
              View Game
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

function HomeHero() {
  const navigate = useNavigate()

  return (
    <section className="home-hero" aria-label="Join the action">
      <div className="home-hero-copy">
        <span className="hero-kicker">New season live</span>
        <h2>Sign up and jump into the most intense online FPS battles.</h2>
        <p>
          Squad up in Titanfall 2, Battlefield V, and Call of Duty with a fast
          gaming community, rich featured artwork, and instant play access.
        </p>
        <div className="hero-actions">
          <button type="button" className="hero-primary-btn" onClick={() => navigate('/home')}>
            Sign up now
          </button>
          <button type="button" className="hero-secondary-btn" onClick={() => navigate('/games/search')}>
            Browse games
          </button>
        </div>
        <div className="hero-stats">
          <article>
            <strong>24/7</strong>
            <span>Online play</span>
          </article>
          <article>
            <strong>4K</strong>
            <span>Cover art</span>
          </article>
          <article>
            <strong>12+</strong>
            <span>Featured FPS titles</span>
          </article>
        </div>
      </div>
      <div className="home-hero-art" aria-hidden="true">
        <div className="hero-banner-label">Squad up. Launch fast. Win online.</div>
        <div className="hero-banner-subtext">Titanfall • Battlefield V • Call of Duty • Valorant</div>
        <div className="hero-figure hero-figure-left" />
        <div className="hero-figure hero-figure-center" />
        <div className="hero-figure hero-figure-right" />
        <div className="hero-silhouette hero-silhouette-left" />
        <div className="hero-silhouette hero-silhouette-right" />
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
      </div>
    </section>
  )
}

// HOME SUB-PAGES
function HomeSubNav() {
  const location = useLocation()
  const subPages = [
    { path: '/home/featured', label: 'Featured' },
    { path: '/home/news', label: 'News' },
    { path: '/home/announcements', label: 'Announcements' }
  ]
  return (
    <nav className="sub-nav">
      {subPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) => (isActive ? 'sub-link active' : 'sub-link')}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  )
}

function HomeFeatured() {
  return (
    <div className="sub-page-content">
      <h3>Featured Games</h3>
      <p>Check out this week's most played FPS titles across all platforms.</p>
      <ul className="content-list">
        <li>Valorant - 2.3M players</li>
        <li>CS:GO - 1.8M players</li>
        <li>Apex Legends - 1.5M players</li>
        <li>Call of Duty: Modern Warfare - 1.2M players</li>
      </ul>
    </div>
  )
}

function HomeNews() {
  return (
    <div className="sub-page-content">
      <h3>Latest News</h3>
      <p>Stay updated with the latest FPS gaming news and announcements.</p>
      <ul className="content-list">
        <li>Valorant Acts Season 2023 - New agent revealed</li>
        <li>CS:GO Major Championship - $1M prize pool</li>
        <li>Apex Legends Mobile - Global release date</li>
        <li>Overwatch 2 - Ranked season updates</li>
      </ul>
    </div>
  )
}

function HomeAnnouncements() {
  return (
    <div className="sub-page-content">
      <h3>Announcements</h3>
      <p>Important updates and maintenance schedules.</p>
      <ul className="content-list">
        <li>Server maintenance scheduled for Friday, 2AM - 4AM UTC</li>
        <li>New tournament registration now open</li>
        <li>Platform security update v2.5 rolling out</li>
        <li>Community feedback survey - Win rewards!</li>
      </ul>
    </div>
  )
}

// GAMES SUB-PAGES
function GamesSubNav() {
  const subPages = [
    { path: '/games/search', label: 'Search' },
    { path: '/games/top-rated', label: 'Top Rated' },
    { path: '/games/new-releases', label: 'New Releases' }
  ]
  return (
    <nav className="sub-nav">
      {subPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) => (isActive ? 'sub-link active' : 'sub-link')}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  )
}

function GamesSearch() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHint, setSearchHint] = useState('Press Enter to open the matching game.')

  function findGame(query) {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return null
    }

    return playableGames.find((game) => {
      const title = game.title.toLowerCase()
      const genre = game.genre.toLowerCase()
      const year = String(game.year)

      return (
        game.slug === makeGameSlug(normalizedQuery) ||
        title.includes(normalizedQuery) ||
        genre.includes(normalizedQuery) ||
        year.includes(normalizedQuery)
      )
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const match = findGame(searchTerm)

    if (match) {
      navigate(`/games/play/${match.slug}`)
      return
    }

    setSearchHint('No game matched that search. Try a title like Doom Eternal or Valorant.')
  }

  return (
    <div className="sub-page-content">
      <h3>Search Games</h3>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by title, genre, or year..."
          className="search-input"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
            setSearchHint('Press Enter to open the matching game.')
          }}
        />
        <button type="submit" className="search-button">Play Game</button>
      </form>
      <p className="search-hint">{searchHint}</p>
      <div className="games-grid">
        {playableGames.slice(0, 6).map((game) => (
          <button
            type="button"
            className="game-item game-item-button"
            key={game.title}
            onClick={() => navigate(`/games/play/${game.slug}`)}
          >
            <h4>{game.title}</h4>
            <p>{game.genre}</p>
            <span>{game.year}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function GamesTopRated() {
  const topGames = [...playableGames].sort(() => Math.random() - 0.5).slice(0, 6)
  return (
    <div className="sub-page-content">
      <h3>Top Rated Games</h3>
      <p>Most acclaimed FPS titles by community rating.</p>
      <div className="games-grid">
        {topGames.map((game) => (
          <article className="game-item" key={game.title}>
            <h4>{game.title}</h4>
            <p>{game.genre}</p>
            <span>⭐ 4.8/5</span>
          </article>
        ))}
      </div>
    </div>
  )
}

function GamesNewReleases() {
  const newGames = playableGames.filter((g) => g.year >= 2019)
  return (
    <div className="sub-page-content">
      <h3>New Releases</h3>
      <p>Latest FPS games released in 2019 and beyond.</p>
      <div className="games-grid">
        {newGames.map((game) => (
          <article className="game-item" key={game.title}>
            <h4>{game.title}</h4>
            <p>{game.genre}</p>
            <span>{game.year}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

function GamePlayPage() {
  const navigate = useNavigate()
  const { gameSlug } = useParams()
  const game = playableGames.find((item) => item.slug === gameSlug)

  if (!game) {
    return (
      <div className="sub-page-content">
        <h3>Game Not Found</h3>
        <p>That game could not be loaded. Try searching again from Games.</p>
        <NavLink to="/games/search" className="sub-link active">
          Back to Search
        </NavLink>
      </div>
    )
  }

  return (
    <div className="sub-page-content play-panel">
      <h3>{game.title}</h3>
      <p>{game.genre} • {game.year}</p>
      <div className="play-hero">
        <div>
          <strong>Now Playing</strong>
          <p>Matchmaking is ready. Press play to launch the game experience.</p>
        </div>
        <button
          type="button"
          className="play-button"
          onClick={() => navigate(`/games/play/${game.slug}/launch`)}
        >
          Play Now
        </button>
      </div>
      <ul className="content-list">
        <li>Genre: {game.genre}</li>
        <li>Release Year: {game.year}</li>
        <li>Status: Ready to launch</li>
      </ul>
    </div>
  )
}

// COMMUNITY SUB-PAGES
function CommunitySubNav() {
  const subPages = [
    { path: '/community/squads', label: 'Squads' },
    { path: '/community/chat', label: 'Chat' },
    { path: '/community/challenges', label: 'Challenges' }
  ]
  return (
    <nav className="sub-nav">
      {subPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) => (isActive ? 'sub-link active' : 'sub-link')}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  )
}

function CommunitySquads() {
  return (
    <div className="sub-page-content">
      <h3>Your Squads</h3>
      <p>View and manage your active gaming squads.</p>
      <ul className="content-list">
        <li><strong>The Legends</strong> - 12 members, Competitive</li>
        <li><strong>Casual Crew</strong> - 8 members, Casual</li>
        <li><strong>Speedrun Team</strong> - 5 members, Speedrunning</li>
        <li><strong>Strategy Masters</strong> - 15 members, Tactical</li>
      </ul>
    </div>
  )
}

function CommunityChat() {
  return (
    <div className="sub-page-content">
      <h3>Squad Chat Rooms</h3>
      <p>Connect with your squad members in real-time.</p>
      <ul className="content-list">
        <li>#general - 847 online</li>
        <li>#competitive - 234 online</li>
        <li>#tournament-prep - 89 online</li>
        <li>#off-topic - 456 online</li>
      </ul>
    </div>
  )
}

function CommunityChallenges() {
  return (
    <div className="sub-page-content">
      <h3>Weekly Challenges</h3>
      <p>Complete challenges and earn rewards with your squad.</p>
      <ul className="content-list">
        <li>🎯 Headshot Master - Get 100 headshots (Reward: 500 XP)</li>
        <li>⚡ Speed Runner - Win 5 matches in a row (Reward: Rare skin)</li>
        <li>🏆 Team Player - Play 10 matches with squad (Reward: 250 XP)</li>
        <li>💎 Diamond Tier - Reach Diamond rank (Reward: Title badge)</li>
      </ul>
    </div>
  )
}

// PROFILE SUB-PAGES
function ProfileSubNav() {
  const subPages = [
    { path: '/profile/settings', label: 'Settings' },
    { path: '/profile/stats', label: 'Stats' },
    { path: '/profile/achievements', label: 'Achievements' }
  ]
  return (
    <nav className="sub-nav">
      {subPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) => (isActive ? 'sub-link active' : 'sub-link')}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  )
}

function ProfileSettings() {
  return (
    <div className="sub-page-content">
      <h3>Account Settings</h3>
      <p>Manage your account preferences and privacy.</p>
      <ul className="content-list">
        <li>Username: PlayerOne ✓</li>
        <li>Email: player@gaming.com (Verified)</li>
        <li>Two-Factor Authentication: Enabled</li>
        <li>Privacy Level: Friends Only</li>
        <li>Cross-Platform Play: Enabled</li>
      </ul>
    </div>
  )
}

function ProfileStats() {
  return (
    <div className="sub-page-content">
      <h3>Performance Statistics</h3>
      <p>Your career and current season statistics.</p>
      <ul className="content-list">
        <li>Total Matches Played: 2,847</li>
        <li>Win Rate: 68.4%</li>
        <li>K/D Ratio: 2.18</li>
        <li>Headshot Rate: 42.3%</li>
        <li>Average Damage per Match: 1,284</li>
        <li>Total Playtime: 487 hours</li>
      </ul>
    </div>
  )
}

function ProfileAchievements() {
  return (
    <div className="sub-page-content">
      <h3>Achievements & Badges</h3>
      <p>Unlock and showcase your achievements.</p>
      <ul className="content-list">
        <li>🥇 First Victory - Win your first match</li>
        <li>🎯 Sharpshooter - Get 50 headshots in a single match</li>
        <li>🚀 Speed Demon - Win a match in under 5 minutes</li>
        <li>👥 Team Leader - Create and lead a squad</li>
        <li>💪 Diamond Tier - Reach Diamond rank</li>
        <li>🌟 Legend - Reach Legend rank</li>
      </ul>
    </div>
  )
}

// SUPPORT SUB-PAGES
function SupportSubNav() {
  const subPages = [
    { path: '/support/starter-help', label: 'Starter Help' },
    { path: '/support/account-security', label: 'Account & Security' },
    { path: '/support/bug-reports', label: 'Bug Reports' }
  ]
  return (
    <nav className="sub-nav">
      {subPages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) => (isActive ? 'sub-link active' : 'sub-link')}
        >
          {page.label}
        </NavLink>
      ))}
    </nav>
  )
}

function SupportStarterHelp() {
  return (
    <div className="sub-page-content">
      <h3>Starter Help</h3>
      <p>Learn controls, match setup, and early progression tips.</p>
      <ul className="content-list">
        <li><strong>Basic Controls:</strong> WASD for movement, Mouse for aim, Click to shoot</li>
        <li><strong>Starting Out:</strong> Play Tutorial match first for 100 Bonus XP</li>
        <li><strong>Progression:</strong> Complete daily challenges to unlock new weapons</li>
        <li><strong>First Game:</strong> Join Practice mode to learn maps without pressure</li>
        <li><strong>Settings:</strong> Adjust sensitivity in Options (recommended: 1.8)</li>
      </ul>
    </div>
  )
}

function SupportAccountSecurity() {
  return (
    <div className="sub-page-content">
      <h3>Account & Security</h3>
      <p>Recover access, update profile, and protect your account.</p>
      <ul className="content-list">
        <li><strong>Forgot Password:</strong> Click "Forgot?" on login, verify email within 15 minutes</li>
        <li><strong>Two-Factor Auth:</strong> Enable in Settings for extra security</li>
        <li><strong>Linked Accounts:</strong> Connect Steam, Epic, or Console accounts</li>
        <li><strong>Session Management:</strong> View all active sessions and sign out remotely</li>
        <li><strong>Account Recovery:</strong> Contact support@gaming.com with proof of ownership</li>
      </ul>
    </div>
  )
}

function SupportBugReports() {
  return (
    <div className="sub-page-content">
      <h3>Bug Reports</h3>
      <p>Submit gameplay issues and track status updates.</p>
      <ul className="content-list">
        <li><strong>Report a Bug:</strong> Press F1 in-game to open bug reporter</li>
        <li><strong>Include:</strong> Screenshot, steps to reproduce, and system info</li>
        <li><strong>Status Tracking:</strong> Monitor your reports at bugs.gaming.com</li>
        <li><strong>Critical Issues:</strong> Server crashes - restart game and rejoin match</li>
        <li><strong>Rewards:</strong> Get 100 XP for confirmed bug reports</li>
      </ul>
    </div>
  )
}

// MAIN PAGE WRAPPERS WITH SUB-NAVIGATION
function HomePage({ user, setUser }) {
  const location = useLocation()
  const isSubPage = location.pathname !== '/home'
  
  return (
    <section className="page-card">
      <h1>Game play for life</h1>
      {!isSubPage && (
        <>
          <p>
            Welcome to your FPS hub. Explore top shooters, connect with your squad,
            and track your profile across devices.
          </p>
          <HomeHero />
          <PromoGallery />
          <div className="metric-row">
            <article>
              <span>Players Online</span>
              <strong>13,248</strong>
            </article>
            <article>
              <span>Active Tournaments</span>
              <strong>27</strong>
            </article>
            <article>
              <span>Featured Games</span>
              <strong>{fpsShowcase.length}</strong>
            </article>
          </div>
          {/* Login panel shown on main homepage view */}
          <LoginPanel user={user} setUser={setUser} />
        </>
      )}
      <HomeSubNav />
      <Routes>
        <Route path="/" element={<HomeFeatured />} />
        <Route path="/featured" element={<HomeFeatured />} />
        <Route path="/news" element={<HomeNews />} />
        <Route path="/announcements" element={<HomeAnnouncements />} />
      </Routes>
    </section>
  )
}

function GamesPage() {
  const location = useLocation()
  const isSubPage = location.pathname !== '/games'
  
  return (
    <section className="page-card">
      <h2>Games Catalog</h2>
      {!isSubPage && (
        <p>Recent first-person shooters curated for quick discovery.</p>
      )}
      <GamesSubNav />
      <Routes>
        <Route path="/" element={<GamesSearch />} />
        <Route path="/search" element={<GamesSearch />} />
        <Route path="/top-rated" element={<GamesTopRated />} />
        <Route path="/new-releases" element={<GamesNewReleases />} />
        <Route path="/play/:gameSlug" element={<GamePlayPage />} />
      </Routes>
    </section>
  )
}

function CommunityPage() {
  const location = useLocation()
  const isSubPage = location.pathname !== '/community'
  
  return (
    <section className="page-card">
      <h2>Community Hub</h2>
      {!isSubPage && (
        <p>Join friends, chat, and share highlights from your best matches.</p>
      )}
      <CommunitySubNav />
      <Routes>
        <Route path="/" element={<CommunitySquads />} />
        <Route path="/squads" element={<CommunitySquads />} />
        <Route path="/chat" element={<CommunityChat />} />
        <Route path="/challenges" element={<CommunityChallenges />} />
      </Routes>
    </section>
  )
}

function ProfilePage() {
  const location = useLocation()
  const isSubPage = location.pathname !== '/profile'
  
  return (
    <section className="page-card">
      <h2>My Profile</h2>
      {!isSubPage && (
        <div className="profile-grid">
          <article>
            <span>Gamer Tag</span>
            <strong>PlayerOne</strong>
          </article>
          <article>
            <span>Rank Tier</span>
            <strong>Diamond</strong>
          </article>
          <article>
            <span>Favorite Mode</span>
            <strong>Team Deathmatch</strong>
          </article>
          <article>
            <span>K/D Ratio</span>
            <strong>2.18</strong>
          </article>
        </div>
      )}
      <ProfileSubNav />
      <Routes>
        <Route path="/" element={<ProfileSettings />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="/stats" element={<ProfileStats />} />
        <Route path="/achievements" element={<ProfileAchievements />} />
      </Routes>
    </section>
  )
}

function SupportPage() {
  const location = useLocation()
  const isSubPage = location.pathname !== '/support'
  
  return (
    <section className="page-card">
      <h2>Support Center</h2>
      {!isSubPage && (
        <p>Need help? Get onboarding guides, account support, and quick fixes.</p>
      )}
      <SupportSubNav />
      <Routes>
        <Route path="/" element={<SupportStarterHelp />} />
        <Route path="/starter-help" element={<SupportStarterHelp />} />
        <Route path="/account-security" element={<SupportAccountSecurity />} />
        <Route path="/bug-reports" element={<SupportBugReports />} />
      </Routes>
    </section>
  )
}

// PAGINATION COMPONENT FOR BOTTOM PAGE SCROLLING
function PagePagination() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine current page index based on pathname
  const getCurrentPageIndex = () => {
    const pathname = location.pathname
    if (pathname.startsWith('/home')) return 0
    if (pathname.startsWith('/games')) return 1
    if (pathname.startsWith('/community')) return 2
    if (pathname.startsWith('/profile')) return 3
    if (pathname.startsWith('/support')) return 4
    return 0
  }

  const currentIndex = getCurrentPageIndex()
  const previousIndex = (currentIndex - 1 + pages.length) % pages.length
  const nextIndex = (currentIndex + 1) % pages.length

  const handlePrevious = () => {
    navigate(pages[previousIndex].path)
  }

  const handleNext = () => {
    navigate(pages[nextIndex].path)
  }

  return (
    <div className="page-pagination">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={handlePrevious}
        aria-label={`Go to ${pages[previousIndex].label} page`}
      >
        ← {pages[previousIndex].label}
      </button>
      <span className="pagination-indicator">
        {currentIndex + 1} / {pages.length}
      </span>
      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={handleNext}
        aria-label={`Go to ${pages[nextIndex].label} page`}
      >
        {pages[nextIndex].label} →
      </button>
    </div>
  )
}

// Side scroll button: scroll to bottom of the page
function SideScrollButton() {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || window.pageYOffset
      const winH = window.innerHeight
      const docH = document.documentElement.scrollHeight || document.body.scrollHeight
      setAtBottom(scrollTop + winH >= docH - 8)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  function handleClick() {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  const icon = atBottom ? '⤒' : '⤓'
  const label = atBottom ? 'Scroll to top' : 'Scroll to bottom'

  return (
    <button
      className={"side-scroll-btn" + (atBottom ? ' at-bottom' : '')}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}

// Account menu in top navigation
function AccountMenu({ user, setUser }) {
  const [open, setOpen] = useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    function handleDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleDocClick)
    return () => document.removeEventListener('click', handleDocClick)
  }, [])

  if (!user) {
    return (
      <NavLink to="/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Sign In
      </NavLink>
    )
  }

  return (
    <div className="account-menu" ref={ref}>
      <button className="account-btn" type="button" onClick={() => setOpen((v) => !v)}>
        <span className="avatar">{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</span>
        <span className="account-name">{user.displayName}</span>
      </button>
      {open && (
        <div className="account-dropdown">
          <NavLink to="/profile" className="account-link">Profile</NavLink>
          <NavLink to="/profile/settings" className="account-link">Settings</NavLink>
          <button
            type="button"
            className="account-link logout-link"
            onClick={() => {
              localStorage.removeItem('user')
              setUser(null)
              setOpen(false)
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

function AppLayout() {
  const [user, setUser] = useState(null)

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      localStorage.removeItem('user')
    }
  }, [])

  return (
    <main className="site-shell">
      <nav className="top-nav" aria-label="Main pages">
        <div className="nav-left">
          {pages.map((page) => (
            <NavLink
              key={page.id}
              to={page.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {page.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-right">
          <AccountMenu user={user} setUser={setUser} />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home/*" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/games/*" element={<GamesPage />} />
        <Route path="/community/*" element={<CommunityPage />} />
        <Route path="/profile/*" element={<ProfilePage />} />
        <Route path="/support/*" element={<SupportPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

        <PagePagination />
        <SideScrollButton />
    </main>
  )
}

export default function App() {
  return <AppLayout />
}
