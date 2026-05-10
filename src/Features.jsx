import React, { useEffect, useRef, useState } from 'react'
import './Features.css'

const features = [
	{
		title: 'Intuitive UI',
		description: 'Clean, responsive menus, HUD, and navigation that adapt to desktop and mobile screens.',
		details: ['Responsive layout', 'Clear navigation', 'Accessible controls'],
		status: 'Live UI layer'
	},
	{
		title: 'Quick Onboarding',
		description: 'Simple tutorials and guided prompts that teach movement, combat, and game goals fast.',
		details: ['Starter tutorial', 'Context tips', 'Goal tracker'],
		status: 'Tutorial flow'
	},
	{
		title: 'Cross-Platform Play',
		description: 'Shared game sessions and progress sync across PCs, tablets, and smartphones.',
		details: ['Device sync', 'Responsive input', 'Shared profile'],
		status: 'Sync ready'
	},
	{
		title: 'Multiplayer & Social',
		description: 'Friends lists, chat, invites, and sharing tools designed for cooperative play.',
		details: ['Friends list', 'Chat panel', 'Share invite'],
		status: 'Social layer'
	},
	{
		title: 'Rewards & Achievements',
		description: 'Badges, leaderboards, and progression milestones that keep players engaged.',
		details: ['Badges', 'Leaderboards', 'Milestones'],
		status: 'Progression system'
	},
	{
		title: 'Cloud Save',
		description: 'Progress, unlocks, and settings stored safely so players can continue anywhere.',
		details: ['Auto backup', 'Profile restore', 'Device handoff'],
		status: 'Cloud synced'
	},
	{
		title: 'Customization',
		description: 'Avatar, skin, and UI theme options to make each player profile feel unique.',
		details: ['Avatars', 'Skins', 'Themes'],
		status: 'Personalization'
	},
	{
		title: 'In-App Purchases',
		description: 'Optional skins, boosts, and pass-based content with clear, non-blocking UX.',
		details: ['Skins', 'Boosts', 'Passes'],
		status: 'Store ready'
	},
	{
		title: 'Offline Mode',
		description: 'Core gameplay remains available without internet, with sync queued for later.',
		details: ['Offline play', 'Queued sync', 'Graceful fallback'],
		status: 'Available offline'
	},
	{
		title: 'Analytics',
		description: 'Gameplay tracking for tuning onboarding, difficulty, retention, and monetization.',
		details: ['Session metrics', 'Funnel events', 'Balance insights'],
		status: 'Insight layer'
	}
]

export default function Features() {
	const [selectedImage, setSelectedImage] = useState('')
	const [selectedImageName, setSelectedImageName] = useState('No image selected')
	const objectUrlRef = useRef('')

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current)
			}
		}
	}, [])

	const handleImagePick = (event) => {
		const file = event.target.files?.[0]
		if (!file) return

		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current)
		}

		const objectUrl = URL.createObjectURL(file)
		objectUrlRef.current = objectUrl
		setSelectedImage(objectUrl)
		setSelectedImageName(file.name)
	}

	return (
		<section className="features-panel" aria-labelledby="features-title">
			<div className="features-header">
				<p className="features-kicker">Game Systems</p>
				<h2 id="features-title">Core features for the adventure</h2>
				<p className="features-summary">
					This dashboard shows the systems that make the game feel complete on desktop and mobile.
				</p>

				<div className="features-image-picker">
					<label htmlFor="feature-image-input" className="features-image-label">
						Choose picture from your computer
					</label>
					<input
						id="feature-image-input"
						type="file"
						accept="image/*"
						onChange={handleImagePick}
					/>
					<small className="features-image-name">{selectedImageName}</small>
				</div>

				<div
					className={`features-image-preview${selectedImage ? ' has-image' : ''}`}
					style={selectedImage ? { backgroundImage: `url(${selectedImage})` } : undefined}
				>
					{!selectedImage && <span>Selected picture preview appears here</span>}
				</div>
			</div>

			<div className="features-grid">
				{features.map((feature) => (
					<article key={feature.title} className="feature-card">
						<div className="feature-card-top">
							<h3>{feature.title}</h3>
							<span>{feature.status}</span>
						</div>
						<p>{feature.description}</p>
						<ul>
							{feature.details.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</section>
	)
}
