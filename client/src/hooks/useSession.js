import { useEffect, useState } from 'react';

export function useSession() {
	const [state, setState] = useState({
		loading: true,
		isAuthenticated: false,
		profile: null,
	});

	useEffect(() => {
		let cancelled = false;

		async function loadSession() {
			try {
				const response = await fetch('/profil', { credentials: 'same-origin' });
				if (!response.ok) {
					if (!cancelled) {
						setState({ loading: false, isAuthenticated: false, profile: null });
					}
					return;
				}

				const payload = await response.json();
				if (!cancelled) {
					setState({
						loading: false,
						isAuthenticated: true,
						profile: payload.message ?? null,
					});
				}
			} catch {
				if (!cancelled) {
					setState({ loading: false, isAuthenticated: false, profile: null });
				}
			}
		}

		loadSession();

		return () => {
			cancelled = true;
		};
	}, []);

	return state;
}
