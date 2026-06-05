import { useEffect, useState } from 'react';
import ClientProfileShell from './ClientProfileShell';
import ProfessionalDashboardShell from './ProfessionalProfileShell';
import { fetchWithTimeout, readJsonSafely } from './ProfilePage.shared';

export default function ProfilePage({ variant = 'client' }) {
	const [state, setState] = useState({
		loading: true,
		error: '',
		profile: null,
		reservations: [],
	});

	useEffect(() => {
		let cancelled = false;

		async function loadProfile() {
			setState({ loading: true, error: '', profile: null, reservations: [] });
			const endpoint = variant === 'professional' ? '/profil/professionnel/' : '/profil';

			try {
				const [profileResponse, reservationsResponse] = await Promise.all([
					fetchWithTimeout(endpoint, { credentials: 'same-origin' }),
					variant === 'client'
						? fetchWithTimeout('/reservation/client', { credentials: 'same-origin' })
						: Promise.resolve(null),
				]);

				if (!profileResponse.ok) {
					if (!cancelled) {
						setState({
							loading: false,
							error: 'Impossible de charger le profil.',
							profile: null,
							reservations: [],
						});
					}
					return;
				}

				const profilePayload = await readJsonSafely(profileResponse);
				let reservations = [];

				if (variant === 'client' && reservationsResponse && reservationsResponse.ok) {
					const reservationsPayload = await readJsonSafely(reservationsResponse);
					reservations = reservationsPayload?.message ?? [];
				}

				if (!cancelled) {
					setState({
						loading: false,
						error: '',
						profile: profilePayload.message ?? null,
						reservations,
					});
				}
			} catch (error) {
				if (!cancelled) {
					setState({
						loading: false,
						error:
							error?.name === 'AbortError'
								? 'Le serveur met trop de temps à répondre. Vérifie que PostgreSQL est bien démarré.'
								: 'Erreur réseau lors du chargement du profil.',
						profile: null,
						reservations: [],
					});
				}
			}
		}

		loadProfile();

		return () => {
			cancelled = true;
		};
	}, [variant]);

	if (state.loading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#fbfafc] text-[#5f5a72]">
				Chargement du profil...
			</main>
		);
	}

	if (state.error || !state.profile) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#fbfafc] px-6 text-center text-[#c35555]">
				{state.error || 'Impossible de charger le profil.'}
			</main>
		);
	}

	if (variant === 'professional') {
		return <ProfessionalDashboardShell profile={state.profile} />;
	}

	function handleClientProfileUpdated(nextProfile) {
		setState((current) => ({
			...current,
			profile: nextProfile,
		}));
	}

	return <ClientProfileShell profile={state.profile} reservations={state.reservations} onProfileUpdated={handleClientProfileUpdated} />;
}
