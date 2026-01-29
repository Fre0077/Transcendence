function getInitials(username: string): string {
		const firstInitial = username.charAt(0).toUpperCase();
		const lastInitial = username.charAt(username.length - 1).toUpperCase();
		return `${firstInitial}${lastInitial}`;
}

function getAvatarColor(name: string): string {
		// Generate consistent color based on name
		const colors = [
				'#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
				'#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
				'#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
				'#ec4899', '#f43f5e'
		];
		const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
}

export function generateInitialsAvatar(username: string): string {
		const initials = getInitials(username);
		const bgColor = getAvatarColor(username);
		
		return `data:image/svg+xml,${encodeURIComponent(`
				<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
						<rect width="150" height="150" fill="${bgColor}"/>
						<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
									font-family="system-ui, -apple-system, sans-serif" 
									font-size="60" font-weight="600" fill="white">
								${initials}
						</text>
				</svg>
		`)}`;
}
