import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import favoritesPlaceholder from '../../assets/favorites-placeholder.jpg';
import pdfFileIcon from '../../assets/pdf-file-icon.png';
import providerUserPlaceholder from '../../assets/provider-user-placeholder.png';
import Reveal from '../Reveal/Reveal';

export async function readJsonSafely(response) {
	// Certaines routes renvoient 204, donc je protège la lecture JSON ici.
	if (response.status === 204) {
		return null;
	}

	const rawBody = await response.text();
	if (!rawBody) {
		return null;
	}

	return JSON.parse(rawBody);
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
	// Je coupe les appels trop longs pour éviter une UI bloquée si le back ne répond pas.
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

export function useBodyScrollLock(locked) {
	useEffect(() => {
		if (!locked) {
			return undefined;
		}

		const { body, documentElement } = document;
		const previousBodyOverflow = body.style.overflow;
		const previousHtmlOverflow = documentElement.style.overflow;
		const previousBodyPaddingRight = body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

		body.style.overflow = 'hidden';
		documentElement.style.overflow = 'hidden';

		if (scrollbarWidth > 0) {
			body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			body.style.overflow = previousBodyOverflow;
			documentElement.style.overflow = previousHtmlOverflow;
			body.style.paddingRight = previousBodyPaddingRight;
		};
	}, [locked]);
}

export function ModalPortal({ open = true, children }) {
	useBodyScrollLock(open);

	if (!open || typeof document === 'undefined') {
		return null;
	}

	return createPortal(children, document.body);
}

export function DashboardIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="3" y="3" width="8" height="8" rx="2.2" fill="currentColor" />
			<rect x="13" y="3" width="8" height="8" rx="2.2" fill="currentColor" opacity="0.72" />
			<rect x="3" y="13" width="8" height="8" rx="2.2" fill="currentColor" opacity="0.72" />
			<rect x="13" y="13" width="8" height="8" rx="2.2" fill="currentColor" />
		</svg>
	);
}

export function CompassIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
			<path d="M14.9 9.1L13.2 14.2L8.1 15.9L9.8 10.8L14.9 9.1Z" fill="currentColor" />
		</svg>
	);
}

export function BookmarkIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" fill="currentColor" />
		</svg>
	);
}

export function BookmarkOutlineIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
		</svg>
	);
}

export function SettingsIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M19 12A7 7 0 1 1 5 12A7 7 0 0 1 19 12ZM12 8.8A3.2 3.2 0 1 0 12 15.2A3.2 3.2 0 0 0 12 8.8Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function UserIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
			<path d="M5.5 18.8C6.7 15.8 9.1 14.2 12 14.2C14.9 14.2 17.3 15.8 18.5 18.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function LogoutIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M11 4H6V20H11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 16L18 12L14 8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M18 12H10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function HelpIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<path d="M9.8 9.3A2.6 2.6 0 0 1 12.2 8C13.8 8 15 9 15 10.5C15 12.7 12.4 12.8 12.4 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<circle cx="12.05" cy="17.2" r="1.1" fill="currentColor" />
		</svg>
	);
}

export function SearchIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
			<path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function MessageIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 6.5H19V15.5H10L6 19V15.5H5V6.5Z" fill="currentColor" />
		</svg>
	);
}

export function HistoryIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 12A8 8 0 1 0 7 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 4V9H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function CalendarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="4.2" y="5.7" width="15.6" height="14.1" rx="2.6" stroke="currentColor" strokeWidth="1.8" />
			<path d="M8 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M16 3.8V7.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4.2 9.2H19.8" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	);
}

export function CaretDownIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
			<path d="M5 7.5L10 13L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function DotsIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="5" cy="12" r="1.9" fill="currentColor" />
			<circle cx="12" cy="12" r="1.9" fill="currentColor" />
			<circle cx="19" cy="12" r="1.9" fill="currentColor" />
		</svg>
	);
}

export function ArrowRightCircle({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="10" fill="currentColor" />
			<path d="M10 8L14 12L10 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function DocumentIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M8 3.8H14L18.2 8V20.2H8V3.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M14 3.8V8H18.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M10.4 12H15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M10.4 15.6H15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function PlusCircleIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function VerifiedBadge({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" />
			<path fill="#fff" d="M10.4 15.3 7.1 12l1.3-1.3 2 2 4.2-4.2 1.3 1.3z" />
		</svg>
	);
}

export function PinIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M12 20C12 20 18 14.5 18 10.2A6 6 0 1 0 6 10.2C6 14.5 12 20 12 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<circle cx="12" cy="10.2" r="2.1" fill="currentColor" />
		</svg>
	);
}

export function StarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
			<path d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
		</svg>
	);
}

export function PencilIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 16.8V20H7.2L17.3 9.9L14.1 6.7L4 16.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M12.8 8L16 11.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M13.4 7.4L15 5.8A1.9 1.9 0 0 1 17.7 5.8L18.2 6.3A1.9 1.9 0 0 1 18.2 9L16.6 10.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function TrashIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 7H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M9 7V5.7C9 5.01 9.56 4.45 10.25 4.45H13.75C14.44 4.45 15 5.01 15 5.7V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M7.2 7L8.1 18.1C8.18 19.04 8.96 19.75 9.9 19.75H14.1C15.04 19.75 15.82 19.04 15.9 18.1L16.8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M10 10.3V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M14 10.3V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function SocialIcon({ kind, className = '' }) {
	if (kind === 'instagram') {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
				<rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
				<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
				<circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
			</svg>
		);
	}
	if (kind === 'tiktok') {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
				<path d="M14 4V13.2A3.8 3.8 0 1 1 10.8 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M14 4C14.8 5.8 16.3 7 18.4 7.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
			<path d="M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M8.5 16.5L6.8 18.2A3 3 0 1 1 2.6 14l2.1-2.1A3 3 0 0 1 9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M15 13A3 3 0 0 1 19.3 13.1l2.1 2.1A3 3 0 1 1 17.2 19.4L15.5 17.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function BellOutlineIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M12 4.8A4.2 4.2 0 0 0 7.8 9V11.1C7.8 12.1 7.45 13.08 6.8 13.84L5.6 15.25C5.22 15.7 5.54 16.4 6.13 16.4H17.87C18.46 16.4 18.78 15.7 18.4 15.25L17.2 13.84A4.2 4.2 0 0 1 16.2 11.1V9A4.2 4.2 0 0 0 12 4.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M10.2 18C10.55 18.64 11.21 19 12 19C12.79 19 13.45 18.64 13.8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function ChevronIcon({ className = '', direction = 'right' }) {
	const rotation = direction === 'left' ? 'rotate(180 12 12)' : undefined;
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<g transform={rotation}>
				<path d="M10 7L15 12L10 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</g>
		</svg>
	);
}

export function StarRow() {
	return (
		<div className="flex gap-1 text-[var(--accent-mauve)]">
			{Array.from({ length: 5 }).map((_, index) => (
				<svg key={index} viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
					<path d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
				</svg>
			))}
		</div>
	);
}

export function getProfileInitial(profile) {
	const firstCandidate = profile?.firstName?.trim() || profile?.lastName?.trim() || profile?.email?.trim() || '?';
	return firstCandidate.charAt(0).toUpperCase();
}

export function UserAvatar({ profile, size = 'h-12 w-12', textSize = 'text-lg' }) {
	const [imageFailed, setImageFailed] = useState(false);
	const imageSrc = profile?.profile_picture_preview || profile?.profile_picture;

	useEffect(() => {
		setImageFailed(false);
	}, [imageSrc]);

	if (imageSrc && !imageFailed) {
		return (
			<div className={`overflow-hidden rounded-full ${size}`}>
				<img src={imageSrc} alt="Profil" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
			</div>
		);
	}

	return (
		<div className={`flex items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)] ${size} ${textSize}`} aria-label="Initiale du profil">
			{getProfileInitial(profile)}
		</div>
	);
}

export function ProviderAvatar({ size = 'h-20 w-20' }) {
	return (
		<div className={`overflow-hidden rounded-full bg-[#0f0f12] ring-1 ring-[#ece7f4] ${size}`}>
			<img src={providerUserPlaceholder} alt="" className="h-full w-full object-cover" />
		</div>
	);
}

export function ClientReviewCard({ title }) {
	return (
		<div className="rounded-[22px] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbf8_100%)] p-5 shadow-[0_14px_34px_rgba(17,19,30,0.045)]">
			<div className="flex items-center gap-5">
				<ProviderAvatar />
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-[1.05rem] font-semibold text-[#171717]">{title}</h3>
					<div className="mt-2">
						<StarRow />
					</div>
					<button type="button" className="mt-4 text-sm font-medium text-[#5a5a5a] transition hover:text-[#0a0a0a]">
						&gt; Laisser un avis
					</button>
				</div>
			</div>
		</div>
	);
}

export function ReservationItem({ reservation }) {
	// Le back prépare déjà les libellés, donc ici je me contente de les afficher proprement.
	const dateLabel = reservation.date_label || reservation.start || '--';
	const timeLabel = reservation.time_label || '';

	return (
		<div className="flex items-center gap-4 border-b border-black/6 py-3 last:border-b-0">
			<ProviderAvatar size="h-11 w-11" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[1rem] font-semibold text-[#171717]">{reservation.service_name}</p>
				<p className="truncate text-[0.9rem] text-black/50">{reservation.title}</p>
				<p className="mt-1 text-[0.78rem] text-black/35">
					<span className="font-semibold text-black/65">{dateLabel}</span>
					{timeLabel ? ` ${timeLabel}` : ''}
				</p>
			</div>
			<ArrowRightCircle className="h-6 w-6 shrink-0 text-[#0f0f12]" />
		</div>
	);
}

export function InvoiceItem({ label, kind = 'invoice' }) {
	const isQuote = kind === 'quote';

	return (
		<div className={`flex items-center gap-3 rounded-[14px] px-3 py-3 ${isQuote ? 'bg-white text-black/62' : 'text-black/62'}`}>
			<img src={pdfFileIcon} alt="PDF" className="h-5 w-5 shrink-0 object-contain" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[0.88rem]">{label}</p>
				<p className={`mt-1 text-[0.72rem] ${isQuote ? 'text-[var(--accent-mauve)]' : 'text-black/36'}`}>
					{isQuote ? 'En attente de validation' : 'PDF disponible'}
				</p>
			</div>
			<span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] ${isQuote ? 'bg-[var(--accent-mauve-soft)] text-[var(--accent-mauve)]' : 'bg-black/5 text-black/45'}`}>
				{isQuote ? 'Voir' : 'Télécharger'}
			</span>
		</div>
	);
}

export function InfoRow({ label, value }) {
	return (
		<div className="grid gap-1 rounded-[16px] border border-black/6 bg-white/75 px-4 py-3 md:grid-cols-[180px_1fr] md:items-center">
			<div className="text-[0.9rem] font-medium text-black/42">{label}</div>
			<div className="text-[0.98rem] text-[#151515]">{value || '-'}</div>
		</div>
	);
}

export function getProfileTabFromLocation(search = window.location.search) {
	// Je centralise la lecture du tab ici pour garder la même logique partout.
	const tabParam = new URLSearchParams(search).get('tab');
	if (tabParam === 'settings' || tabParam === 'favorites') {
		return tabParam;
	}
	return 'dashboard';
}

export function getProfessionalTabFromLocation(search = window.location.search) {
	const tabParam = new URLSearchParams(search).get('tab');
	if (tabParam === 'profile' || tabParam === 'settings' || tabParam === 'favorites') {
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

export function SidebarLink({ href, active = false, icon: Icon, onNavigate, tone = 'dark', children }) {
	function handleClick(event) {
		if (onNavigate) {
			event.preventDefault();
			onNavigate(href);
		}
	}

	const activeClass = tone === 'light' ? 'text-[var(--accent-mauve)]' : 'text-[#c7b2ec]';
	const idleClass = tone === 'light' ? 'text-black/82 hover:text-black' : 'text-white/62 hover:text-white';

	return (
		<a className={`flex items-center gap-3 text-[0.98rem] font-medium transition ${active ? activeClass : idleClass}`} href={href} onClick={handleClick}>
			<Icon className="h-5 w-5" />
			<span>{children}</span>
		</a>
	);
}

export function DevelopmentNoticeModal({ open, onClose }) {
	return (
		<ModalPortal open={open}>
			<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,15,13,0.32)] backdrop-blur-[3px]">
				<div className="flex min-h-full items-center justify-center px-6 py-6">
					<div className="w-full max-w-[420px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
								<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Documents</h2>
							</div>
							<button type="button" onClick={onClose} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">
								Fermer
							</button>
						</div>
						<p className="mt-6 text-[1rem] leading-8 text-black/62">Cette page est en cours de développement.</p>
					</div>
				</div>
			</div>
		</ModalPortal>
	);
}

export function SettingsPanel({ profile, onProfileUpdated }) {
	const [uploadState, setUploadState] = useState({ loading: false, message: '', error: '' });
	const [passwordState, setPasswordState] = useState({
		previousPassword: '',
		newPassword: '',
		confirmPassword: '',
		loading: false,
		message: '',
		error: '',
	});

	const locationLabel = [profile.address, profile.city, profile.country].filter(Boolean).join(', ');

	async function handlePictureUpload(event) {
		const file = event.target.files?.[0];
		event.target.value = '';

		if (!file) {
			return;
		}

		const localPreviewUrl = URL.createObjectURL(file);
		onProfileUpdated({
			...profile,
			profile_picture_preview: localPreviewUrl,
			profile_picture: localPreviewUrl,
		});

		const formData = new FormData();
		formData.append('image', file);
		setUploadState({ loading: true, message: '', error: '' });

		try {
			const response = await fetch('/profil/update-profil-picture', {
				method: 'PUT',
				credentials: 'same-origin',
				body: formData,
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setUploadState({
					loading: false,
					message: '',
					error: payload?.message || "Impossible de mettre à jour la photo de profil.",
				});
				return;
			}

			if (payload?.message) {
				const nextProfile = { ...payload.message };
				nextProfile.profile_picture_preview = localPreviewUrl;
				onProfileUpdated(nextProfile);
			}

			setUploadState({
				loading: false,
				message: 'Photo de profil mise à jour.',
				error: '',
			});
		} catch {
			setUploadState({
				loading: false,
				message: '',
				error: 'Erreur réseau lors de l’envoi de la photo.',
			});
		}
	}

	function handlePasswordFieldChange(field, value) {
		setPasswordState((current) => ({
			...current,
			[field]: value,
			message: '',
			error: '',
		}));
	}

	async function handlePasswordSubmit(event) {
		event.preventDefault();

		if (!passwordState.previousPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Renseigne tous les champs du mot de passe.',
				message: '',
			}));
			return;
		}

		if (passwordState.newPassword !== passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.',
				message: '',
			}));
			return;
		}

		setPasswordState((current) => ({ ...current, loading: true, message: '', error: '' }));

		try {
			const response = await fetch(`/profil/${profile.users_id}/change-password`, {
				method: 'PUT',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					previousPassword: passwordState.previousPassword,
					newPassword: passwordState.newPassword,
				}),
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setPasswordState((current) => ({
					...current,
					loading: false,
					message: '',
					error: payload?.message || 'Impossible de modifier le mot de passe.',
				}));
				return;
			}

			setPasswordState({
				previousPassword: '',
				newPassword: '',
				confirmPassword: '',
				loading: false,
				message: 'Mot de passe mis à jour.',
				error: '',
			});
		} catch {
			setPasswordState((current) => ({
				...current,
				loading: false,
				message: '',
				error: 'Erreur réseau lors de la mise à jour du mot de passe.',
			}));
		}
	}

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
						<label
							htmlFor="profile-picture-input"
							className="absolute bottom-1 left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#101010] text-xl font-semibold text-white shadow-[0_10px_24px_rgba(10,10,10,0.22)]"
						>
							+
						</label>
						<input id="profile-picture-input" type="file" accept="image/png,image/jpeg,image/jpg,image/gif" className="hidden" onChange={handlePictureUpload} />
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

				{uploadState.message ? <p className="mt-5 text-[0.94rem] font-medium text-[#1f6b3b]">{uploadState.message}</p> : null}
				{uploadState.error ? <p className="mt-5 text-[0.94rem] font-medium text-[#c35555]">{uploadState.error}</p> : null}
				{uploadState.loading ? <p className="mt-5 text-[0.94rem] text-black/52">Mise à jour de la photo…</p> : null}
			</section>

			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Adresse</h2>
				<div className="mt-6 grid max-w-[760px] gap-5 md:grid-cols-2">
					<label className="flex flex-col gap-2 md:col-span-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Adresse *</span>
						<input
							type="text"
							defaultValue={profile.address || ''}
							placeholder="Nom de la rue et ville/code postal"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Ville *</span>
						<input
							type="text"
							defaultValue={profile.city || ''}
							placeholder="Ville"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Pays *</span>
						<input
							type="text"
							defaultValue={profile.country || ''}
							placeholder="Pays"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
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
								<span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-[#101010] transition">
									<span className="absolute left-6 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition" />
								</span>
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Recevoir les nouveaux messages par mails</p>
								<span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-black/12 transition">
									<span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition" />
								</span>
							</div>
						</div>
					</div>

					<div className="rounded-[20px] bg-[#f2f1ed] p-5">
						<h3 className="text-[1.1rem] font-semibold text-[#151515]">Informations</h3>
						<div className="mt-5 space-y-4">
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon adresse sur mon profil</p>
								<span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-black/12 transition">
									<span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition" />
								</span>
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon numéro de téléphone sur mon profil</p>
								<span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-[#101010] transition">
									<span className="absolute left-6 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition" />
								</span>
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

			<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Sécurité</h2>
				<form className="mt-8 grid max-w-[720px] gap-5" onSubmit={handlePasswordSubmit}>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Mot de passe actuel</span>
						<input
							type="password"
							value={passwordState.previousPassword}
							onChange={(event) => handlePasswordFieldChange('previousPassword', event.target.value)}
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Nouveau mot de passe</span>
						<input
							type="password"
							value={passwordState.newPassword}
							onChange={(event) => handlePasswordFieldChange('newPassword', event.target.value)}
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Confirmer le nouveau mot de passe</span>
						<input
							type="password"
							value={passwordState.confirmPassword}
							onChange={(event) => handlePasswordFieldChange('confirmPassword', event.target.value)}
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none"
						/>
					</label>

					<button
						type="submit"
						disabled={passwordState.loading}
						className={`mt-2 self-start rounded-[14px] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)] ${
							passwordState.loading ? 'cursor-not-allowed bg-black/30' : 'bg-[#101010]'
						}`}
					>
						{passwordState.loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
					</button>
				</form>

				{passwordState.message ? <p className="mt-5 text-[0.94rem] font-medium text-[#1f6b3b]">{passwordState.message}</p> : null}
				{passwordState.error ? <p className="mt-5 text-[0.94rem] font-medium text-[#c35555]">{passwordState.error}</p> : null}
			</section>
		</div>
	);
}

export function ProfessionalSettingsPanel({ profile, onProfileUpdated }) {
	const [accountForm, setAccountForm] = useState({
		title: 'madame',
		firstName: profile.firstName || '',
		lastName: profile.lastName || '',
		birthDate: '',
	});
	const [companyForm, setCompanyForm] = useState({
		email: profile.email || '',
		companyName: profile.company_name || '',
		siret: profile.siret || '',
		companyAddress: profile.company_address || '',
		phone: profile.phone || '',
	});
	const [emailEditable, setEmailEditable] = useState(false);
	const [accountMessage, setAccountMessage] = useState('');
	const [companyMessage, setCompanyMessage] = useState('');
	const [preferenceToggles, setPreferenceToggles] = useState({
		privateMessages: true,
		emailMessages: false,
		showAddress: false,
		showPhone: true,
	});
	const [passwordState, setPasswordState] = useState({
		previousPassword: '',
		newPassword: '',
		confirmPassword: '',
		loading: false,
		message: '',
		error: '',
	});

	useEffect(() => {
		setAccountForm((current) => ({
			...current,
			firstName: profile.firstName || '',
			lastName: profile.lastName || '',
		}));
		setCompanyForm({
			email: profile.email || '',
			companyName: profile.company_name || '',
			siret: profile.siret || '',
			companyAddress: profile.company_address || '',
			phone: profile.phone || '',
		});
	}, [profile]);

	function handlePasswordFieldChange(field, value) {
		setPasswordState((current) => ({
			...current,
			[field]: value,
			message: '',
			error: '',
		}));
	}

	async function handlePasswordSubmit(event) {
		event.preventDefault();

		if (!passwordState.previousPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Renseigne tous les champs du mot de passe.',
				message: '',
			}));
			return;
		}

		if (passwordState.newPassword !== passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.',
				message: '',
			}));
			return;
		}

		setPasswordState((current) => ({ ...current, loading: true, message: '', error: '' }));

		try {
			const response = await fetch(`/profil/${profile.users_id}/change-password`, {
				method: 'PUT',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					previousPassword: passwordState.previousPassword,
					newPassword: passwordState.newPassword,
				}),
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setPasswordState((current) => ({
					...current,
					loading: false,
					message: '',
					error: payload?.message || 'Impossible de modifier le mot de passe.',
				}));
				return;
			}

			setPasswordState({
				previousPassword: '',
				newPassword: '',
				confirmPassword: '',
				loading: false,
				message: 'Mot de passe mis à jour.',
				error: '',
			});
		} catch {
			setPasswordState((current) => ({
				...current,
				loading: false,
				message: '',
				error: 'Erreur réseau lors de la mise à jour du mot de passe.',
			}));
		}
	}

	function saveAccountSection() {
		onProfileUpdated({
			...profile,
			firstName: accountForm.firstName,
			lastName: accountForm.lastName,
		});
		setAccountMessage('Informations du compte mises à jour.');
	}

	function saveCompanySection() {
		onProfileUpdated({
			...profile,
			email: companyForm.email,
			company_name: companyForm.companyName,
			company_address: companyForm.companyAddress,
			phone: companyForm.phone,
			siret: companyForm.siret,
		});
		setCompanyMessage('Informations professionnelles mises à jour.');
		setEmailEditable(false);
	}

	function togglePreference(key) {
		setPreferenceToggles((current) => ({
			...current,
			[key]: !current[key],
		}));
	}

	const sectionClass = 'border-t border-black/8 pt-7';
	const inputClass = 'h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white';
	const saveButtonClass = 'rounded-[14px] bg-[#101010] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)] transition hover:-translate-y-px';

	function PreferenceToggle({ checked, onClick, label }) {
		return (
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				aria-label={label}
				onClick={onClick}
				className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${
					checked ? 'bg-[#101010]' : 'bg-black/12'
				}`}
			>
				<span
					className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition ${
						checked ? 'left-6' : 'left-1'
					}`}
				/>
			</button>
		);
	}

	return (
		<div className="space-y-8 rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
			<section>
				<h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-[#151515]">Paramètres</h2>

				<div className="mt-8">
					<h3 className="text-[1.35rem] font-semibold text-[#151515]">Information du compte</h3>

					<div className="mt-8 flex flex-wrap gap-8 text-[0.98rem] text-[#1a1a1a]">
						{[
							{ value: 'madame', label: 'Madame' },
							{ value: 'monsieur', label: 'Monsieur' },
							{ value: 'non-specifiee', label: 'Non spécifiée' },
						].map((option) => (
							<label key={option.value} className="flex items-center gap-3">
								<input
									type="radio"
									name="pro-title"
									checked={accountForm.title === option.value}
									onChange={() => {
										setAccountForm((current) => ({ ...current, title: option.value }));
										setAccountMessage('');
									}}
									className="accent-[#101010]"
								/>
								<span>{option.label}</span>
							</label>
						))}
					</div>

					<div className="mt-10 grid gap-6 md:grid-cols-2">
						<label className="flex flex-col gap-2">
							<span className="text-[0.95rem] font-medium text-[#151515]">Nom *</span>
							<input
								type="text"
								value={accountForm.lastName}
								onChange={(event) => {
									setAccountForm((current) => ({ ...current, lastName: event.target.value }));
									setAccountMessage('');
								}}
								className={inputClass}
							/>
						</label>
						<label className="flex flex-col gap-2">
							<span className="text-[0.95rem] font-medium text-[#151515]">Prénom *</span>
							<input
								type="text"
								value={accountForm.firstName}
								onChange={(event) => {
									setAccountForm((current) => ({ ...current, firstName: event.target.value }));
									setAccountMessage('');
								}}
								className={inputClass}
							/>
						</label>
						<label className="flex flex-col gap-2 md:max-w-[340px]">
							<span className="text-[0.95rem] font-medium text-[#151515]">Date de naissance *</span>
							<input
								type="text"
								placeholder="JJ/MM/AAAA"
								value={accountForm.birthDate}
								onChange={(event) => {
									setAccountForm((current) => ({ ...current, birthDate: event.target.value }));
									setAccountMessage('');
								}}
								className={inputClass}
							/>
						</label>
					</div>

					<button type="button" onClick={saveAccountSection} className={`mt-7 ${saveButtonClass}`}>
						Enregistrer
					</button>
					{accountMessage ? <p className="mt-4 text-[0.94rem] font-medium text-[#1f6b3b]">{accountMessage}</p> : null}
				</div>
			</section>

			<section className={sectionClass}>
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Adresse</h2>
				<div className="mt-6 grid max-w-[760px] gap-5 md:grid-cols-2">
					<label className="flex flex-col gap-2 md:col-span-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Adresse *</span>
						<input
							type="text"
							defaultValue={profile.address || ''}
							placeholder="Nom de la rue et ville/code postal"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Ville *</span>
						<input
							type="text"
							defaultValue={profile.city || ''}
							placeholder="Ville"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Pays *</span>
						<input
							type="text"
							defaultValue={profile.country || ''}
							placeholder="Pays"
							className="h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white"
						/>
					</label>
				</div>

				<button type="button" className={`mt-7 ${saveButtonClass}`}>
					Enregistrer
				</button>
			</section>

			<section className={sectionClass}>
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">E-mail</h2>
				<div className="mt-6 flex max-w-[720px] items-center gap-3 rounded-[16px] border border-black/6 bg-[#f2f1ed] p-3">
					<input
						type="email"
						value={companyForm.email}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, email: event.target.value }));
							setCompanyMessage('');
						}}
						disabled={!emailEditable}
						className="min-w-0 flex-1 bg-transparent px-2 text-[1rem] text-[#151515] outline-none disabled:text-[#151515]"
					/>
					<button
						type="button"
						onClick={() => setEmailEditable((value) => !value)}
						className="rounded-[14px] bg-[#101010] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_rgba(10,10,10,0.16)]"
					>
						{emailEditable ? 'Valider' : 'Modifier'}
					</button>
				</div>
			</section>

			<section className={sectionClass}>
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Détails de l'entreprise</h2>

				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Nom de l’entreprise</span>
						<input
							type="text"
							value={companyForm.companyName}
							onChange={(event) => {
								setCompanyForm((current) => ({ ...current, companyName: event.target.value }));
								setCompanyMessage('');
							}}
							className={`${inputClass} text-black/68`}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Numéro SIRET</span>
						<input
							type="text"
							value={companyForm.siret}
							onChange={(event) => {
								setCompanyForm((current) => ({ ...current, siret: event.target.value }));
								setCompanyMessage('');
							}}
							placeholder="123 456 789 XXXXX"
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Adresse de l’entreprise *</span>
						<input
							type="text"
							value={companyForm.companyAddress}
							onChange={(event) => {
								setCompanyForm((current) => ({ ...current, companyAddress: event.target.value }));
								setCompanyMessage('');
							}}
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Numéro de téléphone *</span>
						<input
							type="text"
							value={companyForm.phone}
							onChange={(event) => {
								setCompanyForm((current) => ({ ...current, phone: event.target.value }));
								setCompanyMessage('');
							}}
							className={inputClass}
						/>
					</label>
				</div>

				<button type="button" onClick={saveCompanySection} className={`mt-7 ${saveButtonClass}`}>
					Enregistrer
				</button>
				{companyMessage ? <p className="mt-4 text-[0.94rem] font-medium text-[#1f6b3b]">{companyMessage}</p> : null}
			</section>

			<section className={sectionClass}>
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Préférences</h2>

				<div className="mt-6 space-y-5">
					<div className="rounded-[20px] bg-[#f2f1ed] p-5">
						<h3 className="text-[1.1rem] font-semibold text-[#151515]">Messagerie</h3>
						<div className="mt-5 space-y-4">
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Recevoir des messages privés</p>
								<PreferenceToggle
									checked={preferenceToggles.privateMessages}
									onClick={() => togglePreference('privateMessages')}
									label="Recevoir des messages privés"
								/>
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Recevoir les nouveaux messages par mails</p>
								<PreferenceToggle
									checked={preferenceToggles.emailMessages}
									onClick={() => togglePreference('emailMessages')}
									label="Recevoir les nouveaux messages par mails"
								/>
							</div>
						</div>
					</div>

					<div className="rounded-[20px] bg-[#f2f1ed] p-5">
						<h3 className="text-[1.1rem] font-semibold text-[#151515]">Informations</h3>
						<div className="mt-5 space-y-4">
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon adresse sur mon profil</p>
								<PreferenceToggle
									checked={preferenceToggles.showAddress}
									onClick={() => togglePreference('showAddress')}
									label="Afficher mon adresse sur mon profil"
								/>
							</div>
							<div className="flex items-center justify-between gap-6">
								<p className="text-[0.98rem] text-[#242424]">Afficher mon numéro de téléphone sur mon profil</p>
								<PreferenceToggle
									checked={preferenceToggles.showPhone}
									onClick={() => togglePreference('showPhone')}
									label="Afficher mon numéro de téléphone sur mon profil"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className={sectionClass}>
				<h2 className="text-[1.35rem] font-semibold text-[#151515]">Sécurité</h2>
				<form className="mt-8 grid max-w-[720px] gap-5" onSubmit={handlePasswordSubmit}>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Mot de passe actuel</span>
						<input
							type="password"
							value={passwordState.previousPassword}
							onChange={(event) => handlePasswordFieldChange('previousPassword', event.target.value)}
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Nouveau mot de passe</span>
						<input
							type="password"
							value={passwordState.newPassword}
							onChange={(event) => handlePasswordFieldChange('newPassword', event.target.value)}
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-2">
						<span className="text-[0.95rem] font-medium text-[#151515]">Confirmer le nouveau mot de passe</span>
						<input
							type="password"
							value={passwordState.confirmPassword}
							onChange={(event) => handlePasswordFieldChange('confirmPassword', event.target.value)}
							className={inputClass}
						/>
					</label>

					<button
						type="submit"
						disabled={passwordState.loading}
						className={`mt-2 self-start ${passwordState.loading ? 'cursor-not-allowed bg-black/30' : 'bg-[#101010]'} rounded-[14px] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)]`}
					>
						{passwordState.loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
					</button>
				</form>

				{passwordState.message ? <p className="mt-5 text-[0.94rem] font-medium text-[#1f6b3b]">{passwordState.message}</p> : null}
				{passwordState.error ? <p className="mt-5 text-[0.94rem] font-medium text-[#c35555]">{passwordState.error}</p> : null}
			</section>
		</div>
	);
}

export function FavoritesPanel() {
	return (
		<div>
			<h2 className="mb-10 text-[2rem] font-semibold tracking-[-0.03em] text-[#151515]">
				Retrouvez vos prestataires favoris sauvegardés ici
			</h2>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(330px,430px))] gap-6">
				{[
					{ id: 'fav-1', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-2', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-3', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-4', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-5', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-6', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
				].map((item, index) => (
					<Reveal key={item.id} from="bottom" delay={index * 60}>
						<div className="w-full max-w-[430px] rounded-[20px] border border-black/8 bg-white/96 p-3 shadow-[0_12px_28px_rgba(17,19,30,0.04)]">
							<div className="flex items-start gap-3">
								<div className="relative h-[128px] w-[124px] shrink-0 overflow-hidden rounded-[14px]">
									<img src={favoritesPlaceholder} alt={item.title} className="h-full w-full object-cover" />
									<button
										type="button"
										className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#111111] shadow-[0_10px_24px_rgba(10,10,10,0.18)]"
									>
										<BookmarkIcon className="h-[22px] w-[22px]" />
									</button>
								</div>

								<div className="flex min-w-0 flex-1 flex-col pt-1">
									<h3 className="text-[0.96rem] font-semibold leading-[1.3] text-[#151515]">{item.title}</h3>
									<p className="mt-2 text-[0.92rem] text-[#242424]">{item.category}</p>
									<p className="mt-auto pt-7 text-[0.9rem] text-black/28">{item.location}</p>
								</div>
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</div>
	);
}
