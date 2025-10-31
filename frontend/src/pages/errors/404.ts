export function load404Page(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen flex items-center justify-center bg-gray-50';
	div.innerHTML = `
	<div class="text-center">
		<h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
		<p class="text-xl text-gray-600 mb-8">Page not found</p>
		<a href="/" class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
		Go Home
		</a>
	</div>
	`;
	return div;
}