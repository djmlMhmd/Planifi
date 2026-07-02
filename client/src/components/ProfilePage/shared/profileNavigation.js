export function getProfileTabFromLocation(search = window.location.search) {
	// Je centralise la lecture du tab ici pour garder la même logique partout.
	const tabParam = new URLSearchParams(search).get('tab');
	if (tabParam === 'settings' || tabParam === 'favorites' || tabParam === 'calendar' || tabParam === 'documents') {
		return tabParam;
	}
	return 'dashboard';
}

export function getProfessionalTabFromLocation(search = window.location.search) {
	const tabParam = new URLSearchParams(search).get('tab');
	if (tabParam === 'profile' || tabParam === 'settings' || tabParam === 'favorites' || tabParam === 'calendar' || tabParam === 'documents') {
		return tabParam;
	}
	return 'dashboard';
}

export function resolveProfessionalProviderId(profile) {
	const companyName = (profile?.company_name || '').toLowerCase();
	if (companyName.includes('tressa')) return 'tressa';
	if (companyName.includes('atelier')) return 'atelier';
	if (companyName.includes('maison')) return 'maison';
	return 'tressa';
}

export function getProfessionalProviderStorageId(profile) {
	return profile?.users_id ? `pro-${profile.users_id}` : resolveProfessionalProviderId(profile);
}
