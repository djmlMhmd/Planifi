import { useEffect, useRef, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import { useSession } from '../../hooks/useSession';
import { navigateTo } from '../../lib/navigation';

function ThinArrow() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function UserMenu() {
	const { loading, isAuthenticated, profile } = useSession();
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

	if (loading) {
		return <div className="h-12 w-12 rounded-full bg-white/10" />;
	}

	if (!isAuthenticated || !profile) {
		return null;
	}

	const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'P';
	const profileHref = profile.est_pro ? '/app/profil/professionnel' : '/app/profil';

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
			>
				{profile.profile_picture ? (
					<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
				) : (
					<span>{initials}</span>
				)}
			</button>

			{open ? (
				<div className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/95 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
					<div className="border-b border-white/10 px-3 py-3">
						<p className="text-sm font-medium text-white">{profile.firstName} {profile.lastName}</p>
						<p className="mt-1 text-xs text-white/55">{profile.email}</p>
					</div>
					<div className="pt-2">
						<a
							href={profileHref}
							className="block rounded-xl px-3 py-2.5 text-sm text-[#d4c3f1] transition hover:bg-white/8 hover:text-white"
						>
							Voir mon profil
						</a>
						<button
							type="button"
							onClick={handleLogout}
							className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/85 transition hover:bg-white/8 hover:text-white"
						>
							Se déconnecter
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default function AppHeader({ ctaHref, ctaLabel, navHref = '/app/proposer-service', homeHref = '/' }) {
	const { loading, isAuthenticated, profile } = useSession();

	const isClient = isAuthenticated && profile && !profile.est_pro;
	const navLinkLabel = isClient ? 'Voir les services' : 'Proposer un service';
	const navLinkHref = isClient ? '/navigation' : navHref;

	return (
		<header className="pointer-events-none fixed inset-x-0 top-0 z-30 py-6 max-[640px]:py-[18px]">
			<div className="pointer-events-auto mx-auto flex w-[min(1140px,calc(100%-28px))] items-center justify-between sm:w-content">
				<a href={homeHref} aria-label="Prestat accueil">
					<img
						className="h-auto w-40 brightness-0 invert max-[640px]:w-[120px]"
						src={prestatLogo}
						alt="Prestat"
					/>
				</a>
				<nav className="flex items-center gap-4 sm:gap-6 lg:gap-8">
					<a
						className="hidden text-[0.95rem] font-normal tracking-[0.01em] text-[#d4c3f1] transition hover:text-white md:inline"
						href={navLinkHref}
					>
						{navLinkLabel}
					</a>
					{!loading && isAuthenticated ? (
						<UserMenu />
					) : (
						<a
							className="inline-flex items-center gap-2.5 rounded-full bg-white px-[22px] py-3 text-[0.95rem] font-medium text-[var(--accent-mauve)] transition hover:-translate-y-px hover:opacity-90 max-[640px]:px-[18px] max-[640px]:py-[10px] max-[640px]:text-[0.9rem]"
							href={ctaHref}
						>
							{ctaLabel}
							<ThinArrow />
						</a>
					)}
				</nav>
			</div>
		</header>
	);
}
