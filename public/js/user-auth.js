// user-auth.js

// Fonction pour vérifier si l'utilisateur est connecté
function checkUserLoggedIn() {
	const clientID = getCookie('clientID');
	if (clientID) {
		updateUIForLoggedInUser(clientID);
	}
}

// Fonction pour mettre à jour l'interface utilisateur pour un utilisateur connecté
function updateUIForLoggedInUser(clientID) {
	const welcomeMessage = document.getElementById('welcome-message');
	const profileLink = document.getElementById('profile-link');
	welcomeMessage.textContent = 'Bienvenue, Utilisateur ' + clientID;
	profileLink.href = '/profil/' + clientID;
}

// Fonnction pour définir un cookie
function setCookie(cname, cvalue, days) {
	const d = new Date();
	d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
}

// Fonction pour obtenir la valeur d'un cookie
function getCookie(cname) {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(';');
	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];
		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return '';
}

// Fonction pour supprimer un cookie
function deleteCookie(cname) {
	document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
