import { useEffect, useState } from 'react';
import heroImage from '../../assets/hero-architecture.jpg';
import Reveal from '../Reveal/Reveal';

function AuthSwitch({ checked, ariaLabel, onChange }) {
	return (
		<label className="relative h-7 w-12 cursor-pointer">
			<input
				checked={checked}
				className="peer sr-only"
				type="checkbox"
				aria-label={ariaLabel}
				onChange={(event) => onChange(event.target.checked)}
			/>
			<span className="absolute inset-0 rounded-full bg-white/25 transition peer-checked:bg-white/55" />
			<span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-300 peer-checked:translate-x-5" />
		</label>
	);
}

function AuthField({ id, label, type = 'text', name, placeholder, required = true }) {
	return (
		<label className="flex flex-col gap-2.5">
			<span className="text-[0.92rem] font-normal text-white/90">
				{label} {required ? <span className="text-white/40">*</span> : null}
			</span>
			<input
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				required={required}
				className="h-14 rounded-xl border-0 bg-[#efefee] px-[18px] text-[0.98rem] text-[#141414] outline-none transition focus:ring-2 focus:ring-white/55"
			/>
		</label>
	);
}

export default function AuthPage({ initialMode = 'signup' }) {
	const [mode, setMode] = useState(initialMode);
	const [isProfessional, setIsProfessional] = useState(false);
	const [signupError, setSignupError] = useState('');
	const [loginError, setLoginError] = useState('');

	useEffect(() => {
		setMode(initialMode);
	}, [initialMode]);

	useEffect(() => {
		setSignupError('');
		setLoginError('');
	}, [mode]);

	async function handleSignupSubmit(event) {
		event.preventDefault();
		setSignupError('');
		const form = new FormData(event.currentTarget);
		const userType = isProfessional ? 'professionnel' : 'client';
		const payload = {
			phone: form.get('phone'),
			email: form.get('email'),
			password: form.get('password'),
		};

		if (isProfessional) {
			payload.company_name = form.get('company_name');
			payload.company_address = form.get('company_address');
		}

		try {
			const response = await fetch(`/inscription?user_type=${userType}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				setMode('login');
				return;
			}

			setSignupError("Une erreur est survenue lors de l'inscription.");
		} catch {
			setSignupError('Erreur réseau. Réessayez.');
		}
	}

	async function handleLoginSubmit(event) {
		event.preventDefault();
		setLoginError('');
		const form = new FormData(event.currentTarget);

		try {
			const response = await fetch('/connexion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: form.get('email'),
					password: form.get('password'),
				}),
			});

			if (response.status === 204) {
				const clientProfileResponse = await fetch('/profil', { credentials: 'same-origin' });
				if (clientProfileResponse.ok) {
					const clientProfile = await clientProfileResponse.json();
					if (clientProfile?.message?.est_pro) {
						window.location.href = '/app/profil/professionnel';
						return;
					}
					window.location.href = '/app/profil';
					return;
				}

				const professionalProfileResponse = await fetch('/profil/professionnel/', {
					credentials: 'same-origin',
				});
				if (professionalProfileResponse.ok) {
					window.location.href = '/app/profil/professionnel';
					return;
				}
			}

			setLoginError('Email ou mot de passe incorrect.');
		} catch {
			setLoginError('Erreur réseau. Réessayez.');
		}
	}

	const isLogin = mode === 'login';

	return (
		<main className="relative min-h-screen overflow-hidden bg-brand-black text-white">
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%), url(${heroImage})`,
				}}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.18)_100%)]" />

			<section className="relative z-[1] mx-auto flex min-h-screen w-content items-center px-0 pb-12 pt-28">
				<Reveal from="left" className="w-full max-w-[440px]">
					<div className="relative flex min-h-[688px] w-full overflow-hidden rounded-[30px] bg-[linear-gradient(90deg,rgba(12,12,12,0.16)_0%,rgba(17,17,17,0.38)_18%,rgba(25,25,25,0.72)_54%,rgba(56,56,56,0.9)_100%)] p-10 shadow-[0_22px_44px_rgba(0,0,0,0.18)] backdrop-blur-[22px]">
						<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.12)_14%,rgba(255,255,255,0.015)_46%,rgba(255,255,255,0.05)_100%)] [mask-image:linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.9)_16%,rgba(0,0,0,1)_36%)] [-webkit-mask-image:linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.9)_16%,rgba(0,0,0,1)_36%)]" />
						<div className="pointer-events-none absolute inset-[1px] rounded-[29px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),inset_-1px_0_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(255,255,255,0.02)] [clip-path:inset(0_0_0_10px_round_29px)]" />

						<div className="relative z-[1] flex min-h-full w-full flex-col">
							<div className="mb-[30px] flex items-center justify-between gap-4">
								<h1 className="m-0 text-[1.7rem] font-semibold tracking-[-0.02em]">
									{isLogin ? 'Se connecter' : 'Créer un compte'}
								</h1>
								<AuthSwitch
									checked={isLogin}
									ariaLabel={isLogin ? "Basculer vers l'inscription" : 'Basculer vers la connexion'}
									onChange={(checked) => setMode(checked ? 'login' : 'signup')}
								/>
							</div>

							{isLogin ? (
								<div className="flex min-h-full flex-col">
									<form className="mb-0 flex flex-col gap-[18px]" onSubmit={handleLoginSubmit}>
										<AuthField
											id="li-email"
											name="email"
											type="email"
											label="Email"
											placeholder="vous@exemple.fr"
										/>
										<AuthField
											id="li-password"
											name="password"
											type="password"
											label="Mot de passe"
											placeholder="••••••••"
										/>

										<button
											type="submit"
											className="mt-0 w-full rounded-[14px] bg-[linear-gradient(180deg,#5a5a5a_0%,#2f2f2f_100%)] px-4 py-4 text-[1.02rem] font-medium text-white shadow-[0_8px_22px_rgba(0,0,0,0.3)] transition hover:-translate-y-px hover:brightness-110"
										>
											Se connecter
										</button>

										{loginError ? (
											<div className="rounded-[10px] border border-[rgba(255,80,80,0.28)] bg-[rgba(255,80,80,0.14)] px-4 py-3 text-center text-[0.85rem] text-[#ff9090]">
												{loginError}
											</div>
										) : null}

										<a className="mt-4 inline-block text-[0.9rem] text-white/90 underline underline-offset-2 hover:text-white" href="#">
											Mot de passe oublié ?
										</a>
									</form>

									<div className="mb-[22px] mt-[42px] flex items-center gap-4">
										<div className="h-px flex-1 bg-white/15" />
										<span className="text-[0.9rem] text-white/55">Ou</span>
										<div className="h-px flex-1 bg-white/15" />
									</div>

									<button
										type="button"
										onClick={() => setMode('signup')}
										className="mx-auto flex w-[calc(100%-64px)] min-w-[230px] justify-center rounded-xl bg-white px-[18px] py-[14px] text-center text-[1rem] font-semibold text-[#141414] transition hover:opacity-90"
									>
										Inscription
									</button>
								</div>
							) : (
								<>
									<form className="flex flex-1 flex-col gap-[18px]" onSubmit={handleSignupSubmit}>
										<AuthField
											id="su-phone"
											name="phone"
											type="tel"
											label="Numéro de téléphone"
											placeholder="+33 6 00 00 00 00"
										/>
										<AuthField
											id="su-email"
											name="email"
											type="email"
											label="Email"
											placeholder="vous@exemple.fr"
										/>
										<AuthField
											id="su-password"
											name="password"
											type="password"
											label="Mot de passe"
											placeholder="••••••••"
										/>

										<button
											type="button"
											aria-expanded={isProfessional}
											onClick={() => setIsProfessional((value) => !value)}
											className="my-[2px] flex w-full items-center justify-center py-1 text-white/55 transition hover:text-white/90"
										>
											<svg
												width="18"
												height="10"
												viewBox="0 0 18 10"
												fill="none"
												className={isProfessional ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}
											>
												<path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>

										{isProfessional ? (
											<>
												<AuthField
													id="su-company"
													name="company_name"
													label="Nom de l'entreprise"
													placeholder="Acme SAS"
												/>
												<AuthField
													id="su-address"
													name="company_address"
													label="Adresse de l'entreprise"
													placeholder="12 rue de la Paix, Paris"
												/>
											</>
										) : null}

										<label className="mt-1 flex items-center gap-[11px] text-[0.9rem] text-white/90">
											<input
												required
												type="checkbox"
												className="h-[17px] w-[17px] shrink-0 accent-white"
											/>
											<span>
												J&apos;accepte les{' '}
												<a className="underline underline-offset-2" href="/">
													CGU
												</a>{' '}
												de Prestat
											</span>
										</label>

										<button
											type="submit"
											className="w-full rounded-[14px] bg-[linear-gradient(180deg,#5a5a5a_0%,#2f2f2f_100%)] px-4 py-4 text-[1.02rem] font-medium text-white shadow-[0_8px_22px_rgba(0,0,0,0.3)] transition hover:-translate-y-px hover:brightness-110"
										>
											S&apos;inscrire
										</button>

										{signupError ? (
											<div className="rounded-[10px] border border-[rgba(255,80,80,0.28)] bg-[rgba(255,80,80,0.14)] px-4 py-3 text-center text-[0.85rem] text-[#ff9090]">
												{signupError}
											</div>
										) : null}

										<p className="mt-4 text-center text-[0.74rem] leading-[1.65] text-white/55">
											Vos informations sont traitées par Prestat, consultez notre{' '}
											<a className="text-white/70 underline underline-offset-2" href="/">
												politique de confidentialité
											</a>
											. Ce site est protégé par reCAPTCHA et est soumis à la{' '}
											<a
												className="text-white/70 underline underline-offset-2"
												href="https://policies.google.com/privacy"
											>
												Politique de Confidentialité
											</a>{' '}
											et aux{' '}
											<a
												className="text-white/70 underline underline-offset-2"
												href="https://policies.google.com/terms"
											>
												Conditions d&apos;Utilisation
											</a>{' '}
											de Google.
										</p>
									</form>

									<p className="mt-auto text-center text-[0.92rem] text-white/70">
										Déjà inscrit ?{' '}
										<button
											type="button"
											onClick={() => setMode('login')}
											className="font-medium text-white transition hover:underline"
										>
											Connexion
										</button>
									</p>
								</>
							)}
						</div>
					</div>
				</Reveal>
			</section>
		</main>
	);
}
