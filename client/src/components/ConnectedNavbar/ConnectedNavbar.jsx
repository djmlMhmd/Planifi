import { useEffect, useRef, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import { navigateTo } from '../../lib/navigation';
import { useNavigationSearch } from '../../hooks/useNavigationSearch';

const NAVBAR_PROFILE_STORAGE_KEY = 'planifi-navbar-profile';

function SearchIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
			<path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function CalendarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="4.2" y="5.7" width="15.6" height="14.1" rx="2.6" stroke="currentColor" strokeWidth="1.8" />
			<path d="M8 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M16 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4.2 9.2H19.8" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	);
}

function UserAvatar({ profile }) {
	const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Bob Alves';
	const initials =
		`${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() ||
		displayName.trim().charAt(0).toUpperCase();
	const imageSrc = profile?.profile_picture_preview || profile?.profile_picture;
	const [open, setOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		navigateTo('/connexion/');
	}

	const profileHref = profile?.est_pro ? '/app/profil/professionnel' : '/app/profil';

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex items-center gap-2 rounded-full transition hover:opacity-90 md:gap-3"
			>
				{imageSrc ? (
					<div className="h-12 w-12 overflow-hidden rounded-full md:h-14 md:w-14">
						<img src={imageSrc} alt="Profil" className="h-full w-full object-cover" />
					</div>
				) : (
					<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] text-[1rem] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)] md:h-14 md:w-14 md:text-[1.2rem]">
						{initials}
					</div>
				)}
				<p className="hidden min-w-0 truncate text-[0.98rem] font-medium text-[#202020] lg:block">{displayName}</p>
			</button>

			{open ? (
				<div className="absolute right-0 top-[calc(100%+10px)] z-50 w-48 overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5 shadow-[0_20px_44px_rgba(17,19,30,0.14)]">
					<button
						type="button"
						onClick={() => {
							setOpen(false);
							navigateTo(profileHref);
						}}
						className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-[var(--accent-mauve)] transition hover:bg-black/5"
					>
						Voir mon profil
					</button>
					<button
						type="button"
						onClick={handleLogout}
						className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#d23b3b] transition hover:bg-[#d23b3b]/8"
					>
						Se déconnecter
					</button>
				</div>
			) : null}
		</div>
	);
}

export default function ConnectedNavbar() {
	const [profile, setProfile] = useState(() => {
		if (typeof window === 'undefined') {
			return null;
		}

		try {
			const cachedProfile = window.sessionStorage.getItem(NAVBAR_PROFILE_STORAGE_KEY);
			return cachedProfile ? JSON.parse(cachedProfile) : null;
		} catch {
			return null;
		}
	});
	const {
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
		setActiveSuggestionField,
		searchRef,
		handleSearch,
		handleSelectService,
		handleSelectVille,
		handleDiscoverProviders,
		showDiscoverProviders,
	} = useNavigationSearch();

	useEffect(() => {
		let cancelled = false;

		async function loadProfile() {
			try {
				const response = await fetch('/profil', { credentials: 'same-origin' });
				if (!response.ok) {
					return;
				}

				const payload = await response.json();
				if (!cancelled && payload?.message) {
					setProfile(payload.message);
					try {
						window.sessionStorage.setItem(NAVBAR_PROFILE_STORAGE_KEY, JSON.stringify(payload.message));
					} catch {
						// Ignore storage issues and keep in-memory profile only.
					}
				}
			} catch {
				// Keep fallback values if profile is unavailable.
			}
		}

		loadProfile();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<header className="sticky top-0 z-50 border-b border-black/6 bg-white/78 backdrop-blur-md">
			<div className="mx-auto grid w-full max-w-[1480px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-4 px-4 py-4 sm:px-6 md:grid-cols-[auto_1fr_auto] md:gap-6 md:py-5 xl:px-8">
				<button
					type="button"
					onClick={() => navigateTo('/')}
					aria-label="Retour a l'accueil Prestat"
					className="shrink-0 justify-self-start"
				>
					<img src={prestatLogo} alt="Prestat" className="w-[136px] sm:w-[156px]" />
				</button>

				{/* Formulaire de recherche : onSubmit déclenche handleSearch */}
				<form
					onSubmit={handleSearch}
					ref={searchRef}
					className="relative col-span-2 order-3 flex w-full items-center rounded-[18px] border border-black/8 bg-white shadow-[0_12px_28px_rgba(17,19,30,0.04)] md:col-auto md:order-none md:mx-auto md:max-w-[372px] md:justify-self-center"
				>
					<div className="relative min-w-0 flex-1">
						<input
							type="text"
							placeholder="prestation"
							value={query}
							onFocus={() => {
								setActiveSuggestionField('service');
								setShowServiceSuggestions(true);
								setShowVilleSuggestions(false);
							}}
							onChange={(e) => {
								setQuery(e.target.value);
								setActiveSuggestionField('service');
								setShowServiceSuggestions(true);
								setShowVilleSuggestions(false);
							}}
							className="min-w-0 w-full rounded-l-[18px] border-0 bg-transparent px-5 py-4 text-[1rem] text-[#1f1f1f] outline-none placeholder:text-black/30"
						/>
						{showDiscoverProviders ? (
							<div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[calc(100%+26px)] overflow-hidden rounded-[18px] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(17,19,30,0.12)]">
								<button
									type="button"
									onMouseDown={(event) => event.preventDefault()}
									onClick={handleDiscoverProviders}
									className="block w-full rounded-[12px] px-3 py-3 text-left text-[0.96rem] text-[var(--accent-mauve)] transition hover:bg-black/5"
								>
									Pas d&apos;idée ? Découvrez nos prestataires
								</button>
							</div>
						) : showServiceSuggestions && serviceSuggestions.length > 0 ? (
							<div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[calc(100%+26px)] overflow-hidden rounded-[18px] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(17,19,30,0.12)]">
								{serviceSuggestions.map((suggestion) => (
									<button
										key={suggestion}
										type="button"
										onMouseDown={(event) => event.preventDefault()}
										onClick={() => handleSelectService(suggestion)}
										className="block w-full rounded-[12px] px-3 py-2.5 text-left text-[0.96rem] text-[#1f1f1f] transition hover:bg-black/5"
									>
										{suggestion}
									</button>
								))}
							</div>
						) : null}
					</div>
					<div className="h-10 w-px bg-black/10" />
					<div className="relative min-w-0 flex-1">
						<input
							type="text"
							placeholder="ville"
							value={ville}
							onFocus={() => {
								setActiveSuggestionField('ville');
								setShowVilleSuggestions(true);
								setShowServiceSuggestions(false);
							}}
							onChange={(e) => {
								setVille(e.target.value);
								setActiveSuggestionField('ville');
								setShowVilleSuggestions(true);
								setShowServiceSuggestions(false);
							}}
							className="min-w-0 w-full border-0 bg-transparent px-5 py-4 text-[1rem] text-[#1f1f1f] outline-none placeholder:text-black/30"
						/>
						{showVilleSuggestions && villeSuggestions.length > 0 ? (
							<div className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-[296px] w-[calc(100%+64px)] overflow-y-auto rounded-[18px] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(17,19,30,0.12)]">
								{villeSuggestions.map((suggestion) => (
									<button
										key={suggestion.value}
										type="button"
										onMouseDown={(event) => event.preventDefault()}
										onClick={() => handleSelectVille(suggestion)}
										className="block w-full rounded-[12px] px-3 py-2.5 text-left text-[0.96rem] text-[#1f1f1f] transition hover:bg-black/5"
									>
										{suggestion.label}
									</button>
								))}
							</div>
						) : null}
					</div>
					{/* type="submit" → déclenche le onSubmit du formulaire parent */}
					<button type="submit" className="mr-2 flex h-12 w-12 items-center justify-center rounded-[14px] text-[#151515]">
						<SearchIcon className="h-6 w-6" />
					</button>
				</form>

				<div className="flex items-center justify-end gap-3 justify-self-end md:gap-5">
					<button
						type="button"
						onClick={() => navigateTo('/app/profil?tab=calendar')}
						aria-label="Ouvrir mon calendrier"
						className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-black/6 bg-white/88 text-[var(--accent-mauve)] shadow-[0_10px_24px_rgba(24,24,35,0.035)] transition hover:-translate-y-px md:h-10 md:w-10"
					>
						<CalendarIcon className="h-[1.15rem] w-[1.15rem]" />
					</button>
					<UserAvatar profile={profile} />
				</div>
			</div>
		</header>
	);
}
