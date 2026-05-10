import React, { useEffect, useMemo, useState } from 'react'
import './Homepage.css'

const shooterGames = [
	{ id: 1, title: 'Doom Eternal', year: 2020, theme: 'Sci-Fi', baseRating: 4.8 },
	{ id: 2, title: 'Half-Life: Alyx', year: 2020, theme: 'Sci-Fi', baseRating: 4.9 },
	{ id: 3, title: 'Call of Duty: Black Ops Cold War', year: 2020, theme: 'Military', baseRating: 4.2 },
	{ id: 4, title: 'Valorant', year: 2020, theme: 'Tactical', baseRating: 4.4 },
	{ id: 5, title: 'Call of Duty: Modern Warfare', year: 2019, theme: 'Military', baseRating: 4.6 },
	{ id: 6, title: 'Borderlands 3', year: 2019, theme: 'Sci-Fi', baseRating: 4.3 },
	{ id: 7, title: 'Metro Exodus', year: 2019, theme: 'Survival', baseRating: 4.4 },
	{ id: 8, title: 'Apex Legends', year: 2019, theme: 'Sci-Fi', baseRating: 4.5 },
	{ id: 9, title: 'Battlefield V', year: 2018, theme: 'Military', baseRating: 4.1 },
	{ id: 10, title: 'Call of Duty: Black Ops 4', year: 2018, theme: 'Military', baseRating: 4.0 },
	{ id: 11, title: 'Far Cry 5', year: 2018, theme: 'Action', baseRating: 4.2 },
	{ id: 12, title: 'Destiny 2', year: 2017, theme: 'Space', baseRating: 4.4 },
	{ id: 13, title: 'Wolfenstein II: The New Colossus', year: 2017, theme: 'Military', baseRating: 4.5 },
	{ id: 14, title: 'Prey', year: 2017, theme: 'Sci-Fi', baseRating: 4.4 },
	{ id: 15, title: 'Battlefield 1', year: 2016, theme: 'Military', baseRating: 4.3 },
	{ id: 16, title: 'DOOM', year: 2016, theme: 'Sci-Fi', baseRating: 4.7 },
	{ id: 17, title: 'Titanfall 2', year: 2016, theme: 'Sci-Fi', baseRating: 4.7 },
	{ id: 18, title: 'Tom Clancy\'s Rainbow Six Siege', year: 2015, theme: 'Tactical', baseRating: 4.6 },
	{ id: 19, title: 'Halo 5: Guardians', year: 2015, theme: 'Space', baseRating: 4.2 },
	{ id: 20, title: 'Star Wars Battlefront', year: 2015, theme: 'Space', baseRating: 4.0 },
	{ id: 21, title: 'Destiny', year: 2014, theme: 'Space', baseRating: 4.0 },
	{ id: 22, title: 'Titanfall', year: 2014, theme: 'Sci-Fi', baseRating: 4.2 },
	{ id: 23, title: 'Wolfenstein: The New Order', year: 2014, theme: 'Military', baseRating: 4.5 },
	{ id: 24, title: 'Battlefield 4', year: 2013, theme: 'Military', baseRating: 4.3 },
	{ id: 25, title: 'BioShock Infinite', year: 2013, theme: 'Sci-Fi', baseRating: 4.7 },
	{ id: 26, title: 'Call of Duty: Ghosts', year: 2013, theme: 'Military', baseRating: 3.9 },
	{ id: 27, title: 'Far Cry 3', year: 2012, theme: 'Action', baseRating: 4.6 },
	{ id: 28, title: 'Borderlands 2', year: 2012, theme: 'Sci-Fi', baseRating: 4.7 },
	{ id: 29, title: 'Halo 4', year: 2012, theme: 'Space', baseRating: 4.2 },
	{ id: 30, title: 'Battlefield 3', year: 2011, theme: 'Military', baseRating: 4.6 },
	{ id: 31, title: 'Crysis 2', year: 2011, theme: 'Sci-Fi', baseRating: 4.3 },
	{ id: 32, title: 'Call of Duty: Modern Warfare 3', year: 2011, theme: 'Military', baseRating: 4.1 },
	{ id: 33, title: 'Halo: Reach', year: 2010, theme: 'Space', baseRating: 4.6 },
	{ id: 34, title: 'Call of Duty: Black Ops', year: 2010, theme: 'Military', baseRating: 4.5 },
	{ id: 35, title: 'Call of Duty: Modern Warfare 2', year: 2009, theme: 'Military', baseRating: 4.8 },
	{ id: 36, title: 'Left 4 Dead 2', year: 2009, theme: 'Horror', baseRating: 4.6 },
	{ id: 37, title: 'Far Cry 2', year: 2008, theme: 'Action', baseRating: 4.1 },
	{ id: 38, title: 'Left 4 Dead', year: 2008, theme: 'Horror', baseRating: 4.5 },
	{ id: 39, title: 'Halo 3', year: 2007, theme: 'Space', baseRating: 4.8 },
	{ id: 40, title: 'Crysis', year: 2007, theme: 'Sci-Fi', baseRating: 4.6 },
	{ id: 41, title: 'Battlefield 2142', year: 2006, theme: 'Sci-Fi', baseRating: 4.1 },
	{ id: 42, title: 'Prey (2006)', year: 2006, theme: 'Sci-Fi', baseRating: 4.0 },
	{ id: 43, title: 'F.E.A.R.', year: 2005, theme: 'Horror', baseRating: 4.5 },
	{ id: 44, title: 'Battlefield 2', year: 2005, theme: 'Military', baseRating: 4.6 },
	{ id: 45, title: 'Half-Life 2', year: 2004, theme: 'Sci-Fi', baseRating: 4.9 },
	{ id: 46, title: 'DOOM 3', year: 2004, theme: 'Horror', baseRating: 4.2 },
	{ id: 47, title: 'Call of Duty', year: 2003, theme: 'Military', baseRating: 4.4 },
	{ id: 48, title: 'Battlefield 1942', year: 2002, theme: 'Military', baseRating: 4.7 },
	{ id: 49, title: 'Halo: Combat Evolved', year: 2001, theme: 'Space', baseRating: 4.9 },
	{ id: 50, title: 'Deus Ex', year: 2000, theme: 'Sci-Fi', baseRating: 4.8 }
]

const defaultProfile = {
	displayName: '',
	avatarUrl: '',
	favoriteTheme: 'Military',
	bio: ''
}

const themeOptions = ['All', 'Military', 'Space', 'Tactical', 'Sci-Fi', 'Action', 'Survival', 'Horror']

function getBlendedRating(baseRating, userRating) {
	if (!userRating) {
		return baseRating
	}
	return (baseRating + userRating) / 2
}

export default function Homepage() {
	const [authForm, setAuthForm] = useState({ username: '', password: '' })
	const [user, setUser] = useState(null)
	const [profile, setProfile] = useState(defaultProfile)
	const [ratings, setRatings] = useState({})
	const [search, setSearch] = useState('')
	const [selectedTheme, setSelectedTheme] = useState('All')
	const [yearRange, setYearRange] = useState({ from: 2000, to: 2020 })
	const [notice, setNotice] = useState('')

	useEffect(() => {
		const storedUser = localStorage.getItem('gpfl-user')
		const storedProfile = localStorage.getItem('gpfl-profile')
		const storedRatings = localStorage.getItem('gpfl-ratings')

		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
		if (storedProfile) {
			setProfile(JSON.parse(storedProfile))
		}
		if (storedRatings) {
			setRatings(JSON.parse(storedRatings))
		}
	}, [])

	useEffect(() => {
		if (user) {
			localStorage.setItem('gpfl-user', JSON.stringify(user))
		} else {
			localStorage.removeItem('gpfl-user')
		}
	}, [user])

	useEffect(() => {
		localStorage.setItem('gpfl-profile', JSON.stringify(profile))
	}, [profile])

	useEffect(() => {
		localStorage.setItem('gpfl-ratings', JSON.stringify(ratings))
	}, [ratings])

	const visibleGames = useMemo(() => {
		return shooterGames
			.filter((game) => game.year >= Number(yearRange.from) && game.year <= Number(yearRange.to))
			.filter((game) => selectedTheme === 'All' || game.theme === selectedTheme)
			.filter((game) => game.title.toLowerCase().includes(search.toLowerCase().trim()))
	}, [search, selectedTheme, yearRange])

	const catalogAverage = useMemo(() => {
		if (visibleGames.length === 0) {
			return 0
		}
		const total = visibleGames.reduce((acc, game) => {
			return acc + getBlendedRating(game.baseRating, ratings[game.id])
		}, 0)
		return total / visibleGames.length
	}, [visibleGames, ratings])

	const handleLogin = (event) => {
		event.preventDefault()
		if (!authForm.username.trim() || !authForm.password.trim()) {
			setNotice('Please enter both username and password to continue.')
			return
		}

		setUser({ username: authForm.username.trim() })
		setProfile((prev) => ({
			...prev,
			displayName: prev.displayName || authForm.username.trim()
		}))
		setAuthForm({ username: '', password: '' })
		setNotice('Logged in successfully. Your profile and ratings are now active.')
	}

	const handleLogout = () => {
		setUser(null)
		setNotice('You logged out. Log back in to rate games and manage your profile.')
	}

	const handleRating = (gameId, value) => {
		if (!user) {
			setNotice('Log in first to add personal ratings.')
			return
		}
		setRatings((prev) => ({ ...prev, [gameId]: value }))
		setNotice('Rating saved.')
	}

	return (
		<main className="homepage-root">
			<header className="hero">
				<div>
					<p className="hero-kicker">Home</p>
					<h1>Game play for life</h1>
					<p className="hero-subtitle">
						Your all-in-one FPS homepage with account access, profile settings, and 50 top first-person shooters from 2000-2020.
					</p>
				</div>
				<div className="hero-stats">
					<article>
						<span>Catalog Size</span>
						<strong>{shooterGames.length}</strong>
					</article>
					<article>
						<span>Year Window</span>
						<strong>2000-2020</strong>
					</article>
					<article>
						<span>Avg Rating</span>
						<strong>{catalogAverage.toFixed(1)} / 5</strong>
					</article>
				</div>
			</header>

			{notice ? <p className="notice">{notice}</p> : null}

			<section className="account-section">
				<article className="panel">
					<h2>Login</h2>
					{!user ? (
						<form className="stack" onSubmit={handleLogin}>
							<label>
								Username
								<input
									type="text"
									value={authForm.username}
									onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
									placeholder="Player name"
								/>
							</label>
							<label>
								Password
								<input
									type="password"
									value={authForm.password}
									onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
									placeholder="Secure password"
								/>
							</label>
							<button type="submit" className="primary-btn">Sign In</button>
						</form>
					) : (
						<div className="stack">
							<p className="status-line">Signed in as <strong>{user.username}</strong>.</p>
							<button type="button" className="secondary-btn" onClick={handleLogout}>Sign Out</button>
						</div>
					)}
				</article>

				<article className="panel">
					<h2>Profile</h2>
					<div className="stack">
						<label>
							Display Name
							<input
								type="text"
								value={profile.displayName}
								onChange={(event) => setProfile((prev) => ({ ...prev, displayName: event.target.value }))}
								placeholder="What should players call you?"
							/>
						</label>
						<label>
							Avatar URL
							<input
								type="url"
								value={profile.avatarUrl}
								onChange={(event) => setProfile((prev) => ({ ...prev, avatarUrl: event.target.value }))}
								placeholder="https://example.com/avatar.png"
							/>
						</label>
						<label>
							Favorite Theme
							<select
								value={profile.favoriteTheme}
								onChange={(event) => setProfile((prev) => ({ ...prev, favoriteTheme: event.target.value }))}
							>
								{themeOptions.filter((theme) => theme !== 'All').map((theme) => (
									<option key={theme} value={theme}>{theme}</option>
								))}
							</select>
						</label>
						<label>
							Bio
							<textarea
								rows="3"
								value={profile.bio}
								onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
								placeholder="Share your favorite FPS style"
							/>
						</label>
					</div>
				</article>
			</section>

			<section className="filters panel">
				<h2>Game Ratings and Discovery</h2>
				<div className="filters-grid">
					<label>
						Search Game
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by title"
						/>
					</label>
					<label>
						Theme
						<select value={selectedTheme} onChange={(event) => setSelectedTheme(event.target.value)}>
							{themeOptions.map((theme) => (
								<option key={theme} value={theme}>{theme}</option>
							))}
						</select>
					</label>
					<label>
						From Year
						<input
							type="number"
							min="2000"
							max="2020"
							value={yearRange.from}
							onChange={(event) => setYearRange((prev) => ({ ...prev, from: event.target.value }))}
						/>
					</label>
					<label>
						To Year
						<input
							type="number"
							min="2000"
							max="2020"
							value={yearRange.to}
							onChange={(event) => setYearRange((prev) => ({ ...prev, to: event.target.value }))}
						/>
					</label>
				</div>
			</section>

			<section className="games-grid" aria-label="First-person shooter games list">
				{visibleGames.map((game) => {
					const userRating = ratings[game.id]
					const blended = getBlendedRating(game.baseRating, userRating)

					return (
						<article className="game-card" key={game.id}>
							<div className="game-top">
								<h3>{game.title}</h3>
								<span>{game.year}</span>
							</div>
							<p className="game-theme">Theme: {game.theme}</p>
							<p className="game-score">Community rating: {blended.toFixed(1)} / 5</p>
							<div className="rating-actions" role="group" aria-label={`Rate ${game.title}`}>
								{[1, 2, 3, 4, 5].map((value) => (
									<button
										key={value}
										type="button"
										className={userRating === value ? 'star-btn active' : 'star-btn'}
										onClick={() => handleRating(game.id, value)}
									>
										{value}
									</button>
								))}
							</div>
							<p className="small-note">
								{userRating ? `Your rating: ${userRating}/5` : 'Set your personal rating'}
							</p>
						</article>
					)
				})}
			</section>
		</main>
	)
}
