export const gamingApi = {
	name: 'IGDB',
	website: 'https://www.igdb.com/api',
	bestFor: [
		'first-person shooters',
		'military shooters',
		'space shooters',
		'tactical shooters',
		'sci-fi action games'
	],
	strengths: [
		'Rich game metadata',
		'Genre and subgenre filtering',
		'Platform and release support',
		'Good fit for discovery and catalog views'
	],
	recommendedUseCases: [
		'Search and filter shooter games by genre, theme, and platform',
		'Build a featured games page for military and space titles',
		'Show game artwork, summaries, and release details in the UI'
	]
}

export const shooterGameDiscovery = [
	{
		title: 'Military Shooters',
		query: 'tactical combat, squad-based missions, modern warfare',
		tags: ['fps', 'military', 'tactical', 'multiplayer']
	},
	{
		title: 'Space Shooters',
		query: 'sci-fi combat, starfighters, planetary battles, space ops',
		tags: ['space', 'sci-fi', 'fps', 'action']
	},
	{
		title: 'Futuristic Shooters',
		query: 'advanced weapons, alien worlds, cyber warfare',
		tags: ['futuristic', 'sci-fi', 'shooter', 'campaign']
	},
	{
		title: 'Arena Shooters',
		query: 'fast-paced combat, competitive matches, respawn gameplay',
		tags: ['arena', 'competitive', 'multiplayer', 'fps']
	}
]

export const igdbFilters = {
	genres: ['Shooter', 'Adventure', 'Action'],
	themes: ['War', 'Science Fiction', 'Stealth', 'Combat'],
	platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
	sortOptions: ['rating desc', 'popularity desc', 'release_date desc']
}

export const igdbIntegrationNotes = [
	'Use the IGDB API for game discovery and metadata.',
	'Store API credentials securely in environment variables.',
	'Cache responses for faster UI rendering and fewer requests.',
	'Map game results into cards, filters, and category sections.'
]

export default gamingApi
