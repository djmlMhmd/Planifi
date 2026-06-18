import { useEffect, useState } from 'react';
import providerUserPlaceholder from '../../../assets/provider-user-placeholder.png';

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
