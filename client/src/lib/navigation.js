export function getCurrentLocation() {
	return {
		pathname: window.location.pathname.replace(/\/+$/, '') || '/',
		search: window.location.search,
	};
}

export function navigateTo(href, { replace = false } = {}) {
	const targetUrl = new URL(href, window.location.origin);
	const nextPathname = targetUrl.pathname.replace(/\/+$/, '') || '/';
	const nextUrl = `${nextPathname}${targetUrl.search}`;
	const currentUrl = `${window.location.pathname.replace(/\/+$/, '') || '/'}${window.location.search}`;

	if (nextUrl === currentUrl) {
		return;
	}

	const applyNavigation = () => {
		if (replace) {
			window.history.replaceState({}, '', nextUrl);
		} else {
			window.history.pushState({}, '', nextUrl);
		}

		window.dispatchEvent(new Event('codex:navigation'));
	};

	const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
	const supportsViewTransitions = typeof document.startViewTransition === 'function';

	if (supportsViewTransitions && !prefersReducedMotion) {
		document.startViewTransition(applyNavigation);
		return;
	}

	applyNavigation();
}
