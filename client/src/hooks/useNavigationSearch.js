import { useEffect, useRef, useState } from 'react';
import { navigateTo } from '../lib/navigation';

export function useNavigationSearch() {
	const [query, setQuery] = useState('');
	const [ville, setVille] = useState('');
	const [serviceSuggestions, setServiceSuggestions] = useState([]);
	const [villeSuggestions, setVilleSuggestions] = useState([]);
	const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
	const [showVilleSuggestions, setShowVilleSuggestions] = useState(false);
	const [activeSuggestionField, setActiveSuggestionField] = useState(null);
	const searchRef = useRef(null);

	function closeSuggestions() {
		setShowServiceSuggestions(false);
		setShowVilleSuggestions(false);
		setActiveSuggestionField(null);
	}

	function buildNavigationUrl(nextQuery = query, nextVille = ville) {
		const params = new URLSearchParams();
		const trimmedQuery = nextQuery.trim();
		const trimmedVille = nextVille.trim();

		if (trimmedQuery) {
			params.set('q', trimmedQuery);
		}

		if (trimmedVille) {
			params.set('ville', trimmedVille);
		}

		const search = params.toString();
		return search ? `/navigation?${search}` : '/navigation';
	}

	function handleSearch(event) {
		event.preventDefault();
		closeSuggestions();
		navigateTo(buildNavigationUrl());
	}

	function handleDiscoverProviders() {
		closeSuggestions();
		navigateTo('/navigation');
	}

	function handleSelectService(serviceName) {
		setQuery(serviceName);
		setShowServiceSuggestions(false);
		setActiveSuggestionField('service');
	}

	function handleSelectVille(cityName) {
		setVille(typeof cityName === 'string' ? cityName : cityName?.value || '');
		setShowVilleSuggestions(false);
		setActiveSuggestionField('ville');
	}

	useEffect(() => {
		function handleClickOutside(event) {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				closeSuggestions();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		let cancelled = false;

		const timeoutId = window.setTimeout(async () => {
			const trimmedQuery = query.trim();
			const trimmedVille = ville.trim();

			// Si le focus est sur "prestation" et qu'on n'a rien tapé,
			// je n'appelle pas le back : on affiche juste l'entrée découverte.
			if (activeSuggestionField === 'service' && !trimmedQuery) {
				if (!cancelled) {
					setServiceSuggestions([]);
				}
				return;
			}

			// Si aucun champ n'est actif, je n'ai rien à charger.
			if (!activeSuggestionField) {
				return;
			}

			// Pour la ville, même vide, je récupère la liste des villes dispo.
			if (activeSuggestionField !== 'ville' && !trimmedQuery && !trimmedVille) {
				if (!cancelled) {
					setServiceSuggestions([]);
					setVilleSuggestions([]);
				}
				return;
			}

			try {
				const response = await fetch(
					`/service/search-suggestions?q=${encodeURIComponent(query)}&ville=${encodeURIComponent(ville)}`,
					{ credentials: 'same-origin' }
				);

				if (!response.ok) {
					return;
				}

				const payload = await response.json();
				if (!cancelled) {
					setServiceSuggestions(payload?.message?.services || []);
					setVilleSuggestions(payload?.message?.villes || []);
				}
			} catch {
				if (!cancelled) {
					setServiceSuggestions([]);
					setVilleSuggestions([]);
				}
			}
		}, 180);

		return () => {
			cancelled = true;
			window.clearTimeout(timeoutId);
		};
	}, [query, ville, activeSuggestionField]);

	return {
		query,
		setQuery,
		ville,
		setVille,
		serviceSuggestions,
		villeSuggestions,
		showServiceSuggestions,
		setShowServiceSuggestions,
		showVilleSuggestions,
		setShowVilleSuggestions,
		activeSuggestionField,
		setActiveSuggestionField,
		searchRef,
		handleSearch,
		handleSelectService,
		handleSelectVille,
		handleDiscoverProviders,
		showDiscoverProviders: showServiceSuggestions && activeSuggestionField === 'service' && !query.trim(),
		closeSuggestions,
	};
}
