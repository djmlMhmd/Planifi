import { useEffect, useMemo, useState } from 'react';
import favoritesPlaceholder from '../../assets/favorites-placeholder.jpg';
import pdfFileIcon from '../../assets/pdf-file-icon.png';
import providerUserPlaceholder from '../../assets/provider-user-placeholder.png';
import prestatLogo from '../../assets/prestat-logo.svg';
import Reveal from '../Reveal/Reveal';

async function readJsonSafely(response) {
	if (response.status === 204) {
		return null;
	}

	const rawBody = await response.text();
	if (!rawBody) {
		return null;
	}

	return JSON.parse(rawBody);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
	const controller = new AbortController();
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

function DashboardIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="3" y="3" width="8" height="8" rx="2.2" fill="currentColor" />
			<rect x="13" y="3" width="8" height="8" rx="2.2" fill="currentColor" opacity="0.72" />
			<rect x="3" y="13" width="8" height="8" rx="2.2" fill="currentColor" opacity="0.72" />
			<rect x="13" y="13" width="8" height="8" rx="2.2" fill="currentColor" />
		</svg>
	);
}

function CompassIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
			<path d="M14.9 9.1L13.2 14.2L8.1 15.9L9.8 10.8L14.9 9.1Z" fill="currentColor" />
		</svg>
	);
}

function BookmarkIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" fill="currentColor" />
		</svg>
	);
}

function SettingsIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M19 12A7 7 0 1 1 5 12A7 7 0 0 1 19 12ZM12 8.8A3.2 3.2 0 1 0 12 15.2A3.2 3.2 0 0 0 12 8.8Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function LogoutIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M11 4H6V20H11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 16L18 12L14 8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M18 12H10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function HelpIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<path d="M9.8 9.3A2.6 2.6 0 0 1 12.2 8C13.8 8 15 9 15 10.5C15 12.7 12.4 12.8 12.4 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<circle cx="12.05" cy="17.2" r="1.1" fill="currentColor" />
		</svg>
	);
}

function SearchIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
			<path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function MessageIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 6.5H19V15.5H10L6 19V15.5H5V6.5Z" fill="currentColor" />
		</svg>
	);
}

function HistoryIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 12A8 8 0 1 0 7 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 4V9H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function CaretDownIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
			<path d="M5 7.5L10 13L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function DotsIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="5" cy="12" r="1.9" fill="currentColor" />
			<circle cx="12" cy="12" r="1.9" fill="currentColor" />
			<circle cx="19" cy="12" r="1.9" fill="currentColor" />
		</svg>
	);
}

function ArrowRightCircle({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="10" fill="currentColor" />
			<path d="M10 8L14 12L10 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function StarRow() {
	return (
		<div className="flex gap-1 text-[#1f1f1f]">
			{Array.from({ length: 5 }).map((_, index) => (
				<svg key={index} viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
					<path
						d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinejoin="round"
					/>
				</svg>
			))}
		</div>
	);
}

function getProfileInitial(profile) {
	const firstCandidate =
		profile?.firstName?.trim() ||
		profile?.lastName?.trim() ||
		profile?.email?.trim() ||
		'?';

	return firstCandidate.charAt(0).toUpperCase();
}

function UserAvatar({ profile, size = 'h-12 w-12', textSize = 'text-lg' }) {
	if (profile?.profile_picture) {
		return (
			<div className={`overflow-hidden rounded-full ${size}`}>
				<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
			</div>
		);
	}

	return (
		<div
			className={`flex items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)] ${size} ${textSize}`}
			aria-label="Initiale du profil"
		>
			{getProfileInitial(profile)}
		</div>
	);
}

function ProviderAvatar({ size = 'h-20 w-20' }) {
	return (
		<div className={`overflow-hidden rounded-full bg-[#0f0f12] ring-1 ring-[#ece7f4] ${size}`}>
			<img src={providerUserPlaceholder} alt="" className="h-full w-full object-cover" />
		</div>
	);
}

function ClientReviewCard({ title }) {
	return (
		<div className="rounded-[22px] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbf8_100%)] p-5 shadow-[0_14px_34px_rgba(17,19,30,0.045)]">
			<div className="flex items-center gap-5">
				<ProviderAvatar />
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-[1.05rem] font-semibold text-[#171717]">{title}</h3>
					<div className="mt-2">
						<StarRow />
					</div>
					<button
						type="button"
						className="mt-4 text-sm font-medium text-[#5a5a5a] transition hover:text-[#0a0a0a]"
					>
						&gt; Laisser un avis
					</button>
				</div>
			</div>
		</div>
	);
}

function ReservationItem({ reservation }) {
	const [dateLabel, timeLabel] = reservation.start.split(' ');
	return (
		<div className="flex items-center gap-4 border-b border-black/6 py-3 last:border-b-0">
			<ProviderAvatar size="h-11 w-11" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[1rem] font-semibold text-[#171717]">{reservation.service_name}</p>
				<p className="truncate text-[0.9rem] text-black/50">{reservation.title}</p>
				<p className="mt-1 text-[0.78rem] text-black/35">
					<span className="font-semibold text-black/65">{dateLabel}</span> {timeLabel}
				</p>
			</div>
			<ArrowRightCircle className="h-6 w-6 shrink-0 text-[#0f0f12]" />
		</div>
	);
}

function InvoiceItem({ label }) {
	return (
		<div className="flex items-center gap-3 py-3 text-black/62">
			<img src={pdfFileIcon} alt="PDF" className="h-5 w-5 shrink-0 object-contain" />
			<p className="min-w-0 flex-1 truncate text-[0.88rem]">{label}</p>
			<button type="button" className="text-black/45 transition hover:text-[#0a0a0a]">
				<svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
					<path d="M10 3V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
					<path d="M6.5 8.5L10 12L13.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M4 16H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}

function SidebarLink({ href, active = false, icon: Icon, children }) {
	return (
		<a
			className={`flex items-center gap-3 text-[0.98rem] font-medium transition ${
				active ? 'text-[#c9a25f]' : 'text-white/62 hover:text-white'
			}`}
			href={href}
		>
			<Icon className="h-5 w-5" />
			<span>{children}</span>
		</a>
	);
}

function SettingsToggle({ enabled = false }) {
	return (
		<span
			className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${
				enabled ? 'bg-[#101010]' : 'bg-black/12'
			}`}
		>
			<span
				className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition ${
					enabled ? 'left-6' : 'left-1'
				}`}
			/>
		</span>
	);
}

function SettingsPanel({ profile }) {
	return (
		<div className="space-y-8">
			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<div className="flex items-start justify-between gap-8">
					<div className="min-w-0 flex-1">
						<h2 className="text-[1.35rem] font-semibold text-[#151515]">Informations du compte</h2>
						<div className="mt-8 flex flex-wrap gap-8 text-[0.98rem] text-[#1a1a1a]">
							<label className="flex items-center gap-3">
								<input type="radio" name="title" defaultChecked className="accent-[#101010]" />
								<span>Madame</span>
							</label>
							<label className="flex items-center gap-3">
								<input type="radio" name="title" className="accent-[#101010]" />
								<span>Monsieur</span>
							</label>
							<label className="flex items-center gap-3">
								<input type="radio" name="title" className="accent-[#101010]" />
								<span>Non spécifiée</span>
							</label>
						</div>
					</div>

					<div className="relative shrink-0">
						<UserAvatar profile={profile} size="h-28 w-28" textSize="text-4xl" />
						<button
							type="button"
							className="absolute bottom-1 left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#101010] text-xl font-semibold text-white shadow-[0_10px_24px_rgba(10,10,10,0.22)]"
						>
							+
						</button>
					</div>
				</div>

				<div className="mt-10 grid gap-6 md:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Nom *</span>
						<input
							type="text"
							defaultValue={profile.lastName || ''}
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Prénom *</span>
						<input
							type="text"
							defaultValue={profile.firstName || ''}
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
					<label className="flex flex-col gap-2 md:max-w-[340px]">
						<span className="text-[0.95rem] font-medium text-[#151515]">Date de naissance *</span>
						<input
							type="text"
							placeholder="JJ/MM/AAAA"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
				</div>

				<button
					type="button"
					className="mt-7 rounded-[14px] bg-[#101010] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
				>
					Enregistrer
				</button>
			</section>

			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Adresse</h2>
				<div className="mt-6 max-w-[640px]">
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Adresse *</span>
						<input
							type="text"
							defaultValue={profile.address || ''}
							placeholder="Nom de la rue et ville/code postal"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
				</div>

				<button
					type="button"
					className="mt-7 rounded-[14px] bg-[#101010] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
				>
					Enregistrer
				</button>
			</section>

			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">E-mail</h2>
				<div className="mt-6 flex max-w-[720px] items-center gap-3 rounded-[16px] border border-black/6 bg-[#f2f1ed] p-3">
					<div className="min-w-0 flex-1 px-2 text-[1rem] text-[#151515]">{profile.email}</div>
					<button
						type="button"
						className="rounded-[14px] bg-[#101010] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_rgba(10,10,10,0.16)]"
					>
						Modifier
					</button>
				</div>
			</section>

			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Préférences</h2>

				<div className="mt-6 space-y-5">
					<div className="rounded-[20px] bg-[#f2f1ed] p-5">
						<h3 className="text-[1.1rem] font-semibold text-[#151515]">Messagerie</h3>
						<div className="mt-5 space-y-4">
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Recevoir des messages privés</p>
								<SettingsToggle enabled />
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Recevoir les nouveaux messages par mails</p>
								<SettingsToggle />
							</div>
						</div>
					</div>

					<div className="rounded-[20px] bg-[#f2f1ed] p-5">
						<h3 className="text-[1.1rem] font-semibold text-[#151515]">Informations</h3>
						<div className="mt-5 space-y-4">
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon adresse sur mon profil</p>
								<SettingsToggle />
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon numéro de téléphone sur mon profil</p>
								<SettingsToggle enabled />
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<button
						type="button"
						className="rounded-[14px] bg-[#101010] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
					>
						Enregistrer les modifications
					</button>
				</div>
			</section>
		</div>
	);
}

function FavoriteCard({ item }) {
	return (
		<div className="rounded-[22px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-4 shadow-[0_14px_34px_rgba(17,19,30,0.045)]">
			<div className="flex flex-col gap-4">
				<div className="relative h-[180px] w-full overflow-hidden rounded-[16px]">
					<img src={favoritesPlaceholder} alt={item.title} className="h-full w-full object-cover" />
					<button
						type="button"
						className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/95 text-[#111111] shadow-[0_8px_22px_rgba(10,10,10,0.15)]"
					>
						<BookmarkIcon className="h-5 w-5" />
					</button>
				</div>

				<div className="flex min-w-0 flex-1 flex-col">
					<h3 className="truncate text-[1rem] font-semibold text-[#151515]">{item.title}</h3>
					<p className="mt-2 text-[0.96rem] text-[#242424]">{item.category}</p>
					<p className="mt-8 text-[0.92rem] text-black/28">{item.location}</p>
				</div>
			</div>
		</div>
	);
}

function FavoritesPanel() {
	const favoriteItems = [
		{ id: 'fav-1', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
		{ id: 'fav-2', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
		{ id: 'fav-3', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
		{ id: 'fav-4', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
		{ id: 'fav-5', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
		{ id: 'fav-6', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
	];

	return (
		<div>
			<h2 className="mb-10 text-[2rem] font-semibold tracking-[-0.03em] text-[#151515]">
				Retrouvez vos prestataires favoris sauvegardés ici
			</h2>

			<div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-3">
				{favoriteItems.map((item, index) => (
					<Reveal key={item.id} from="bottom" delay={index * 60}>
						<FavoriteCard item={item} />
					</Reveal>
				))}
			</div>
		</div>
	);
}

function DashboardShell({ profile, reservations }) {
	const reviewCards = useMemo(
		() => ['Prestige Services', 'Élite Solutions', 'Pro Connect', 'Services Faciles'],
		[]
	);

	const invoiceItems = useMemo(
		() => [
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestation].pdf`,
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Prestataire].pdf`,
			`FACTURES - [${profile.city || 'Paris'}] : [${profile.firstName} ${profile.lastName}] [Accompagnement].pdf`,
		],
		[profile.city, profile.firstName, profile.lastName]
	);

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		window.location.href = '/connexion/';
	}

	const activeTabParam = new URLSearchParams(window.location.search).get('tab');
	const activeTab =
		activeTabParam === 'settings' || activeTabParam === 'favorites'
			? activeTabParam
			: 'dashboard';

	const reservationList = reservations.length
		? reservations.slice(0, 7)
		: [
				{ reservation_id: 'demo-1', service_name: 'Massage bien-être', title: 'RelaxChezVous', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-2', service_name: 'Cours de yoga', title: 'Zen à la Maison', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-3', service_name: 'Soin du visage', title: 'Beauté Nomade', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-4', service_name: 'Soutien scolaire', title: 'Prof à Votre Porte', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-5', service_name: 'Réparation info', title: 'TechFix Mobile', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-6', service_name: 'Pet-sitting', title: 'Toutou Services', start: 'Vendredi 20 14:00 - 15:30' },
				{ reservation_id: 'demo-7', service_name: 'Coaching perso', title: 'Fit&Go Domicile', start: 'Vendredi 20 14:00 - 15:30' },
		  ];

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#1f1f1f]">
			<div className="grid min-h-screen grid-cols-[210px_1fr]">
				<aside className="flex flex-col border-r border-white/10 bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] text-white">
					<div className="flex h-[92px] items-center justify-center border-b border-white/10 px-7">
						<img
							src={prestatLogo}
							alt="Planifi"
							className="w-[126px]"
							style={{ filter: 'brightness(0) invert(1)' }}
						/>
					</div>

					<nav className="flex flex-1 flex-col px-9 pb-9 pt-11">
						<div className="space-y-8">
							<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon}>
								Dashboard
							</SidebarLink>
							<SidebarLink href="#" icon={CompassIcon}>
								Découvrir
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon}>
								Favoris
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon}>
								Paramètres
							</SidebarLink>
						</div>

						<div className="mt-auto space-y-9">
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white"
							>
								<LogoutIcon className="h-5 w-5" />
								<span>Déconnexion</span>
							</button>

							<a className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white" href="#">
								<HelpIcon className="h-5 w-5" />
								<span>Aide & Contact</span>
							</a>
						</div>
					</nav>
				</aside>

				<div className="min-w-0">
					<header className="flex h-[92px] items-center justify-between border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-10 backdrop-blur-sm">
						<h1 className="text-[1.2rem] font-semibold text-[#151515]">
							{activeTab === 'settings'
								? 'Paramètres'
								: activeTab === 'favorites'
									? 'Favoris'
									: 'Dashboard'}
						</h1>

						<div className="flex items-center gap-6">
							<div className="flex h-11 w-[310px] items-center gap-3 rounded-[14px] border border-black/6 bg-white/85 px-4 shadow-[0_10px_24px_rgba(24,24,35,0.035)]">
								<SearchIcon className="h-5 w-5 text-black/35" />
								<input
									type="text"
									placeholder="Prestation, entreprise..."
									className="w-full border-0 bg-transparent text-[0.95rem] text-[#1e1e1e] outline-none placeholder:text-black/35"
								/>
							</div>

							<div className="flex items-center gap-4 text-[#1b1a20]">
								<div className="relative">
									<MessageIcon className="h-6 w-6" />
									<span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff3d3d]" />
								</div>
								<HistoryIcon className="h-6 w-6" />
								<CaretDownIcon className="h-5 w-5 text-black/35" />
							</div>

							<div className="flex items-center gap-3">
								<div className="text-right">
									<p className="text-[1rem] font-medium text-[#1f1f28]">
										{profile.firstName} {profile.lastName}
									</p>
									<p className="mt-1 text-[0.72rem] text-black/38">
										{profile.est_verifie ? 'Utilisateur vérifié' : 'En attente'}
									</p>
								</div>
								<UserAvatar profile={profile} />
							</div>
						</div>
					</header>

					<div className="grid gap-8 px-9 pb-10 pt-11 lg:grid-cols-[1fr_305px]">
						<div className="min-w-0">
							{activeTab === 'settings' ? (
								<SettingsPanel profile={profile} />
							) : activeTab === 'favorites' ? (
								<FavoritesPanel />
							) : (
								<>
							<div className="mb-8 flex items-center gap-4">
								<button
									type="button"
									className="rounded-xl bg-[#101010] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]"
								>
									Laissez un avis
								</button>
								<button
									type="button"
									className="rounded-xl border border-black/6 bg-white/92 px-5 py-3 text-[0.95rem] font-medium text-black/42 shadow-[0_10px_24px_rgba(24,24,35,0.035)]"
								>
									Actualités
								</button>
								<span className="-ml-5 -mt-5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2d2d] text-[0.6rem] font-semibold text-white">
									1
								</span>
								{Array.from({ length: 3 }).map((_, index) => (
									<div
										key={index}
										className="flex h-12 w-[92px] items-center justify-center rounded-xl border border-black/5 bg-white/88 text-black/35 shadow-[0_10px_24px_rgba(24,24,35,0.03)]"
									>
										?
									</div>
								))}
							</div>

							<Reveal from="bottom">
								<div className="grid gap-5 md:grid-cols-2">
									{reviewCards.map((card, index) => (
										<Reveal key={card} from="bottom" delay={index * 70}>
											<ClientReviewCard title={card} />
										</Reveal>
									))}
								</div>
							</Reveal>

							<Reveal from="bottom" delay={120}>
								<section className="mt-7 rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
									<div className="mb-6 flex items-center justify-between">
										<h2 className="text-[1.35rem] font-semibold text-[#151515]">Facturation &amp; Devis</h2>
										<DotsIcon className="h-5 w-5 text-[#1f1f28]" />
									</div>

									<div className="mb-5 flex items-center gap-6 text-[0.93rem] font-semibold uppercase tracking-[0.04em]">
										<span className="rounded-full bg-[#101010] px-3 py-2 text-white">Factures</span>
										<span className="text-black/48">Devis</span>
									</div>

									<div className="mb-4 flex h-11 items-center gap-3 rounded-[14px] border border-black/6 bg-white/80 px-4">
										<SearchIcon className="h-4 w-4 text-black/35" />
										<input
											type="text"
											placeholder="Recherche une facture"
											className="w-full border-0 bg-transparent text-[0.9rem] text-[#1e1e1e] outline-none placeholder:text-black/34"
										/>
									</div>

									<div>
										{invoiceItems.map((item) => (
											<InvoiceItem key={item} label={item} />
										))}
									</div>
								</section>
							</Reveal>
								</>
							)}
						</div>

						{activeTab === 'dashboard' ? (
							<Reveal from="bottom" delay={90}>
								<aside className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,246,241,0.96)_100%)] px-6 py-5 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
									<div className="mb-6 flex items-center justify-between">
										<p className="text-[0.94rem] font-medium text-black/58">Mes rendez-vous</p>
										<DotsIcon className="h-5 w-5 text-black/35" />
									</div>

									<div>
										{reservationList.map((reservation) => (
											<ReservationItem key={reservation.reservation_id} reservation={reservation} />
										))}
									</div>

									<button type="button" className="mt-3 w-full text-center text-[0.96rem] font-semibold text-[#111111]">
										Tous voir
									</button>
								</aside>
							</Reveal>
						) : null}
					</div>
				</div>
			</div>
		</main>
	);
}

function ProfessionalProfile({ profile }) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-brand-black pt-32 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#0a0a0a_0%,#101010_100%)]" />
			<section className="relative z-[1] mx-auto flex w-content flex-col gap-8 pb-16">
				<Reveal from="bottom">
					<div className="max-w-[760px]">
						<p className="mb-3 text-sm uppercase tracking-[0.18em] text-white/50">Espace prestataire</p>
						<h1 className="text-[clamp(2.4rem,5vw,4rem)] font-semibold tracking-[-0.04em]">
							Profil professionnel
						</h1>
					</div>
				</Reveal>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
						<h2 className="mb-4 text-[1.35rem] font-semibold text-white">Informations</h2>
						<div className="grid grid-cols-[160px_1fr] gap-4 border-b border-white/10 py-3">
							<div className="text-sm text-white/55">Entreprise</div>
							<div className="text-white/92">{profile.company_name || '-'}</div>
						</div>
						<div className="grid grid-cols-[160px_1fr] gap-4 border-b border-white/10 py-3">
							<div className="text-sm text-white/55">Nom</div>
							<div className="text-white/92">{profile.firstName} {profile.lastName}</div>
						</div>
						<div className="grid grid-cols-[160px_1fr] gap-4 border-b border-white/10 py-3">
							<div className="text-sm text-white/55">Email</div>
							<div className="text-white/92">{profile.email}</div>
						</div>
						<div className="grid grid-cols-[160px_1fr] gap-4 py-3">
							<div className="text-sm text-white/55">Adresse pro</div>
							<div className="text-white/92">{profile.company_address || '-'}</div>
						</div>
					</div>

					<div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
						<h2 className="mb-4 text-[1.35rem] font-semibold text-white">Compte</h2>
						<p className="text-sm leading-7 text-white/65">
							La version détaillée du dashboard prestataire peut venir ensuite. Pour
							l’instant, on garde ici un espace propre et cohérent avec le nouveau
							parcours connecté.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function ProfilePage({ variant = 'client' }) {
	const [state, setState] = useState({
		loading: true,
		error: '',
		profile: null,
		reservations: [],
	});

	useEffect(() => {
		let cancelled = false;

		async function loadProfile() {
			setState({ loading: true, error: '', profile: null, reservations: [] });
			const endpoint = variant === 'professional' ? '/profil/professionnel/' : '/profil';

			try {
				const [profileResponse, reservationsResponse] = await Promise.all([
					fetchWithTimeout(endpoint, { credentials: 'same-origin' }),
					variant === 'client'
						? fetchWithTimeout('/reservation/client', { credentials: 'same-origin' })
						: Promise.resolve(null),
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

				if (variant === 'client' && reservationsResponse && reservationsResponse.ok) {
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
		return <ProfessionalProfile profile={state.profile} />;
	}

	return <DashboardShell profile={state.profile} reservations={state.reservations} />;
}
