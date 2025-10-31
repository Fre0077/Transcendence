

export function loadLoginPage(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */ `
		<!-- Main Content -->
		<main class="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
			<section class="w-full max-w-md">
				<!-- Card -->
				<div class="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-xl">
					<div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-2xl"></div>
					<div class="relative z-10 p-8">
						<header class="mb-8 text-center">
							<h1 class="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
							<p class="mt-2 text-white/70">Please sign in to continue</p>
						</header>

						<form id="login-form" class="space-y-5" novalidate>
							<div>
								<label for="email" class="block text-sm font-medium text-white/80 mb-2">Email</label>
								<input
									id="email"
									type="email"
									autocomplete="email"
									placeholder="you@example.com"
									class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
									required
								/>
							</div>

							<div>
								<label for="password" class="block text-sm font-medium text-white/80 mb-2">Password</label>
								<input
									id="password"
									type="password"
									autocomplete="current-password"
									placeholder="••••••••••"
									class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
									required
								/>
							</div>

							<div class="flex items-center justify-between text-sm">
								<a href="/forgot" data-link class="text-purple-300 hover:text-purple-200">Forgot password?</a>
							</div>

							<button
								type="submit"
								class="mt-2 w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
							>
								Sign in
							</button>

							<p class="mt-6 text-center text-sm text-white/70">
								Don't have an account?
								<a href="/register" data-link class="text-purple-300 hover:text-purple-200 font-medium">Create one</a>
							</p>
						</form>
					</div>
				</div>
			</section>
		</main>
	`;

	const form = div.querySelector('#login-form') as HTMLFormElement;
	const emailInput = div.querySelector('#email') as HTMLInputElement;
	const passwordInput = div.querySelector('#password') as HTMLInputElement;

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const email = emailInput.value;
		const password = passwordInput.value;

		// Simple validation
		// if (!email || !password) {
		// 	alert('Please enter both email and password.');
		// 	return;
		// }

		// Simulate login process
		console.log('Logging in with', { email, password });
		localStorage.setItem('authToken', 'dummy-token');
		window.location.href = '/home';
	});

	return div;
}