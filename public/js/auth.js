(function () {
	'use strict';

	const body = document.body;

	// ── Mode toggle: Inscription <-> Connexion ──
	const toplink = document.getElementById('auth-toplink');

	function applyMode(mode, animate) {
		body.dataset.mode = mode;
		if (mode === 'login') {
			body.classList.add('mode-login');
			if (toplink) toplink.querySelector('.label').textContent = 'Inscription';
			if (toplink) toplink.setAttribute('href', '/inscription/');
		} else {
			body.classList.remove('mode-login');
			if (toplink) toplink.querySelector('.label').textContent = 'Connexion';
			if (toplink) toplink.setAttribute('href', '/connexion/');
		}
		if (animate) {
			const view = body.classList.contains('mode-login')
				? document.querySelector('.auth-view.mode-login')
				: document.querySelector('.auth-view.mode-signup');
			if (view) {
				view.classList.remove('auth-view');
				void view.offsetWidth; // reflow to restart animation
				view.classList.add('auth-view');
			}
		}
		// keep both mode toggles in sync
		document.querySelectorAll('.mode-toggle-input').forEach((el) => {
			el.checked = mode === 'login';
		});
	}

	document.querySelectorAll('.mode-toggle-input').forEach((el) => {
		el.addEventListener('change', () => {
			applyMode(el.checked ? 'login' : 'signup', true);
		});
	});

	// in-page switch links (bottom links)
	document.querySelectorAll('[data-switch-mode]').forEach((el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();
			applyMode(el.dataset.switchMode, true);
		});
	});

	// initial mode from data attribute
	applyMode(body.dataset.mode || 'signup', false);

	// ── Pro fields expander (chevron below password) ──
	let isPro = false;
	const proExpand = document.getElementById('pro-expand');
	if (proExpand) {
		proExpand.addEventListener('click', () => {
			isPro = !isPro;
			body.classList.toggle('is-pro', isPro);
			proExpand.classList.toggle('open', isPro);
			proExpand.setAttribute('aria-expanded', String(isPro));
		});
	}

	// ── Signup submit ──
	const signupForm = document.getElementById('signup-form');
	if (signupForm) {
		signupForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const userType = isPro ? 'professionnel' : 'client';
			const data = {
				phone: signupForm.phone.value,
				email: signupForm.email.value,
				password: signupForm.password.value,
			};
			if (isPro) {
				data.company_name = signupForm.company_name.value;
				data.company_address = signupForm.company_address.value;
			}
			try {
				const res = await fetch(`/inscription?user_type=${userType}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});
				if (res.ok) {
					window.location.href = '/connexion/';
				} else {
					showError('signup-error', "Une erreur est survenue lors de l'inscription.");
				}
			} catch {
				showError('signup-error', 'Erreur réseau. Réessayez.');
			}
		});
	}

	// ── Login submit ──
	const loginForm = document.getElementById('login-form');
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			try {
				const res = await fetch('/connexion', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: loginForm.email.value,
						password: loginForm.password.value,
					}),
				});
				if (res.status === 200) {
					const u = await res.json();
					if (u.users_id) window.location.href = `/profil/${u.users_id}`;
					else if (u.professional_id) window.location.href = `/profil/${u.professional_id}`;
				} else {
					showError('login-error', 'Email ou mot de passe incorrect.');
				}
			} catch {
				showError('login-error', 'Erreur réseau. Réessayez.');
			}
		});
	}

	function showError(id, msg) {
		const el = document.getElementById(id);
		if (el) { el.textContent = msg; el.classList.add('show'); }
	}
})();
