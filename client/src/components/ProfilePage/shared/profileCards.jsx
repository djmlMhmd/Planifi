import { useState } from 'react';
import pdfFileIcon from '../../../assets/pdf-file-icon.png';
import { ArrowRightCircle, BookmarkIcon, ProviderAvatar } from './profileIcons';

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

export function ClientReviewCard({ title, onLeaveReview }) {
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
						onClick={() => onLeaveReview?.(title)}
						className="mt-4 text-sm font-medium text-[#5a5a5a] transition hover:text-[#0a0a0a]"
					>
						&gt; Laisser un avis
					</button>
				</div>
			</div>
		</div>
	);
}

function getReservationUiStatus(reservation) {
	const reservationStatus = reservation.status || 'confirmed';

	if (reservationStatus === 'cancelled_by_pro') {
		return 'cancelledByPro';
	}

	if (reservationStatus === 'cancelled_by_client') {
		return 'cancelledByClient';
	}

	if (!reservation.start_at || !reservation.end_at) {
		return 'upcoming';
	}

	const now = new Date();
	const eventStart = new Date(reservation.start_at);
	const eventEnd = new Date(reservation.end_at);
	const todayKey = now.toISOString().slice(0, 10);
	const eventDayKey = reservation.start_at.slice(0, 10);

	if (eventDayKey === todayKey) {
		return 'today';
	}

	if (eventEnd < now) {
		return 'past';
	}

	if (eventStart < now && eventEnd >= now) {
		return 'today';
	}

	return 'upcoming';
}

function getReservationUiMeta(uiStatus) {
	switch (uiStatus) {
		case 'today':
			return {
				label: "Aujourd'hui",
				accentClassName: 'bg-[var(--accent-mauve)]',
				textClassName: 'text-[var(--accent-mauve)]',
			};
		case 'past':
			return {
				label: 'Terminé',
				accentClassName: 'bg-[#3f9a73]',
				textClassName: 'text-[#2f7e5d]',
			};
		case 'cancelledByPro':
			return {
				label: 'Annulé par le prestataire',
				accentClassName: 'bg-[#d85b68]',
				textClassName: 'text-[#b84a57]',
			};
		case 'cancelledByClient':
			return {
				label: 'Annulé',
				accentClassName: 'bg-[#ef9b59]',
				textClassName: 'text-[#c97731]',
			};
		default:
			return {
				label: 'À venir',
				accentClassName: 'bg-[#66a493]',
				textClassName: 'text-[#417b6b]',
			};
	}
}

export function ReservationItem({ reservation }) {
	const [isOpen, setIsOpen] = useState(false);
	const dateLabel = reservation.date_label || reservation.start || '--';
	const timeLabel = reservation.time_label || '';
	const statusLabel = reservation.status_label || reservation.state_label;
	const reservationStatus = getReservationUiStatus(reservation);
	const statusMeta = getReservationUiMeta(reservationStatus);
	const providerName = reservation.title || reservation.provider_name || 'Prestataire';
	const serviceMode = reservation.mode_label || reservation.service_mode || 'En présentiel';
	const locationLabel = reservation.location || reservation.address || reservation.company_address || 'Adresse communiquée après confirmation';
	const reservationReference = reservation.reference || `RDV-${String(reservation.reservation_id || '').slice(-6) || '000001'}`;
	const detailSummary =
		reservation.detail_summary ||
		reservation.description ||
		`${providerName} vous reçoit pour ${reservation.service_name?.toLowerCase() || 'ce rendez-vous'}. ${
			reservationStatus === 'past'
				? 'Ce créneau est maintenant terminé.'
				: reservationStatus === 'today'
					? "Votre rendez-vous est prévu aujourd'hui."
					: 'Retrouvez ici les informations utiles avant le rendez-vous.'
		}`;

	return (
		<div className="border-b border-black/6 py-2.5 last:border-b-0">
			<button
				type="button"
				onClick={() => setIsOpen((current) => !current)}
				className="flex w-full items-center gap-3 rounded-[18px] px-2 py-2 text-left transition hover:bg-black/[0.018]"
				aria-expanded={isOpen}
			>
				<div className={`h-[70px] w-1 shrink-0 rounded-none ${statusMeta.accentClassName}`} aria-hidden="true" />
				<div className="shrink-0 pt-1">
					<ProviderAvatar size="h-11 w-11" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[1.02rem] font-semibold leading-5 text-[#171717]">{reservation.service_name}</p>
					<p className="mt-1 truncate text-[0.92rem] text-black/48">{providerName}</p>
					<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-black/38">
						<span className="font-semibold text-black/68">{dateLabel}</span>
						{timeLabel ? <span>{timeLabel}</span> : null}
					</div>
				</div>
				<ArrowRightCircle className={`h-6 w-6 shrink-0 text-[#0f0f12] transition duration-200 ${isOpen ? 'rotate-90 opacity-70' : ''}`} />
			</button>

			<div className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
				<div className="overflow-hidden">
					<div className="mr-2 mt-2 rounded-[18px] border border-black/7 bg-[linear-gradient(180deg,rgba(243,240,234,0.96)_0%,rgba(238,234,227,0.98)_100%)] px-4 py-4 text-[#181818] shadow-[0_10px_24px_rgba(17,19,30,0.045)] sm:ml-5">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/8 pb-3 text-[0.82rem]">
							<span className={`font-semibold ${statusMeta.textClassName}`}>{statusLabel || statusMeta.label}</span>
							<span className="text-black/24">•</span>
							<span className="text-black/62">{serviceMode}</span>
							<span className="text-black/24">•</span>
							<span className="font-medium text-black/72">{reservationReference}</span>
						</div>

						<div className="grid gap-3 pt-3 text-[0.84rem]">
							<div className="grid gap-1 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-3">
								<span className="font-semibold uppercase tracking-[0.08em] text-black/34">Lieu</span>
								<span className="text-black/66">{locationLabel}</span>
							</div>

							<div className="grid gap-1 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-3">
								<span className="font-semibold uppercase tracking-[0.08em] text-black/34">Note</span>
								<p className="leading-6 text-black/68">{detailSummary}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function formatDocumentAmount(value) {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
	}).format(Number(value) || 0);
}

export function InvoiceItem({ document, kind = 'invoice' }) {
	const isQuote = kind === 'quote';
	const badgeLabel = isQuote ? 'Voir' : 'Télécharger';
	const helperLabel = isQuote ? 'En attente de validation' : 'PDF disponible';
	const displayTitle = document?.number && document?.title
		? `${document.number} · ${document.title}`
		: document?.title || document?.number || 'Document PDF';
	const displaySubtitle = document?.subtitle || helperLabel;

	return (
		<div className={`flex items-center gap-3 rounded-[14px] px-3 py-3 ${isQuote ? 'bg-white text-black/62' : 'text-black/62'}`}>
			<img src={pdfFileIcon} alt="PDF" className="h-5 w-5 shrink-0 object-contain" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[0.88rem]">{displayTitle}</p>
				<p className={`mt-1 truncate text-[0.72rem] ${isQuote ? 'text-[var(--accent-mauve)]' : 'text-black/36'}`}>
					{displaySubtitle}
				</p>
			</div>
			<div className="flex items-center gap-2">
				{document?.total ? (
					<span className="hidden text-[0.75rem] font-medium text-black/42 sm:inline">
						{formatDocumentAmount(document.total)}
					</span>
				) : null}
				<span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] ${isQuote ? 'bg-[var(--accent-mauve-soft)] text-[var(--accent-mauve)]' : 'bg-black/5 text-black/45'}`}>
					{badgeLabel}
				</span>
			</div>
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
