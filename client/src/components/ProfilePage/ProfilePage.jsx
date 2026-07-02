import { useEffect, useState } from 'react';
import ClientProfileShell from './ClientProfileShell';
import ProfessionalDashboardShell from './ProfessionalProfileShell';
import { fetchWithTimeout, readJsonSafely } from './ProfilePage.shared';

export default function ProfilePage({ variant = 'client' }) {
	// Je garde l'état global du profil ici pour partager la même logique entre client et pro.
	const [state, setState] = useState({
		loading: true,
		error: '',
		profile: null,
		reservations: [],
	});

	useEffect(() => {
		let cancelled = false;

		async function loadProfile() {
			// Je recharge le profil et les réservations selon la variante affichée.
			setState({ loading: true, error: '', profile: null, reservations: [] });
			const endpoint = variant === 'professional' ? '/profil/professionnel/' : '/profil';

			try {
				// Promise.all lance les deux requêtes en même temps,
				// donc j'évite d'attendre l'une puis l'autre pour rien.
				const reservationsEndpoint =
					variant === 'professional' ? '/reservation' : '/reservation/client';

				const [profileResponse, reservationsResponse] = await Promise.all([
					fetchWithTimeout(endpoint, { credentials: 'same-origin' }),
					fetchWithTimeout(reservationsEndpoint, { credentials: 'same-origin' }),
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

				if (reservationsResponse && reservationsResponse.ok) {
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
			// Si le composant disparaît pendant le chargement,
			// j'évite une mise à jour d'état sur une vue déjà démontée.
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
		return <ProfessionalDashboardShell profile={state.profile} reservations={state.reservations} />;
	}

	function handleClientProfileUpdated(nextProfile) {
		// Je mets à jour seulement le profil local après une édition réussie.
		setState((current) => ({
			...current,
			profile: nextProfile,
		}));
	}

	return <ClientProfileShell profile={state.profile} reservations={state.reservations} onProfileUpdated={handleClientProfileUpdated} />;
}
