

export function loadRegisterPage(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */ `
		<!-- Main Content -->
		<main class="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
			<section class="w-full max-w-md">
				<h1 class="text-4xl font-bold text-white mb-6 text-center">Create an Account</h1>
				<form id="register-form" class="bg-slate-800/70 backdrop-blur-sm rounded-lg p-6 space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium text-white/80 mb-1">Username</label>
						<input type="text" id="username" name="username" required
							class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
							placeholder="Choose a username" />
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-white/80 mb-1">Email</label>
						<input type="email" id="email" name="email" required
							class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
							placeholder="you@example.com" />
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-white/80 mb-1">Password</label>
						<input type="password" id="password" name="password" required
							class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
							placeholder="Create a password" />
					</div>
					<button type="submit"
						class="w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition">
						Register
					</button>
					<p class="mt-4 text-center text-sm text-white/70">
						Already have an account?
						<a href="/login" data-link class="text-purple-300 hover:text-purple-200 font-medium">Sign in</a>
					</p>
				</form>
			</section>
		</main>
	`;
	return div;
}