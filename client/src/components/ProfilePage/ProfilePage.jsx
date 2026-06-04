import { startTransition, useEffect, useMemo, useState } from 'react';
import favoritesPlaceholder from '../../assets/favorites-placeholder.jpg';
import tipsPerson from '../../assets/tips-person.png';
import tipsImg2 from '../../assets/tips-2.png';
import tipsImg3 from '../../assets/tips-3.png';
import tipsImg4 from '../../assets/tips-4.png';
import tipsImg5 from '../../assets/tips-5.png';
import pdfFileIcon from '../../assets/pdf-file-icon.png';
import navigationPlaceholder from '../../assets/navigation-placeholder.jpg';
import providerGalleryOne from '../../assets/provider-gallery-1.jpg';
import providerGalleryTwo from '../../assets/provider-gallery-2.jpg';
import providerUserPlaceholder from '../../assets/provider-user-placeholder.png';
import prestatLogo from '../../assets/prestat-logo.svg';
import { getProviderById, saveProviderOverride } from '../../data/providers';
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

function BookmarkOutlineIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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

function UserIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
			<path d="M5.5 18.8C6.7 15.8 9.1 14.2 12 14.2C14.9 14.2 17.3 15.8 18.5 18.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function DocumentIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M8 3.8H14L18.2 8V20.2H8V3.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M14 3.8V8H18.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M10.4 12H15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M10.4 15.6H15.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function PlusCircleIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

function VerifiedBadge({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path
				fill="#1d9bf0"
				d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
			/>
			<path fill="#fff" d="M10.4 15.3 7.1 12l1.3-1.3 2 2 4.2-4.2 1.3 1.3z" />
		</svg>
	);
}

function PinIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d="M12 20C12 20 18 14.5 18 10.2A6 6 0 1 0 6 10.2C6 14.5 12 20 12 20Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<circle cx="12" cy="10.2" r="2.1" fill="currentColor" />
		</svg>
	);
}

function StarIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
			<path
				d="M10 2.8L12.1 7.1L16.9 7.8L13.4 11.2L14.2 16L10 13.8L5.8 16L6.6 11.2L3.1 7.8L7.9 7.1L10 2.8Z"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function PencilIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 16.8V20H7.2L17.3 9.9L14.1 6.7L4 16.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M12.8 8L16 11.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M13.4 7.4L15 5.8A1.9 1.9 0 0 1 17.7 5.8L18.2 6.3A1.9 1.9 0 0 1 18.2 9L16.6 10.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function TrashIcon({ className = '' }) {
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

function SocialIcon({ kind, className = '' }) {
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

function BellOutlineIcon({ className = '' }) {
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

function ChevronIcon({ className = '', direction = 'right' }) {
	const rotation = direction === 'left' ? 'rotate(180 12 12)' : undefined;
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<g transform={rotation}>
				<path d="M10 7L15 12L10 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</g>
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
	const [imageFailed, setImageFailed] = useState(false);
	const imageSrc = profile?.profile_picture_preview || profile?.profile_picture;

	useEffect(() => {
		setImageFailed(false);
	}, [imageSrc]);

	if (imageSrc && !imageFailed) {
		return (
			<div className={`overflow-hidden rounded-full ${size}`}>
				<img
					src={imageSrc}
					alt="Profil"
					className="h-full w-full object-cover"
					onError={() => setImageFailed(true)}
				/>
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

function InfoRow({ label, value }) {
	return (
		<div className="grid gap-1 rounded-[16px] border border-black/6 bg-white/75 px-4 py-3 md:grid-cols-[180px_1fr] md:items-center">
			<div className="text-[0.9rem] font-medium text-black/42">{label}</div>
			<div className="text-[0.98rem] text-[#151515]">{value || '-'}</div>
		</div>
	);
}

function getProfileTabFromLocation(search = window.location.search) {
	const tabParam = new URLSearchParams(search).get('tab');

	if (tabParam === 'settings' || tabParam === 'favorites') {
		return tabParam;
	}

	return 'dashboard';
}

function getProfessionalTabFromLocation(search = window.location.search) {
	const tabParam = new URLSearchParams(search).get('tab');

	if (tabParam === 'profile' || tabParam === 'settings') {
		return tabParam;
	}

	return 'dashboard';
}

function resolveProfessionalProviderId(profile) {
	const companyName = (profile?.company_name || '').toLowerCase();

	if (companyName.includes('tressa')) return 'tressa';
	if (companyName.includes('atelier')) return 'atelier';
	if (companyName.includes('maison')) return 'maison';

	return 'tressa';
}

function SidebarLink({ href, active = false, icon: Icon, onNavigate, tone = 'dark', children }) {
	function handleClick(event) {
		if (onNavigate) {
			event.preventDefault();
			onNavigate(href);
		}
	}

	const activeClass = tone === 'light' ? 'text-[#c7a45f]' : 'text-[#c9a25f]';
	const idleClass = tone === 'light' ? 'text-black/82 hover:text-black' : 'text-white/62 hover:text-white';

	return (
		<a
			className={`flex items-center gap-3 text-[0.98rem] font-medium transition ${
				active ? activeClass : idleClass
			}`}
			href={href}
			onClick={handleClick}
		>
			<Icon className="h-5 w-5" />
			<span>{children}</span>
		</a>
	);
}

function SettingsPanel({ profile, onProfileUpdated }) {
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

function FavoritesPanel() {
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

function DashboardShell({ profile, reservations, onProfileUpdated }) {
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

	const [activeTab, setActiveTab] = useState(() => getProfileTabFromLocation());
	const [contentVisible, setContentVisible] = useState(true);

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

	useEffect(() => {
		function handlePopState() {
			startTransition(() => {
				setActiveTab(getProfileTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	useEffect(() => {
		setContentVisible(false);

		const animationFrameId = window.requestAnimationFrame(() => {
			setContentVisible(true);
		});

		return () => window.cancelAnimationFrame(animationFrameId);
	}, [activeTab]);

	function handleSidebarNavigation(href) {
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfileTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			window.location.href = targetUrl.toString();
			return;
		}

		if (nextTab === activeTab) {
			return;
		}

		window.history.pushState({}, '', `${targetUrl.pathname}${targetUrl.search}`);
		startTransition(() => {
			setActiveTab(nextTab);
		});
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#1f1f1f]">
			<div className="grid min-h-screen grid-cols-[210px_1fr]">
				<aside className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] text-white">
					<div className="flex h-[92px] items-center justify-center border-b border-white/10 px-7">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition opacity-100 hover:opacity-80">
							<img
								src={prestatLogo}
								alt="Prestat"
								className="w-[126px]"
								style={{ filter: 'brightness(0) invert(1)' }}
							/>
						</a>
					</div>

					<nav className="flex flex-1 flex-col overflow-y-auto px-9 pb-9 pt-11">
						<div className="space-y-8">
							<SidebarLink href="/app/profil" active={activeTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleSidebarNavigation}>
								Dashboard
							</SidebarLink>
							<SidebarLink href="/navigation" icon={CompassIcon}>
								Découvrir
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=favorites" active={activeTab === 'favorites'} icon={BookmarkIcon} onNavigate={handleSidebarNavigation}>
								Favoris
							</SidebarLink>
							<SidebarLink href="/app/profil?tab=settings" active={activeTab === 'settings'} icon={SettingsIcon} onNavigate={handleSidebarNavigation}>
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

					<div className={`grid gap-8 px-9 pb-10 pt-11 ${activeTab === 'dashboard' ? 'lg:grid-cols-[1fr_305px]' : 'grid-cols-1'}`}>
						<div
							key={activeTab}
							className={`min-w-0 transition-[opacity,transform] duration-220 ease-out ${
								contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-[6px] opacity-0'
							}`}
							>
								{activeTab === 'settings' ? (
									<SettingsPanel profile={profile} onProfileUpdated={onProfileUpdated} />
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

function ProfessionalProfile({ profile, serviceTiles, onAddService, onEditService }) {
	const providerId = resolveProfessionalProviderId(profile);
	const provider = getProviderById(providerId);
	const [isEditing, setIsEditing] = useState(false);
	const [saveState, setSaveState] = useState('');
	const [draft, setDraft] = useState(() => ({
		company: profile.company_name || provider.company,
		location: profile.company_address || provider.location,
		policy: provider.policy,
		news: provider.news,
		description: provider.description,
		hours: provider.hours,
		gallery: provider.gallery.length ? provider.gallery : [
			{ id: 'g1', image: providerGalleryOne, alt: 'Photo vitrine 1' },
			{ id: 'g2', image: providerGalleryTwo, alt: 'Photo vitrine 2' },
			{ id: 'g3', image: favoritesPlaceholder, alt: 'Photo vitrine 3' },
		],
		socials: {
			instagram: provider.socials.find((item) => item.id === 'instagram')?.href || '',
			tiktok: provider.socials.find((item) => item.id === 'tiktok')?.href || '',
			link: provider.socials.find((item) => item.id === 'link')?.href || '',
		},
	}));

	useEffect(() => {
		setDraft({
			company: profile.company_name || provider.company,
			location: profile.company_address || provider.location,
			policy: provider.policy,
			news: provider.news,
			description: provider.description,
			hours: provider.hours,
			gallery: provider.gallery.length ? provider.gallery : [
				{ id: 'g1', image: providerGalleryOne, alt: 'Photo vitrine 1' },
				{ id: 'g2', image: providerGalleryTwo, alt: 'Photo vitrine 2' },
				{ id: 'g3', image: favoritesPlaceholder, alt: 'Photo vitrine 3' },
			],
			socials: {
				instagram: provider.socials.find((item) => item.id === 'instagram')?.href || '',
				tiktok: provider.socials.find((item) => item.id === 'tiktok')?.href || '',
				link: provider.socials.find((item) => item.id === 'link')?.href || '',
			},
		});
	}, [profile.company_name, profile.company_address, provider.company, provider.location, provider.policy, provider.news, provider.description, provider.hours, provider.gallery, provider.socials]);

	function updateDraft(field, value) {
		setDraft((current) => ({ ...current, [field]: value }));
		setSaveState('');
	}

	function updateHour(index, value) {
		setDraft((current) => ({
			...current,
			hours: current.hours.map((entry, entryIndex) => (entryIndex === index ? [entry[0], value] : entry)),
		}));
		setSaveState('');
	}

	function updateSocial(field, value) {
		setDraft((current) => ({
			...current,
			socials: { ...current.socials, [field]: value },
		}));
		setSaveState('');
	}

	function handleSaveProfile() {
		saveProviderOverride(providerId, {
			company: draft.company,
			location: draft.location,
			policy: draft.policy,
			news: draft.news,
			description: draft.description,
			hours: draft.hours,
			gallery: draft.gallery,
			socials: [
				{ id: 'instagram', label: 'Instagram', href: draft.socials.instagram || '#' },
				{ id: 'tiktok', label: 'TikTok', href: draft.socials.tiktok || '#' },
				{ id: 'link', label: 'Site', href: draft.socials.link || '#' },
			],
			services: serviceTiles.map((service) => ({
				id: service.id,
				name: service.title,
				duration: service.duration || '1h',
				price: service.price,
				description: service.description || '',
			})),
		});
		setIsEditing(false);
		setSaveState('Modifications enregistrées.');
	}

	return (
		<div className="px-9 pb-12 pt-9">
			<div className="mx-auto max-w-[1480px]">
				<div className="mb-8 flex flex-wrap items-center gap-4">
					<button
						type="button"
						onClick={() => setIsEditing((value) => !value)}
						className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-[0.95rem] font-medium text-[#171717] transition hover:border-black/18 hover:bg-black/[0.02]"
					>
						{isEditing ? 'Annuler l’édition' : 'Éditer le profil'}
					</button>
					<button
						type="button"
						onClick={handleSaveProfile}
						className="rounded-full bg-[#101010] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_14px_28px_rgba(17,19,30,0.14)] transition hover:-translate-y-px"
					>
						Enregistrer
					</button>
					{saveState ? <p className="text-[0.9rem] text-black/48">{saveState}</p> : null}
				</div>

				<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
					<div className="min-w-0">
						<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
							<div className="flex items-start gap-5">
								<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dbc78f] bg-white shadow-[0_16px_34px_rgba(17,19,30,0.04)]">
									<div className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1b20] text-white shadow-[0_10px_24px_rgba(17,19,30,0.18)]">
										<PlusCircleIcon className="h-5 w-5" />
									</div>
									<svg viewBox="0 0 64 64" className="h-20 w-20 text-[#cfb16d]" fill="none" aria-hidden="true">
										<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
										<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
										<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
										<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
									</svg>
								</div>

								<div className="pt-2">
									{isEditing ? (
										<input
											type="text"
											value={draft.company}
											onChange={(event) => updateDraft('company', event.target.value)}
											className="w-full max-w-[420px] rounded-[16px] border border-black/8 bg-white px-4 py-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#181818] outline-none transition focus:border-black/18"
										/>
									) : (
										<h1 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#181818]">{draft.company}</h1>
									)}
									<div className="mt-3 flex items-center gap-2 text-[1rem] font-medium text-[#1f1f1f]">
										<PinIcon className="h-[18px] w-[18px]" />
										{isEditing ? (
											<input
												type="text"
												value={draft.location}
												onChange={(event) => updateDraft('location', event.target.value)}
												className="w-full max-w-[320px] rounded-[12px] border border-black/8 bg-white px-3 py-2 text-[0.98rem] outline-none transition focus:border-black/18"
											/>
										) : (
											<span>{draft.location}</span>
										)}
									</div>
									<div className="mt-2 flex items-center gap-2 text-[0.96rem] text-black/48">
										<VerifiedBadge className="h-[18px] w-[18px]" />
										<span>utilisateur vérifié</span>
									</div>
								</div>
							</div>
						</div>

						<div className="mb-8">
							<button
								type="button"
								onClick={onAddService}
								className="inline-flex items-center gap-2 rounded-full bg-[#1a1b20] px-4 py-2.5 text-[0.9rem] font-medium text-white shadow-[0_12px_24px_rgba(17,19,30,0.14)]"
							>
								<PlusCircleIcon className="h-4 w-4" />
								Ajouter un service
							</button>
						</div>

						<section>
							<div className="space-y-6">
								{serviceTiles.map((service) => (
									<div key={service.id} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_34px_rgba(17,19,30,0.045)]">
										<div className="mb-4 flex items-start justify-between gap-4">
											<div>
												<h3 className="text-[1.2rem] font-semibold text-[#191919]">{service.title}</h3>
												{service.duration ? <span className="text-[0.95rem] text-black/34">{service.duration}</span> : null}
											</div>
											<div className="flex items-center gap-3 text-black/46">
												<button type="button" onClick={() => onEditService(service)} className="transition hover:text-black" aria-label="Modifier le service">
													<PencilIcon className="h-5 w-5" />
												</button>
												<button type="button" className="transition hover:text-black" aria-label="Supprimer le service">
													<TrashIcon className="h-5 w-5" />
												</button>
											</div>
										</div>
										<div className="grid grid-cols-[96px_1fr] gap-4">
											<div>
												<div className="flex h-24 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#aba79c_0%,#7c786f_100%)] text-white">
													<PlusCircleIcon className="h-7 w-7" />
												</div>
												<p
													className="mt-3 text-center text-[2rem] tracking-[-0.04em] text-[#161616]"
													style={{ fontFamily: '"TAN Meringue", "Iowan Old Style", "Times New Roman", serif' }}
												>
													{service.price}
												</p>
											</div>
											<div className="flex min-h-[96px] flex-col">
												<p className="text-[0.96rem] leading-7 text-black/62">{service.description || 'Ajoutez une description pour ce service.'}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>

						<section className="mt-10">
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Descriptions</h2>
							<div className="rounded-[26px] border border-black/8 bg-white p-7 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								{isEditing ? (
									<textarea
										value={draft.description}
										onChange={(event) => updateDraft('description', event.target.value)}
										className="h-[260px] w-full resize-none rounded-[18px] border border-black/8 bg-[#f7f7f8] p-5 text-[1rem] leading-8 text-black/68 outline-none transition focus:border-black/18 focus:bg-white"
										placeholder="Description"
									/>
								) : (
									<div className="text-[1rem] leading-8 text-black/66">
										{draft.description.split('\n\n').map((paragraph) => (
											<p key={paragraph} className="mb-6 last:mb-0">{paragraph}</p>
										))}
									</div>
								)}
							</div>
						</section>

						<section className="mt-10">
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Vitrine photo</h2>
							<div className="flex flex-wrap gap-4">
								{draft.gallery.map((photo, index) => (
									<div key={photo.id} className="group relative aspect-square w-[168px] overflow-hidden rounded-[22px] border border-black/6 bg-white shadow-[0_14px_34px_rgba(17,19,30,0.04)] sm:w-[182px] lg:w-[196px] xl:w-[210px]">
										<img src={photo.image} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
										<div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,16,18,0.18)]">
											<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/72 text-[#17181d] backdrop-blur-[2px]">
												{index === 2 ? <PlusCircleIcon className="h-8 w-8" /> : <PencilIcon className="h-7 w-7" />}
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>

					<aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
						<div className="overflow-hidden rounded-[26px] border border-black/8 bg-white p-4 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="relative h-[240px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#efe5c7_0%,#dad7cf_40%,#f1efe8_100%)]">
								<img src={navigationPlaceholder} alt="Carte" className="h-full w-full object-cover" />
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Politique de prestation</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							{isEditing ? (
								<textarea
									value={draft.policy}
									onChange={(event) => updateDraft('policy', event.target.value)}
									className="h-[150px] w-full resize-none rounded-[16px] border border-black/8 bg-[#f7f7f8] p-4 text-[0.96rem] leading-7 text-black/62 outline-none transition focus:border-black/18 focus:bg-white"
								/>
							) : (
								<p className="text-[0.96rem] leading-7 text-black/62">{draft.policy}</p>
							)}
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Actualités</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							{isEditing ? (
								<textarea
									value={draft.news}
									onChange={(event) => updateDraft('news', event.target.value)}
									className="h-[150px] w-full resize-none rounded-[16px] border border-black/8 bg-[#f7f7f8] p-4 text-[0.96rem] leading-7 text-black/62 outline-none transition focus:border-black/18 focus:bg-white"
								/>
							) : (
								<p className="text-[0.96rem] leading-7 text-black/62">{draft.news}</p>
							)}
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Horaires d’ouvertures</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							<div className="mt-4 overflow-hidden rounded-[16px] border border-black/6">
								{draft.hours.map(([day, hours], index) => (
									<div key={day} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/6 px-5 py-3.5 text-[1rem] last:border-b-0">
										<span className="text-[#2c2c2c]">{day}</span>
										{isEditing ? (
											<input
												type="text"
												value={hours}
												onChange={(event) => updateHour(index, event.target.value)}
												className="w-[120px] rounded-[10px] border border-black/8 bg-[#f7f7f8] px-3 py-1 text-right text-[0.92rem] outline-none transition focus:border-black/18 focus:bg-white"
											/>
										) : (
											<span className={`${hours === 'Fermé' ? 'text-black/34' : 'text-[#2c2c2c]'}`}>{hours}</span>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Avis</h3>
							<div className="mt-5 rounded-[18px] border border-black/6 p-5">
								<div className="flex items-center gap-2 text-[0.95rem] text-[#1d1d1d]">
									<span className="font-semibold">5,0</span>
									<StarIcon className="h-4 w-4" />
								</div>
								<p className="mt-4 text-[0.96rem] leading-7 text-black/62">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...</p>
								<div className="mt-4 flex justify-end text-[#1a1a1a]">→</div>
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Nous suivre</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							<div className="space-y-3 rounded-[18px] border border-black/6 px-4 py-4">
								{[
									{ id: 'instagram', label: 'Lien instagram' },
									{ id: 'tiktok', label: 'Lien tiktok' },
									{ id: 'link', label: 'Autre liens' },
								].map((item) => (
									<div key={item.id} className="grid grid-cols-[28px_1fr] items-center gap-3">
										<SocialIcon kind={item.id} className="h-6 w-6 text-[#111111]" />
										{isEditing ? (
											<input
												type="text"
												value={draft.socials[item.id]}
												onChange={(event) => updateSocial(item.id, event.target.value)}
												className="h-10 rounded-[12px] border border-black/8 bg-[#f7f7f8] px-3 text-[0.9rem] outline-none transition focus:border-black/18 focus:bg-white"
												placeholder={item.label}
											/>
										) : (
											<p className="text-[0.92rem] text-black/54">{draft.socials[item.id] || item.label}</p>
										)}
									</div>
								))}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

const newsItems = [
	{ tag: 'Fonctionnalité', date: 'Juin 2025', title: 'Réservation instantanée', body: 'Les clients peuvent désormais réserver sans confirmation manuelle de votre part.' },
	{ tag: 'Amélioration', date: 'Mai 2025', title: 'Nouveau tableau de bord', body: 'Statistiques enrichies et graphiques d\'évolution annuelle disponibles.' },
	{ tag: 'Correction', date: 'Avr. 2025', title: 'Notifications push', body: 'Les rappels de RDV sont maintenant envoyés 24 h à l\'avance.' },
	{ tag: 'Fonctionnalité', date: 'Mar. 2025', title: 'Messagerie intégrée', body: 'Échangez directement avec vos clients depuis votre espace professionnel.' },
	{ tag: 'Amélioration', date: 'Fév. 2025', title: 'Photos de profil', body: 'Ajoutez jusqu\'à 6 photos pour illustrer vos prestations.' },
];

function NewsCard({ item }) {
	return (
		<div className="rounded-[14px] bg-[#f6f7f9] px-4 py-3.5">
			<div className="mb-1.5 flex items-center gap-2">
				<span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${
					item.tag === 'Fonctionnalité' ? 'bg-[#0a0a0a] text-white' :
					item.tag === 'Amélioration' ? 'bg-black/8 text-black/60' :
					'bg-black/5 text-black/42'
				}`}>{item.tag}</span>
				<span className="text-[0.75rem] text-black/34">{item.date}</span>
			</div>
			<p className="text-[0.88rem] font-semibold text-[#1b1b1d]">{item.title}</p>
			<p className="mt-0.5 text-[0.82rem] leading-relaxed text-black/48">{item.body}</p>
		</div>
	);
}

function ProfessionalDashboardShell({ profile }) {
	const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '[nom pro]';
	const companyName = profile.company_name || 'TRESSA COIFFURE';
	const [activeProfessionalTab, setActiveProfessionalTab] = useState(() => getProfessionalTabFromLocation());
	const [isDayPlannerOpen, setIsDayPlannerOpen] = useState(false);
	const [isNewsOpen, setIsNewsOpen] = useState(false);
	const [isServicesPanelOpen, setIsServicesPanelOpen] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);
	const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
	const [editingServiceId, setEditingServiceId] = useState(null);
	const [serviceForm, setServiceForm] = useState({
		service_name: '',
		service_description: '',
		service_price: '',
		duration: '01:00',
	});
	const [serviceFormState, setServiceFormState] = useState({
		loading: false,
		error: '',
		message: '',
	});
	const [servicesLoading, setServicesLoading] = useState(false);
	const [serviceListVersion, setServiceListVersion] = useState(0);
	const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

	const plannerDays = [
		{
			id: 'day-1',
			label: 'Vendredi',
			dayNumber: '20',
			appointments: [
				{ id: 'appt-1', service: 'Brushing', client: 'Chloé Ritel', time: '09:00 - 11:00' },
				{ id: 'appt-2', service: 'Boucle', client: 'Vanessa Trio', time: '13:00 - 15:00' },
				{ id: 'appt-3', service: 'Lissage', client: 'Rebecca Eart', time: '15:40 - 18:00' },
			],
		},
		{
			id: 'day-2',
			label: 'Samedi',
			dayNumber: '21',
			appointments: [
				{ id: 'appt-4', service: 'Coupe', client: 'Ariane Lopes', time: '10:00 - 11:30' },
				{ id: 'appt-5', service: 'Barbe', client: 'Karim Ben Ali', time: '12:30 - 13:30' },
			],
		},
		{
			id: 'day-3',
			label: 'Dimanche',
			dayNumber: '22',
			appointments: [
				{ id: 'appt-6', service: 'Soin', client: 'Mila Roussel', time: '11:00 - 12:00' },
				{ id: 'appt-7', service: 'Coloration', client: 'Zoé Lambert', time: '14:00 - 16:00' },
				{ id: 'appt-8', service: 'Lissage', client: 'Ines Martin', time: '16:30 - 18:00' },
			],
		},
	];

	const selectedPlannerDay = plannerDays[selectedDayIndex] ?? plannerDays[0];
	const dailyAppointments = selectedPlannerDay.appointments;

	const dailyStats = [
		{ label: 'Honorés', value: 11, color: '#1e1f25', textColor: '#1e1f25' },
		{ label: 'Annulés', value: 2, color: '#8f99ab', textColor: '#5d6777' },
		{ label: 'Rdv total', value: 17, color: '#c9d3e4', textColor: '#6b7485' },
	];

	const tips = [
		{ title: 'Soignez vos photos', body: 'Les prestataires avec des photos de qualité reçoivent jusqu\'à 3× plus de réservations.', img: tipsPerson },
		{ title: 'Répondez rapidement', body: 'Un temps de réponse court améliore votre positionnement dans les résultats de recherche.', img: tipsImg2 },
		{ title: 'Disponibilités à jour', body: 'Mettez à jour vos créneaux régulièrement pour rester visible et éviter les annulations.', img: tipsImg3 },
		{ title: 'Demandez des avis', body: 'Après chaque prestation, invitez vos clients à laisser un avis pour renforcer votre crédibilité.', img: tipsImg4 },
		{ title: 'Profil complet', body: 'Un profil renseigné à 100 % apparaît en priorité dans les suggestions Prestat.', img: tipsImg5 },
	];
	const [tipIndex, setTipIndex] = useState(0);
	const [statView, setStatView] = useState(0); // 0 = donut, 1 = courbe

	useEffect(() => {
		const id = window.setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 5000);
		return () => window.clearInterval(id);
	}, [tips.length]);

	const totalAppointments = dailyStats.reduce((sum, item) => sum + item.value, 0);
	const donutStops = dailyStats.reduce((accumulator, item, index) => {
		const previous = accumulator[index - 1]?.end ?? 0;
		const end = previous + (item.value / totalAppointments) * 100;
		accumulator.push({ ...item, start: previous, end });
		return accumulator;
	}, []);

	const [serviceTiles, setServiceTiles] = useState([
		{ id: 'srv-main', title: 'Brushing', price: '70€', description: '', large: true },
		{ id: 'srv-2', title: 'Coloration', price: '', description: '' },
		{ id: 'srv-3', title: 'Lissage', price: '', description: '' },
	]);

	const documentItems = [
		`FACTURE - ${companyName} - Avril.pdf`,
		`DEVIS - ${companyName} - Mai.pdf`,
	];
	function EmptyMediaPlaceholder({ label = '' }) {
		return (
			<div className="pointer-events-none flex h-full w-full items-center justify-center rounded-[inherit] bg-[linear-gradient(180deg,#f0f1f5_0%,#e1e5eb_100%)]">
				<div className="h-[54%] w-[54%] rounded-[18px] border-2 border-dashed border-black/12" />
				{label ? <span className="sr-only">{label}</span> : null}
			</div>
		);
	}

	function resetServiceForm() {
		setServiceForm({
			service_name: '',
			service_description: '',
			service_price: '',
			duration: '01:00',
		});
		setServiceFormState({ loading: false, error: '', message: '' });
		setEditingServiceId(null);
	}

	function formatDurationForBackend(value) {
		if (!value) return '';
		return value.length === 5 ? `${value}:00` : value;
	}

	function normalizeDurationInput(value) {
		if (!value) {
			return '01:00';
		}

		if (typeof value === 'string') {
			return value.slice(0, 5);
		}

		if (typeof value === 'object') {
			const hours = String(value.hours ?? value.hour ?? 1).padStart(2, '0');
			const minutes = String(value.minutes ?? value.minute ?? 0).padStart(2, '0');
			return `${hours}:${minutes}`;
		}

		return '01:00';
	}

	function formatServicePrice(value) {
		if (value === null || value === undefined || value === '') {
			return '';
		}

		const numericValue = Number(String(value).replace(',', '.'));
		if (Number.isNaN(numericValue)) {
			return `${value}€`;
		}

		const formatted = Number.isInteger(numericValue)
			? String(numericValue)
			: numericValue.toFixed(2).replace(/\.?0+$/, '');

		return `${formatted}€`;
	}

	function handleServiceFieldChange(field, value) {
		setServiceForm((current) => ({ ...current, [field]: value }));
		setServiceFormState((current) => ({ ...current, error: '', message: '' }));
	}

	function mapServicesToTiles(loadedServices) {
		return loadedServices.map((service, index) => ({
			id: service.service_id,
			title: service.service_name,
			price: formatServicePrice(service.service_price),
			description: service.service_description || '',
			duration: normalizeDurationInput(service.duration),
			large: index === 0,
		}));
	}

	useEffect(() => {
		let cancelled = false;

		async function loadProfessionalServices() {
			if (!profile?.users_id) {
				return;
			}

			setServicesLoading(true);

			try {
				const response = await fetch(`/service/${profile.users_id}/liste`, {
					credentials: 'same-origin',
				});
				const payload = await readJsonSafely(response);

				if (!response.ok || cancelled) {
					return;
				}

				const loadedServices = Array.isArray(payload?.message) ? payload.message : [];
				if (!loadedServices.length) {
					return;
				}

				setServiceTiles(mapServicesToTiles(loadedServices));
				setSelectedServiceIndex(0);
			} catch {
				// Keep current fallback cards if the list endpoint is unavailable.
			} finally {
				if (!cancelled) {
					setServicesLoading(false);
				}
			}
		}

		loadProfessionalServices();

		return () => {
			cancelled = true;
		};
	}, [profile?.users_id, serviceListVersion]);

	async function handleCreateServiceSubmit(event) {
		event.preventDefault();

		if (!serviceForm.service_name || !serviceForm.service_description || !serviceForm.service_price || !serviceForm.duration) {
			setServiceFormState({ loading: false, error: 'Renseigne tous les champs du service.', message: '' });
			return;
		}

		if (!/^\d{2}:\d{2}$/.test(serviceForm.duration)) {
			setServiceFormState({ loading: false, error: 'La durée doit être au format HH:MM.', message: '' });
			return;
		}

		setServiceFormState({ loading: true, error: '', message: '' });

		try {
			const isEditing = Boolean(editingServiceId);
			const response = await fetch(isEditing ? `/service/${editingServiceId}` : '/service/create', {
				method: isEditing ? 'PUT' : 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_name: serviceForm.service_name,
					service_description: serviceForm.service_description,
					service_price: Number(serviceForm.service_price),
					duration: formatDurationForBackend(serviceForm.duration),
				}),
			});

			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setServiceFormState({
					loading: false,
					error: payload?.message || (isEditing ? 'Impossible de modifier le service.' : 'Impossible de créer le service.'),
					message: '',
				});
				return;
			}

			setServiceFormState({
				loading: false,
				error: '',
				message: isEditing ? 'Service modifié avec succès.' : 'Service créé avec succès.',
			});
			setServiceListVersion((current) => current + 1);
			window.setTimeout(() => {
				setIsCreateServiceOpen(false);
				resetServiceForm();
			}, 500);
		} catch {
			setServiceFormState({
				loading: false,
				error: editingServiceId ? 'Erreur réseau lors de la modification du service.' : 'Erreur réseau lors de la création du service.',
				message: '',
			});
		}
	}

	function openEditServiceModal(service) {
		setEditingServiceId(service.id);
		setServiceForm({
			service_name: service.title || '',
			service_description: service.description || '',
			service_price: service.price ? String(service.price).replace(/[^0-9.,]/g, '').replace(',', '.') : '',
			duration: normalizeDurationInput(service.duration),
		});
		setServiceFormState({ loading: false, error: '', message: '' });
		setIsCreateServiceOpen(true);
	}

	function showPreviousService() {
		setSelectedServiceIndex((current) => {
			if (serviceTiles.length <= 1) return current;
			return current === 0 ? serviceTiles.length - 1 : current - 1;
		});
	}

	function showNextService() {
		setSelectedServiceIndex((current) => {
			if (serviceTiles.length <= 1) return current;
			return current === serviceTiles.length - 1 ? 0 : current + 1;
		});
	}

	const selectedService = serviceTiles[selectedServiceIndex] ?? serviceTiles[0] ?? null;
	const previewServices = serviceTiles.length <= 1
		? []
		: Array.from({ length: Math.min(2, serviceTiles.length - 1) }, (_, offset) => {
			const index = (selectedServiceIndex + offset + 1) % serviceTiles.length;
			return serviceTiles[index];
		});

	useEffect(() => {
		function handlePopState() {
			startTransition(() => {
				setActiveProfessionalTab(getProfessionalTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	function showPreviousPlannerDay() {
		setSelectedDayIndex((current) => (current === 0 ? plannerDays.length - 1 : current - 1));
	}

	function showNextPlannerDay() {
		setSelectedDayIndex((current) => (current === plannerDays.length - 1 ? 0 : current + 1));
	}

	function handleProfessionalSidebarNavigation(href) {
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfessionalTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			window.location.href = targetUrl.toString();
			return;
		}

		if (nextTab === activeProfessionalTab) {
			return;
		}

		window.history.pushState({}, '', `${targetUrl.pathname}${targetUrl.search}`);
		startTransition(() => {
			setActiveProfessionalTab(nextTab);
		});
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#181818]">
			<div className="grid min-h-screen grid-cols-[202px_1fr]">
				<aside className="flex h-screen flex-col border-r border-black/6 bg-[rgba(255,255,255,0.72)]">
					<div className="flex h-[132px] items-center justify-center border-b border-black/6 px-6">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition hover:opacity-80">
							<img src={prestatLogo} alt="Prestat" className="w-[126px]" />
						</a>
					</div>

					<nav className="flex flex-1 flex-col px-7 pb-8 pt-10">
						<div className="space-y-5">
							<SidebarLink href="/app/profil/professionnel" active={activeProfessionalTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleProfessionalSidebarNavigation} tone="light">
								Dashboard
							</SidebarLink>
							<SidebarLink href="/app/profil/professionnel" icon={BookmarkOutlineIcon} tone="light">
								Favoris
							</SidebarLink>
							<SidebarLink href="/app/profil/professionnel" icon={DocumentIcon} tone="light">
								Documents
							</SidebarLink>
						</div>

						<div className="mt-auto space-y-5">
							<SidebarLink href="/app/profil/professionnel?tab=profile" active={activeProfessionalTab === 'profile'} icon={UserIcon} onNavigate={handleProfessionalSidebarNavigation} tone="light">
								Profil
							</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=settings" active={activeProfessionalTab === 'settings'} icon={SettingsIcon} onNavigate={handleProfessionalSidebarNavigation} tone="light">
								Paramètres
							</SidebarLink>
							<SidebarLink href="/deconnexion/client" icon={LogoutIcon} tone="light">
								Déconnexion
							</SidebarLink>
							<SidebarLink href="#" icon={HelpIcon} tone="light">
								Contact
							</SidebarLink>
						</div>
					</nav>
				</aside>

				<div className="min-w-0">
					<header className="flex h-[132px] items-center justify-between border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-9 backdrop-blur-sm">
						<div>
							<h1 className="text-[3rem] font-semibold tracking-[-0.05em] text-[#1a1a1a]">Dashboard</h1>
							<p className="mt-1 text-[1.05rem] text-black/72">Bienvenue, {displayName}</p>
							<div className="mt-1 flex items-center gap-3">
								<p className="text-[1rem] font-semibold uppercase tracking-[0.02em] text-[#171717]">{companyName}</p>
								<span className="inline-flex items-center gap-2 text-[0.9rem] text-black/42">
									<VerifiedBadge className="h-[18px] w-[18px] shrink-0" />
									utilisateur vérifié
								</span>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative flex h-14 w-14 items-center justify-center rounded-[16px] border border-black/8 bg-white text-[#151515] shadow-[0_12px_24px_rgba(20,20,20,0.05)]">
								<BellOutlineIcon className="h-6 w-6" />
								<span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#ff4f4f]" />
							</div>
							<button
								type="button"
								onClick={() => setIsCreateServiceOpen(true)}
								className="flex items-center gap-3 rounded-[16px] bg-[#101010] px-6 py-4 text-[1rem] font-semibold text-white shadow-[0_16px_32px_rgba(10,10,10,0.14)]"
							>
								<PlusCircleIcon className="h-6 w-6 text-white" />
								<span>Ajouter un service</span>
							</button>
						</div>
					</header>

					{activeProfessionalTab === 'profile' ? (
						<ProfessionalProfile
							profile={profile}
							serviceTiles={serviceTiles}
							onAddService={() => setIsCreateServiceOpen(true)}
							onEditService={openEditServiceModal}
						/>
					) : (
					<section className="px-9 pb-10 pt-9">

						{/* ── Rangée 1 : Planner · Stats · Astuces ── */}
						<div className="mb-8 grid gap-5 lg:grid-cols-3" style={{ gridAutoRows: '460px' }}>

							{/* 1. Planner */}
							<Reveal from="bottom" className="h-full">
								<button
									type="button"
									onClick={() => setIsDayPlannerOpen(true)}
									className="flex h-full w-full flex-col rounded-[26px] border border-black/6 bg-[linear-gradient(180deg,#fafafa_0%,#f1f3f7_100%)] p-6 text-left shadow-[0_16px_34px_rgba(17,19,30,0.05)] transition hover:-translate-y-px hover:shadow-[0_18px_36px_rgba(17,19,30,0.08)]"
								>
									{/* En-tête : jour */}
									<div className="mb-5">
										<p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black/36">
											{selectedPlannerDay.label}
										</p>
										<p className="mt-0.5 text-[3.8rem] font-semibold leading-none tracking-[-0.04em] text-[#17181d]">
											{selectedPlannerDay.dayNumber}
										</p>
									</div>

									{/* Cartes RDV en colonne */}
									<div className="flex flex-1 flex-col justify-center gap-2.5">
										{dailyAppointments.slice(0, 4).map((appointment, index) => (
											<div
												key={appointment.id}
												className={`flex items-center justify-between rounded-[14px] px-4 py-3 ${
													index % 3 === 1
														? 'bg-[#17181d] text-white'
														: 'border border-black/8 bg-white text-[#1f2024]'
												}`}
											>
												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<span className={`h-2 w-2 shrink-0 rounded-full ${index % 3 === 1 ? 'bg-white/60' : 'bg-[#1a1b20]'}`} />
														<p className={`truncate text-[0.78rem] font-semibold ${index % 3 === 1 ? 'text-white/60' : 'text-black/42'}`}>
															{appointment.service}
														</p>
													</div>
													<p className="mt-1 truncate pl-4 text-[0.92rem] font-semibold">{appointment.client}</p>
												</div>
												<p className={`ml-3 shrink-0 text-[0.82rem] ${index % 3 === 1 ? 'text-white/54' : 'text-black/44'}`}>
													{appointment.time}
												</p>
											</div>
										))}
									</div>

									{/* Navigation */}
									<div className="mt-4 flex items-center justify-end border-t border-black/5 pt-4">
										<div className="flex gap-2">
											<button
												type="button"
												onClick={(event) => { event.stopPropagation(); showPreviousPlannerDay(); }}
												className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5"
												aria-label="Jour précédent"
											>
												<ChevronIcon direction="left" className="h-3.5 w-3.5" />
											</button>
											<button
												type="button"
												onClick={(event) => { event.stopPropagation(); showNextPlannerDay(); }}
												className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5"
												aria-label="Jour suivant"
											>
												<ChevronIcon className="h-3.5 w-3.5" />
											</button>
										</div>
									</div>
								</button>
							</Reveal>

							{/* 2. Statistiques */}
							<Reveal from="bottom" delay={80} className="h-full">
								<div className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-black/36">Statistiques</p>
											<h3 className="mt-1 text-[1.1rem] font-semibold tracking-[-0.03em] text-[#171717]">
												{statView === 0 ? 'Rendez-vous du mois' : 'Évolution annuelle'}
											</h3>
										</div>
										<div className="shrink-0 rounded-full bg-[#f4f5f7] px-3 py-1 text-[0.78rem] font-medium text-black/44">
											{totalAppointments} au total
										</div>
									</div>

									{/* Vue 0 — Donut + légende à droite */}
									{statView === 0 ? (
										<div className="flex min-h-0 flex-1 items-center justify-center gap-6 overflow-hidden py-4">
											<div
												className="shrink-0 flex items-center justify-center rounded-full"
												style={{
													width: 140, height: 140,
													background: `conic-gradient(${donutStops.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})`,
												}}
											>
												<div className="flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-white text-center">
													<span className="text-[1.7rem] font-semibold leading-none text-[#1b1917]">{totalAppointments}</span>
													<span className="text-[0.62rem] uppercase tracking-[0.10em] text-black/40">Rdv</span>
												</div>
											</div>
											<div className="flex flex-col gap-3">
												{dailyStats.map((item) => (
													<div key={item.label} className="flex items-center gap-2.5">
														<span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
														<div>
															<p className="text-[0.82rem] font-medium text-[#2a2c31]">{item.label}</p>
															<p className="text-[1rem] font-semibold" style={{ color: item.textColor }}>{item.value}</p>
														</div>
													</div>
												))}
											</div>
										</div>
									) : (
										/* Vue 1 — Courbe annuelle */
										<div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-3">
											<svg viewBox="0 0 280 140" className="w-full" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
												{/* Grilles horizontales */}
												{[0,1,2,3,4].map((i) => (
													<line key={i} x1="32" y1={12 + i * 26} x2="276" y2={12 + i * 26}
														stroke="#e8eaed" strokeWidth="1" />
												))}
												{/* Labels Y */}
												{[250,200,150,100,50,0].map((v, i) => (
													<text key={v} x="28" y={15 + i * 22} textAnchor="end"
														fontSize="8" fill="#9ca3af">{v}</text>
												))}
												{/* Courbe */}
												{(() => {
													const pts = [18,35,52,68,90,108,125,148,185,210,235,248];
													const maxV = 250;
													const xs = pts.map((_, i) => 36 + i * 21.8);
													const ys = pts.map(v => 12 + (1 - v / maxV) * 104);
													const d = pts.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
													const area = `${d} L${xs[11].toFixed(1)},116 L${xs[0].toFixed(1)},116 Z`;
													return (
														<>
															<defs>
																<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
																	<stop offset="0%" stopColor="#1d9bf0" stopOpacity="0.18" />
																	<stop offset="100%" stopColor="#1d9bf0" stopOpacity="0" />
																</linearGradient>
															</defs>
															<path d={area} fill="url(#areaGrad)" />
															<path d={d} fill="none" stroke="#1d9bf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
															{pts.map((_, i) => (
																<circle key={i} cx={xs[i].toFixed(1)} cy={ys[i].toFixed(1)} r="3" fill="#1d9bf0" />
															))}
														</>
													);
												})()}
												{/* Labels X */}
												{['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].map((m, i) => (
													<text key={m} x={(36 + i * 21.8).toFixed(1)} y="130" textAnchor="middle"
														fontSize="7.5" fill="#9ca3af">{m}</text>
												))}
											</svg>
										</div>
									)}

									{/* Navigation */}
									<div className="mt-3 flex items-center justify-between border-t border-black/5 pt-4">
										<p className="text-[0.78rem] text-black/36">{statView === 0 ? '1/2' : '2/2'}</p>
										<div className="flex gap-2">
											<button type="button" onClick={() => setStatView(0)}
												className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 0 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`}
												aria-label="Vue camembert">
												<ChevronIcon direction="left" className="h-3.5 w-3.5" />
											</button>
											<button type="button" onClick={() => setStatView(1)}
												className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 1 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`}
												aria-label="Vue courbe">
												<ChevronIcon className="h-3.5 w-3.5" />
											</button>
										</div>
									</div>
								</div>
							</Reveal>

							{/* 3. Astuces */}
							<Reveal from="bottom" delay={160} className="h-full">
								<div className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#101114_0%,#14161a_100%)] shadow-[0_16px_34px_rgba(17,19,30,0.22)] text-white">

									{/* Images — cross-fade, centrées, grandes */}
									<div className="relative min-h-0 flex-1 overflow-hidden">
										<div className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-[radial-gradient(circle_at_55%_18%,rgba(255,176,84,0.32)_0%,rgba(255,176,84,0.12)_18%,rgba(255,176,84,0)_54%)]" />
										{tips.map((tip, i) => (
											<img
												key={tip.img}
												src={tip.img}
												alt=""
												aria-hidden="true"
												className="absolute inset-0 mx-auto h-full w-full object-contain object-center transition-opacity duration-700"
												style={{ opacity: i === tipIndex ? 1 : 0 }}
											/>
										))}
										{/* Fondu en bas vers la zone texte */}
										<div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,rgba(15,16,18,0)_0%,rgba(15,16,18,0.98)_100%)]" />
									</div>

									{/* Texte — positionné au bas */}
									<div className="px-7 pb-7 pt-0">
										<p className="text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-white/32">
											Astuce Prestat
										</p>
										<div key={tipIndex} className="animate-[viewFade_400ms_ease_both]">
											<h4 className="mt-2.5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
												{tips[tipIndex].title}
											</h4>
											<p className="mt-2.5 text-[0.95rem] leading-[1.65] text-white/54">
												{tips[tipIndex].body}
											</p>
										</div>
										<div className="mt-5 flex items-center justify-between">
											<div className="flex items-center gap-1.5">
												{tips.map((_, i) => (
													<button
														key={i}
														type="button"
														onClick={() => setTipIndex(i)}
														aria-label={`Astuce ${i + 1}`}
														className={`h-[3px] rounded-full transition-all duration-300 ${
															i === tipIndex ? 'w-6 bg-white' : 'w-[6px] bg-white/22'
														}`}
													/>
												))}
											</div>
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => setTipIndex((i) => (i - 1 + tips.length) % tips.length)}
													className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 transition hover:bg-white/18"
													aria-label="Astuce précédente"
												>
													<ChevronIcon direction="left" className="h-3.5 w-3.5" />
												</button>
												<button
													type="button"
													onClick={() => setTipIndex((i) => (i + 1) % tips.length)}
													className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 transition hover:bg-white/18"
													aria-label="Astuce suivante"
												>
													<ChevronIcon className="h-3.5 w-3.5" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</Reveal>
						</div>

						{/* ── Rangée 2 : Services · Documents · Nouveautés ── */}
						<div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)_minmax(0,1fr)]">
							<Reveal from="bottom" delay={130} className="h-full">
								<section className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-7 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
										<div className="mb-6 flex items-center justify-between">
											<h2 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-[#161616]">Services</h2>
											<div className="flex items-center gap-4 text-[#161616]">
												<button type="button" onClick={showPreviousService} className="transition hover:opacity-70" aria-label="Service précédent">
													<ChevronIcon direction="left" className="h-6 w-6" />
												</button>
												<button type="button" onClick={showNextService} className="transition hover:opacity-70" aria-label="Service suivant">
													<ChevronIcon className="h-6 w-6" />
												</button>
												<button
													type="button"
													onClick={() => setIsServicesPanelOpen(true)}
													className="transition hover:opacity-70"
													aria-label="Afficher tous les services"
												>
													<DashboardIcon className="h-5 w-5" />
												</button>
											</div>
										</div>

										<div className="grid flex-1 gap-4 grid-cols-[1fr_160px]">
											<div className="relative min-h-[290px] overflow-hidden rounded-[22px] border border-black/6 bg-[#ebeef4]">
												<img
													src={favoritesPlaceholder}
													alt="Illustration du service principal"
													className="absolute inset-0 h-full w-full object-cover"
												/>
												<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(18,18,18,0.02)_50%,rgba(10,10,10,0.18)_100%)]" />
												<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,rgba(22,22,24,0.02)_0%,rgba(18,18,20,0.28)_24%,rgba(14,14,16,0.56)_55%,rgba(10,10,12,0.8)_100%)] backdrop-blur-[4px]" />
												<div className="absolute inset-x-0 bottom-0 z-[1] grid gap-6 px-7 pb-5 pt-8 text-white md:grid-cols-[190px_minmax(0,1fr)] md:items-end">
													<div className="self-end">
														<p className="text-[1.1rem] font-medium leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
															{selectedService?.title || 'Service'}
														</p>
														<p className="mt-1 text-[3.15rem] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
															{selectedService?.price || '--'}
														</p>
														<button
															type="button"
															onClick={() => selectedService && openEditServiceModal(selectedService)}
															className="mt-4 rounded-full bg-white px-4 py-1.5 text-[0.82rem] font-semibold text-[#151515] shadow-[0_10px_22px_rgba(17,19,30,0.16)] transition hover:-translate-y-px"
														>
															Modifier
														</button>
													</div>
													{selectedService?.description ? (
														<div className="flex min-h-[128px] items-start pt-1">
															<p
																className="max-w-[44ch] overflow-hidden text-[0.84rem] leading-7 text-white/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)] md:text-[0.92rem]"
																style={{
																	display: '-webkit-box',
																	WebkitLineClamp: 4,
																	WebkitBoxOrient: 'vertical',
																}}
															>
																{selectedService.description}
															</p>
														</div>
													) : (
														<div className="min-h-[128px]" />
													)}
												</div>
											</div>

											<div className="grid gap-4">
												{previewServices.map((tile) => (
													<button
														key={tile.id}
														type="button"
														onClick={() => setSelectedServiceIndex(serviceTiles.findIndex((service) => service.id === tile.id))}
														className="relative min-h-[136px] overflow-hidden rounded-[18px] border border-black/6 bg-[#ebeef4] text-left transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(17,19,30,0.12)]"
													>
														<img src={favoritesPlaceholder} alt={tile.title} className="absolute inset-0 h-full w-full object-cover" />
														<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(18,18,18,0.02)_48%,rgba(10,10,10,0.16)_100%)]" />
														<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,rgba(20,20,22,0.08)_0%,rgba(15,15,17,0.32)_38%,rgba(10,10,12,0.58)_100%)] backdrop-blur-[2px]" />
														<p className="absolute bottom-3 left-4 right-4 z-[1] text-[1rem] font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">{tile.title}</p>
													</button>
												))}
											</div>
										</div>
										{servicesLoading ? <p className="mt-4 text-[0.9rem] text-black/42">Chargement des services…</p> : null}
								</section>
							</Reveal>

							{/* Documents */}
							<Reveal from="bottom" delay={200} className="h-full">
								<aside className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
									<div className="mb-5 flex items-center justify-between">
										<h3 className="text-[1.15rem] font-semibold text-[#171717]">Documents</h3>
										<DocumentIcon className="h-5 w-5 text-black/38" />
									</div>
									<div className="flex flex-1 flex-col gap-3">
										{documentItems.map((item) => (
											<div key={item} className="flex items-center gap-3 rounded-[16px] bg-[#f6f7f9] px-4 py-3">
												<img src={pdfFileIcon} alt="PDF" className="h-5 w-5 shrink-0 object-contain" />
												<p className="min-w-0 flex-1 truncate text-[0.88rem] text-[#232323]">{item}</p>
											</div>
										))}
									</div>
								</aside>
							</Reveal>

							{/* Dernières nouvelles */}
							<Reveal from="bottom" delay={260} className="h-full">
								<aside className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
									<div className="mb-5 flex items-center justify-between">
										<h3 className="text-[1.15rem] font-semibold text-[#171717]">Dernières nouvelles</h3>
										<span className="rounded-full bg-[#0a0a0a] px-2.5 py-0.5 text-[0.72rem] font-medium text-white">Nouveau</span>
									</div>
									<div className="flex flex-1 flex-col justify-between gap-3">
										{newsItems.slice(0, 2).map((item) => (
											<NewsCard key={item.title} item={item} />
										))}
									</div>
									<button
										type="button"
										onClick={() => setIsNewsOpen(true)}
										className="mt-4 w-full rounded-[14px] border border-black/8 py-2.5 text-[0.85rem] font-medium text-black/50 transition hover:bg-black/4 hover:text-black/70"
									>
										Tout voir
									</button>
								</aside>
							</Reveal>
						</div>
					</section>
					)}
				</div>
			</div>
			{isDayPlannerOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,15,13,0.32)] px-6 backdrop-blur-[3px]">
					<div className="w-full max-w-[720px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Planning du jour</p>
								<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">
									{selectedPlannerDay.label} {selectedPlannerDay.dayNumber}
								</h2>
							</div>
							<button
								type="button"
								onClick={() => setIsDayPlannerOpen(false)}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>
						<div className="mt-6 space-y-3">
							{dailyAppointments.map((appointment) => (
								<div key={appointment.id} className="grid gap-3 rounded-[18px] border border-black/6 bg-[#f8f8fa] px-5 py-4 md:grid-cols-[120px_1fr_auto] md:items-center">
									<div className="text-[1rem] font-semibold text-black/48">{appointment.service}</div>
									<div>
										<p className="text-[1.05rem] font-semibold text-[#171717]">{appointment.client}</p>
										<p className="mt-1 text-[0.94rem] text-black/54">{appointment.time}</p>
									</div>
									<span className="rounded-full bg-[#eef1f5] px-3 py-1 text-[0.82rem] font-medium text-[#5b6574]">Confirmé</span>
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
			{isNewsOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,15,13,0.32)] px-6 backdrop-blur-[3px]">
					<div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="mb-6 flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
								<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Dernières nouvelles</h2>
							</div>
							<button
								type="button"
								onClick={() => setIsNewsOpen(false)}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>
						<div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
							{newsItems.map((item) => (
								<NewsCard key={item.title} item={item} />
							))}
						</div>
					</div>
				</div>
			) : null}
			{isServicesPanelOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,15,13,0.32)] px-6 backdrop-blur-[3px]">
					<div className="w-full max-w-[760px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="mb-6 flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
								<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Tous les services</h2>
							</div>
							<button
								type="button"
								onClick={() => setIsServicesPanelOpen(false)}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>
						<div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
							{serviceTiles.map((service, index) => (
								<div
									key={service.id}
									className={`flex items-center justify-between gap-4 rounded-[18px] border px-5 py-4 ${
										index === selectedServiceIndex ? 'border-black/14 bg-[#f6f7f9]' : 'border-black/6 bg-white'
									}`}
								>
									<button
										type="button"
										onClick={() => {
											setSelectedServiceIndex(index);
											setIsServicesPanelOpen(false);
										}}
										className="min-w-0 flex-1 text-left"
									>
										<div className="flex items-center gap-3">
											<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#17181d]" />
											<p className="truncate text-[1rem] font-semibold text-[#171717]">{service.title}</p>
										</div>
										<div className="mt-1 flex items-center gap-3 pl-[22px]">
											<span className="text-[0.92rem] font-medium text-black/56">{service.price || '--'}</span>
											{service.duration ? <span className="text-[0.88rem] text-black/38">{service.duration}</span> : null}
										</div>
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedServiceIndex(index);
											setIsServicesPanelOpen(false);
											openEditServiceModal(service);
										}}
										className="shrink-0 rounded-full bg-[#101010] px-4 py-2 text-[0.84rem] font-semibold text-white transition hover:opacity-90"
									>
										Modifier
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
			{isCreateServiceOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,19,30,0.24)] px-6 backdrop-blur-[3px]">
					<div className="w-full max-w-[680px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">
									{editingServiceId ? 'Modifier un service' : 'Nouveau service'}
								</p>
								<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">
									{editingServiceId ? 'Modifier le service' : 'Ajouter un service'}
								</h2>
							</div>
							<button
								type="button"
								onClick={() => {
									setIsCreateServiceOpen(false);
									resetServiceForm();
								}}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>

						<form className="mt-7 grid gap-5" onSubmit={handleCreateServiceSubmit}>
							<label className="flex flex-col gap-2">
								<span className="text-[0.94rem] font-medium text-[#171717]">Nom du service</span>
								<input
									type="text"
									value={serviceForm.service_name}
									onChange={(event) => handleServiceFieldChange('service_name', event.target.value)}
									className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white"
									placeholder="Ex: Brushing"
								/>
							</label>

							<label className="flex flex-col gap-2">
								<span className="text-[0.94rem] font-medium text-[#171717]">Description</span>
								<textarea
									value={serviceForm.service_description}
									onChange={(event) => handleServiceFieldChange('service_description', event.target.value)}
									className="min-h-[132px] rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 py-3 outline-none transition focus:border-black/18 focus:bg-white"
									placeholder="Décris la prestation proposée"
								/>
							</label>

							<div className="grid gap-5 md:grid-cols-2">
								<label className="flex flex-col gap-2">
									<span className="text-[0.94rem] font-medium text-[#171717]">Prix</span>
									<input
										type="number"
										min="0"
										step="0.01"
										value={serviceForm.service_price}
										onChange={(event) => handleServiceFieldChange('service_price', event.target.value)}
										className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white"
										placeholder="70"
									/>
								</label>

								<label className="flex flex-col gap-2">
									<span className="text-[0.94rem] font-medium text-[#171717]">Durée</span>
									<div className="flex items-center gap-3">
										<input
											type="text"
											inputMode="numeric"
											maxLength={2}
											value={serviceForm.duration.split(':')[0]}
											onChange={(event) => {
												const hours = event.target.value.replace(/\D/g, '').slice(0, 2);
												const minutes = serviceForm.duration.split(':')[1] || '00';
												handleServiceFieldChange('duration', `${hours.padStart(hours.length || 1, '0')}:${minutes}`);
											}}
											className="h-12 w-20 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 text-center outline-none transition focus:border-black/18 focus:bg-white"
											placeholder="01"
										/>
										<span className="text-[1.2rem] font-semibold text-black/52">:</span>
										<input
											type="text"
											inputMode="numeric"
											maxLength={2}
											value={serviceForm.duration.split(':')[1]}
											onChange={(event) => {
												const minutes = event.target.value.replace(/\D/g, '').slice(0, 2);
												const hours = serviceForm.duration.split(':')[0] || '00';
												handleServiceFieldChange('duration', `${hours}:${minutes.padStart(minutes.length || 1, '0')}`);
											}}
											className="h-12 w-20 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 text-center outline-none transition focus:border-black/18 focus:bg-white"
											placeholder="00"
										/>
									</div>
									<p className="text-[0.82rem] text-black/42">Heures et minutes, avec `:` fixe.</p>
								</label>
							</div>

							{serviceFormState.error ? <p className="text-[0.94rem] font-medium text-[#c35555]">{serviceFormState.error}</p> : null}
							{serviceFormState.message ? <p className="text-[0.94rem] font-medium text-[#1f6b3b]">{serviceFormState.message}</p> : null}

							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => {
										setIsCreateServiceOpen(false);
										resetServiceForm();
									}}
									className="rounded-[14px] border border-black/10 px-5 py-3 text-[0.94rem] font-medium text-black/58 transition hover:border-black/18 hover:text-black"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={serviceFormState.loading}
									className={`rounded-[14px] px-5 py-3 text-[0.94rem] font-semibold text-white ${
										serviceFormState.loading ? 'bg-black/30' : 'bg-[#101010]'
									}`}
								>
									{serviceFormState.loading ? (editingServiceId ? 'Modification…' : 'Création…') : (editingServiceId ? 'Enregistrer les modifications' : 'Créer le service')}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
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
		return <ProfessionalDashboardShell profile={state.profile} />;
	}

	function handleClientProfileUpdated(nextProfile) {
		setState((current) => ({
			...current,
			profile: nextProfile,
		}));
	}

	return <DashboardShell profile={state.profile} reservations={state.reservations} onProfileUpdated={handleClientProfileUpdated} />;
}
