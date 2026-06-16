export function getCurrentLocation() {
	return {
		pathname: window.location.pathname.replace(/\/+$/, '') || '/',
		search: window.location.search,
	};
}

export function isInternalNavigationTarget(href) {
	if (!href || href.startsWith('#')) {
		return false;
	}

	if (/^(mailto:|tel:|javascript:)/i.test(href)) {
		return false;
	}

	const targetUrl = new URL(href, window.location.origin);
	if (targetUrl.origin !== window.location.origin) {
		return false;
	}

	if (targetUrl.pathname.startsWith('/api') || targetUrl.pathname.startsWith('/deconnexion')) {
		return false;
	}

	return true;
}

export function navigateTo(href, { replace = false } = {}) {
	if (!isInternalNavigationTarget(href)) {
		window.location.assign(href);
		return;
	}

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

	applyNavigation();
}
