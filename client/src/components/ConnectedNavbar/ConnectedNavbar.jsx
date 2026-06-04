import { useEffect, useRef, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import { navigateTo } from '../../lib/navigation';

function SearchIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
			<path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function BellIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M12 4.8A4.2 4.2 0 0 0 7.8 9V11.1C7.8 12.1 7.45 13.08 6.8 13.84L5.6 15.25C5.22 15.7 5.54 16.4 6.13 16.4H17.87C18.46 16.4 18.78 15.7 18.4 15.25L17.2 13.84A4.2 4.2 0 0 1 16.2 11.1V9A4.2 4.2 0 0 0 12 4.8Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<path d="M10.2 18C10.55 18.64 11.21 19 12 19C12.79 19 13.45 18.64 13.8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
		window.location.href = '/connexion/';
	}

	const profileHref = profile?.est_pro ? '/app/profil/professionnel' : '/app/profil';

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex items-center gap-3 rounded-full transition hover:opacity-90"
			>
				{profile?.profile_picture ? (
					<div className="h-14 w-14 overflow-hidden rounded-full">
						<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
					</div>
				) : (
					<div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] text-[1.2rem] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)]">
						{initials}
					</div>
				)}
				<p className="min-w-0 truncate text-[0.98rem] font-medium text-[#202020]">{displayName}</p>
			</button>

			{open ? (
				<div className="absolute right-0 top-[calc(100%+10px)] z-50 w-48 overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5 shadow-[0_20px_44px_rgba(17,19,30,0.14)]">
					<button
						type="button"
						onClick={() => {
							setOpen(false);
							navigateTo(profileHref);
						}}
						className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#1b1b1d] transition hover:bg-black/5"
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
	const [profile, setProfile] = useState(null);

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
			<div className="mx-auto grid min-h-[104px] w-full max-w-[1480px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-5 xl:px-8">
				<button
					type="button"
					onClick={() => navigateTo('/')}
					aria-label="Retour a l'accueil Prestat"
					className="shrink-0 justify-self-start"
				>
					<img src={prestatLogo} alt="Prestat" className="w-[156px]" />
				</button>

				<div className="mx-auto flex w-full max-w-[372px] items-center rounded-[18px] border border-black/8 bg-white shadow-[0_12px_28px_rgba(17,19,30,0.04)] justify-self-center">
					<input
						type="text"
						placeholder="prestation"
						className="min-w-0 flex-1 rounded-l-[18px] border-0 bg-transparent px-5 py-4 text-[1rem] text-[#1f1f1f] outline-none placeholder:text-black/30"
					/>
					<div className="h-10 w-px bg-black/10" />
					<input
						type="text"
						placeholder="ville"
						className="min-w-0 flex-1 border-0 bg-transparent px-5 py-4 text-[1rem] text-[#1f1f1f] outline-none placeholder:text-black/30"
					/>
					<button type="button" className="mr-2 flex h-12 w-12 items-center justify-center rounded-[14px] text-[#151515]">
						<SearchIcon className="h-6 w-6" />
					</button>
				</div>

				<div className="hidden items-center gap-6 justify-self-end lg:flex">
					<div className="relative text-[#171717]">
						<BellIcon className="h-6 w-6" />
						<span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#e83a3a] text-[0.55rem] font-semibold text-white">1</span>
					</div>
					<CalendarIcon className="h-6 w-6 text-[#171717]" />
					<UserAvatar profile={profile} />
				</div>
			</div>
		</header>
	);
}
