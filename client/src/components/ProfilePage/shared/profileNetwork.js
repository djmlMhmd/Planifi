export async function readJsonSafely(response) {
	// Certaines routes renvoient 204, donc je protège la lecture JSON ici.
	if (response.status === 204) {
		return null;
	}

	// Je lis d'abord le body en texte pour pouvoir gérer tranquillement
	// les réponses vides avant de tenter un JSON.parse.
	const rawBody = await response.text();
	if (!rawBody) {
		return null;
	}

	return JSON.parse(rawBody);
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
	// Je coupe les appels trop longs pour éviter une UI bloquée si le back ne répond pas.
	const controller = new AbortController();
	// AbortController me donne un signal que je passe à fetch
	// pour annuler proprement la requête après le délai fixé.
	const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, {
			...options,
			signal: controller.signal,
		});
	} finally {
		window.clearTimeout(timeoutId);
	}
}
