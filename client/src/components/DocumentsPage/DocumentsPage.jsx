import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import pdfFileIcon from '../../assets/pdf-file-icon.png';
import prestatLogo from '../../assets/prestat-logo.svg';
import { navigateTo } from '../../lib/navigation';

function formatMoney(value) {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
	}).format(Number(value) || 0);
}

function formatDisplayDate(dateValue) {
	return new Intl.DateTimeFormat('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(dateValue);
}

function addDays(dateValue, amount) {
	const next = new Date(dateValue);
	next.setDate(next.getDate() + amount);
	return next;
}

function DownloadIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M12 4V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M5 18H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

async function loadImageAsDataUrl(src) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				const context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);
				resolve(canvas.toDataURL('image/png'));
			} catch (error) {
				reject(error);
			}
		};
		image.onerror = reject;
		image.src = src;
	});
}

function buildFallbackReservation(profile, isProfessional) {
	const today = new Date();

	return {
		reservation_id: 1,
		professional_id: profile?.users_id || 1,
		service_id: 1,
		service_name: 'Coupe & Brushing',
		client_name: 'Test Client',
		client_email: 'client@test.com',
		company_name: profile?.company_name || 'Prestat Studio',
		title: profile?.company_name || 'Prestat Studio',
		professional_name: profile?.company_name || 'Prestat Studio',
		date_label: formatDisplayDate(today),
		time_label: '14:00 - 15:00',
		start_at: `${today.toISOString().slice(0, 10)}T14:00:00`,
		status: isProfessional ? 'confirmed' : 'confirmed',
	};
}

function buildServicePriceMap(serviceRows) {
	return new Map(
		(serviceRows || []).map((service) => [
			String(service.service_id),
			{
				price: Number(service.service_price) || 0,
				description: service.service_description || '',
				duration: service.duration || '',
			},
		])
	);
}

function buildDocumentFromReservation({
	type,
	index,
	isProfessional,
	profile,
	reservation,
	servicePriceMap,
}) {
	const reservationDate = reservation?.start_at ? new Date(reservation.start_at) : new Date();
	const providerName = isProfessional
		? profile.company_name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
		: reservation.company_name || reservation.professional_name || 'Prestataire';
	const clientName = isProfessional
		? reservation.client_name || reservation.title || 'Client'
		: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Client';
	const clientEmail = isProfessional
		? reservation.client_email || 'client@test.com'
		: profile.email || 'client@test.com';
	const serviceMeta = servicePriceMap.get(String(reservation.service_id)) || {};
	const unitPrice = serviceMeta.price || (type === 'quote' ? 95 : 85);
	const quantity = 1;
	const total = unitPrice * quantity;
	const documentPrefix = type === 'invoice' ? 'FAC' : 'DEV';
	const documentNumber = `${documentPrefix}-${reservationDate.getFullYear()}-${String(reservation.reservation_id || index + 1).padStart(4, '0')}`;

	return {
		id: `${type}-${reservation.reservation_id || index + 1}`,
		type,
		typeLabel: type === 'invoice' ? 'Facture' : 'Devis',
		statusLabel: type === 'invoice' ? 'Payée' : 'En attente',
		number: documentNumber,
		title: `${type === 'invoice' ? 'Facture' : 'Devis'} ${reservation.service_name}`,
		subtitle: `${clientName} · ${reservation.date_label || formatDisplayDate(reservationDate)}`,
		issueDateLabel: formatDisplayDate(reservationDate),
		deadlineLabel:
			type === 'invoice'
				? formatDisplayDate(addDays(reservationDate, 15))
				: formatDisplayDate(addDays(reservationDate, 30)),
		provider: {
			name: providerName,
			address: profile.company_address || 'Adresse professionnelle à compléter',
			email: profile.email || 'contact@prestat.fr',
			phone: profile.phone || '06 00 00 00 00',
		},
		client: {
			name: clientName,
			address: reservation.company_address || 'Adresse communiquée après confirmation',
			email: clientEmail,
		},
		lines: [
			{
				label: reservation.service_name || 'Prestation',
				description: `${reservation.date_label || formatDisplayDate(reservationDate)} · ${reservation.time_label || 'Créneau à confirmer'}`,
				quantity,
				unitPrice,
				total,
			},
		],
		subtotal: total,
		total,
		legalNotice: 'TVA non applicable, art. 293 B du CGI.',
		note:
			type === 'invoice'
				? 'Merci pour votre confiance. Cette facture correspond à la prestation réalisée.'
				: 'Ce devis est valable 30 jours à compter de sa date d’émission.',
	};
}

function buildDocuments(profile, reservations, servicePriceMap, isProfessional) {
	const sourceReservations = reservations.length ? reservations : [buildFallbackReservation(profile, isProfessional)];
	const sortedReservations = [...sourceReservations].sort((left, right) => {
		return new Date(right.start_at || 0) - new Date(left.start_at || 0);
	});
	const now = new Date();
	const pastReservation =
		sortedReservations.find((reservation) => reservation.start_at && new Date(reservation.start_at) < now) ||
		sortedReservations[0];
	const upcomingReservation =
		sortedReservations.find((reservation) => reservation.start_at && new Date(reservation.start_at) >= now) ||
		sortedReservations[1] ||
		sortedReservations[0];

	return [
		buildDocumentFromReservation({
			type: 'invoice',
			index: 0,
			isProfessional,
			profile,
			reservation: pastReservation,
			servicePriceMap,
		}),
		buildDocumentFromReservation({
			type: 'quote',
			index: 1,
			isProfessional,
			profile,
			reservation: upcomingReservation,
			servicePriceMap,
		}),
	];
}

async function downloadDocumentPdf(document) {
	const pdf = new jsPDF({
		unit: 'mm',
		format: 'a4',
	});
	const pageWidth = pdf.internal.pageSize.getWidth();
	let cursorY = 18;

	try {
		const logoDataUrl = await loadImageAsDataUrl(prestatLogo);
		pdf.addImage(logoDataUrl, 'PNG', 16, cursorY - 4, 30, 10);
	} catch {
		pdf.setFont('helvetica', 'bold');
		pdf.setFontSize(18);
		pdf.text('Prestat', 16, cursorY + 2);
	}

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(26);
	pdf.text(document.typeLabel, 16, cursorY + 20);

	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(11);
	pdf.text(`#${document.number}`, 16, cursorY + 30);
	pdf.text(`Emis le ${document.issueDateLabel}`, pageWidth - 16, cursorY + 10, { align: 'right' });
	pdf.text(
		`${document.type === 'invoice' ? 'A regler avant le' : 'Valable jusqu’au'} ${document.deadlineLabel}`,
		pageWidth - 16,
		cursorY + 17,
		{ align: 'right' }
	);

	cursorY += 40;
	pdf.setDrawColor(225, 225, 225);
	pdf.line(16, cursorY, pageWidth - 16, cursorY);
	cursorY += 10;

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(10);
	pdf.text('PRESTATAIRE', 16, cursorY);
	pdf.text('CLIENT', pageWidth / 2 + 8, cursorY);
	cursorY += 8;

	pdf.setFontSize(12);
	pdf.text(document.provider.name, 16, cursorY);
	pdf.text(document.client.name, pageWidth / 2 + 8, cursorY);
	cursorY += 8;

	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(10);
	const providerLines = [
		document.provider.address,
		document.provider.email,
		document.provider.phone,
	];
	const clientLines = [
		document.client.address,
		document.client.email,
	];

	providerLines.forEach((line, index) => {
		pdf.text(String(line || ''), 16, cursorY + index * 6);
	});
	clientLines.forEach((line, index) => {
		pdf.text(String(line || ''), pageWidth / 2 + 8, cursorY + index * 6);
	});

	cursorY += 26;
	pdf.line(16, cursorY, pageWidth - 16, cursorY);
	cursorY += 10;

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(10);
	pdf.text('PRESTATIONS DEMANDEES', 16, cursorY);
	cursorY += 10;

	pdf.setFillColor(246, 244, 239);
	pdf.rect(16, cursorY, pageWidth - 32, 10, 'F');
	pdf.text('PRESTATION', 20, cursorY + 6.5);
	pdf.text('QTE', 110, cursorY + 6.5);
	pdf.text('PRIX UNITAIRE', 132, cursorY + 6.5);
	pdf.text('TOTAL', pageWidth - 20, cursorY + 6.5, { align: 'right' });
	cursorY += 16;

	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(11);
	document.lines.forEach((line) => {
		pdf.setFont('helvetica', 'bold');
		pdf.text(line.label, 20, cursorY);
		pdf.setFont('helvetica', 'normal');
		pdf.text(line.description, 20, cursorY + 6);
		pdf.text(String(line.quantity), 110, cursorY);
		pdf.text(formatMoney(line.unitPrice), 132, cursorY);
		pdf.setFont('helvetica', 'bold');
		pdf.text(formatMoney(line.total), pageWidth - 20, cursorY, { align: 'right' });
		pdf.setFont('helvetica', 'normal');
		cursorY += 16;
	});

	cursorY += 4;
	pdf.line(16, cursorY, pageWidth - 16, cursorY);
	cursorY += 10;

	pdf.setFont('helvetica', 'normal');
	pdf.text('Sous-total', 126, cursorY);
	pdf.text(formatMoney(document.subtotal), pageWidth - 20, cursorY, { align: 'right' });
	cursorY += 7;
	pdf.text('TVA', 126, cursorY);
	pdf.text('0,00 €', pageWidth - 20, cursorY, { align: 'right' });
	cursorY += 10;

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(12);
	pdf.text('TOTAL', 126, cursorY);
	pdf.text(formatMoney(document.total), pageWidth - 20, cursorY, { align: 'right' });
	cursorY += 14;

	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(10);
	const noteLines = pdf.splitTextToSize(`${document.note} ${document.legalNotice}`, pageWidth - 32);
	pdf.text(noteLines, 16, cursorY);

	pdf.save(`${document.number}.pdf`);
}

function DocumentCard({ document, selected, onSelect }) {
	const badgeClassName =
		document.type === 'invoice'
			? 'bg-[#eef4f0] text-[#2f7e5d]'
			: 'bg-[#f5efe5] text-[#9a5a1f]';

	return (
		<button
			type="button"
			onClick={() => onSelect(document.id)}
			className={`w-full rounded-[22px] border p-4 text-left shadow-[0_12px_28px_rgba(17,19,30,0.04)] transition hover:-translate-y-px ${
				selected ? 'border-black/18 bg-white' : 'border-black/6 bg-white/88'
			}`}
		>
			<div className="flex items-start gap-3">
				<img src={pdfFileIcon} alt="PDF" className="mt-0.5 h-5 w-5 shrink-0 object-contain" />
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-3">
						<p className="truncate text-[1rem] font-semibold text-[#171717]">{document.title}</p>
						<span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${badgeClassName}`}>
							{document.statusLabel}
						</span>
					</div>
					<p className="mt-1 text-[0.88rem] text-black/48">{document.subtitle}</p>
					<div className="mt-3 flex items-center justify-between gap-3 text-[0.82rem] text-black/42">
						<span>{document.number}</span>
						<span>{formatMoney(document.total)}</span>
					</div>
				</div>
			</div>
		</button>
	);
}

function DocumentPreview({ document }) {
	const statusClassName =
		document.type === 'invoice'
			? 'bg-[#eef4f0] text-[#2f7e5d]'
			: 'bg-[#f5efe5] text-[#9a5a1f]';

	return (
		<section className="rounded-[30px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)] lg:p-8">
			<div className="rounded-[26px] border border-black/8 bg-[#fcfbf8] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] lg:p-8">
				<div className="flex flex-wrap items-start justify-between gap-5 border-b border-black/8 pb-6">
					<div>
						<img src={prestatLogo} alt="Prestat" className="h-auto w-[120px]" />
						<h2 className="mt-6 text-[2rem] font-semibold tracking-[-0.05em] text-[#171717]">{document.typeLabel}</h2>
						<p className="mt-2 text-[0.94rem] text-black/54">#{document.number}</p>
					</div>
					<div className="text-right">
						<span className={`inline-flex rounded-full px-3 py-1 text-[0.78rem] font-semibold ${statusClassName}`}>
							{document.statusLabel}
						</span>
						<p className="mt-4 text-[0.9rem] text-black/48">Émis le {document.issueDateLabel}</p>
						<p className="mt-1 text-[0.9rem] text-black/48">
							{document.type === 'invoice' ? 'À régler avant le' : 'Valable jusqu’au'} {document.deadlineLabel}
						</p>
					</div>
				</div>

				<div className="grid gap-5 border-b border-black/8 py-6 md:grid-cols-2">
					<div>
						<p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-black/38">Prestataire</p>
						<p className="mt-3 text-[1.08rem] font-semibold text-[#171717]">{document.provider.name}</p>
						<p className="mt-2 text-[0.94rem] leading-7 text-black/58">{document.provider.address}</p>
						<p className="text-[0.94rem] leading-7 text-black/58">{document.provider.email}</p>
						<p className="text-[0.94rem] leading-7 text-black/58">{document.provider.phone}</p>
					</div>
					<div>
						<p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-black/38">Client</p>
						<p className="mt-3 text-[1.08rem] font-semibold text-[#171717]">{document.client.name}</p>
						<p className="mt-2 text-[0.94rem] leading-7 text-black/58">{document.client.address}</p>
						<p className="text-[0.94rem] leading-7 text-black/58">{document.client.email}</p>
					</div>
				</div>

				<div className="py-6">
					<p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-black/38">Prestations demandées</p>
					<div className="mt-4 overflow-hidden rounded-[20px] border border-black/8">
						<table className="w-full border-collapse text-left">
							<thead className="bg-black/[0.03] text-[0.82rem] uppercase tracking-[0.08em] text-black/44">
								<tr>
									<th className="px-4 py-3 font-medium">Prestation</th>
									<th className="px-4 py-3 font-medium">Qté</th>
									<th className="px-4 py-3 font-medium">Prix unitaire</th>
									<th className="px-4 py-3 font-medium text-right">Total</th>
								</tr>
							</thead>
							<tbody>
								{document.lines.map((line) => (
									<tr key={`${document.id}-${line.label}`} className="border-t border-black/6 bg-white">
										<td className="px-4 py-4">
											<p className="text-[0.98rem] font-semibold text-[#171717]">{line.label}</p>
											<p className="mt-1 text-[0.88rem] text-black/48">{line.description}</p>
										</td>
										<td className="px-4 py-4 text-[0.95rem] text-[#171717]">{line.quantity}</td>
										<td className="px-4 py-4 text-[0.95rem] text-[#171717]">{formatMoney(line.unitPrice)}</td>
										<td className="px-4 py-4 text-right text-[0.95rem] font-semibold text-[#171717]">{formatMoney(line.total)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="flex justify-end border-t border-black/8 pt-6">
					<div className="w-full max-w-[260px] space-y-3">
						<div className="flex items-center justify-between text-[0.96rem] text-black/58">
							<span>Sous-total</span>
							<span>{formatMoney(document.subtotal)}</span>
						</div>
						<div className="flex items-center justify-between text-[0.96rem] text-black/58">
							<span>TVA</span>
							<span>0,00 €</span>
						</div>
						<div className="flex items-center justify-between rounded-[16px] bg-[#171717] px-4 py-3 text-[1rem] font-semibold text-white">
							<span>Total</span>
							<span>{formatMoney(document.total)}</span>
						</div>
					</div>
				</div>

				<div className="mt-6 rounded-[18px] bg-black/[0.03] px-4 py-4 text-[0.9rem] leading-7 text-black/58">
					<p>{document.note}</p>
					<p className="mt-2">{document.legalNotice}</p>
				</div>
			</div>
		</section>
	);
}

export default function DocumentsPage({
	embedded = false,
	initialProfile = null,
	initialReservations = null,
	initialDocuments = null,
}) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [profile, setProfile] = useState(initialProfile);
	const [documents, setDocuments] = useState([]);
	const [selectedDocumentId, setSelectedDocumentId] = useState('');
	const [downloadingDocumentId, setDownloadingDocumentId] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadDocumentsPage() {
			setLoading(true);
			setError('');

			try {
				let fullProfile = initialProfile;
				let reservations = Array.isArray(initialReservations) ? initialReservations : null;

				if (!fullProfile) {
					const profileResponse = await fetch('/profil', { credentials: 'same-origin' });
					if (!profileResponse.ok) {
						throw new Error('Impossible de charger votre profil.');
					}

					const profilePayload = await profileResponse.json();
					const baseProfile = profilePayload?.message || {};
					const isProfessional = Boolean(baseProfile.est_pro);

					fullProfile = baseProfile;

					if (isProfessional) {
						const professionalProfileResponse = await fetch('/profil/professionnel/', {
							credentials: 'same-origin',
						});
						if (professionalProfileResponse.ok) {
							const professionalPayload = await professionalProfileResponse.json();
							fullProfile = { ...baseProfile, ...(professionalPayload?.message || {}) };
						}
					}
				}

				const isProfessional = Boolean(fullProfile?.est_pro);

				if (!reservations) {
					const reservationsResponse = await fetch(
						isProfessional ? '/reservation' : '/reservation/client',
						{ credentials: 'same-origin' }
					);
					const reservationsPayload = reservationsResponse.ok ? await reservationsResponse.json() : null;
					reservations = Array.isArray(reservationsPayload?.message) ? reservationsPayload.message : [];
				}

				let nextDocuments = Array.isArray(initialDocuments) ? initialDocuments : [];

				if (!nextDocuments.length) {
					const documentsResponse = await fetch('/documents/data', {
						credentials: 'same-origin',
					});
					const documentsPayload = documentsResponse.ok
						? await documentsResponse.json()
						: null;
					nextDocuments = Array.isArray(documentsPayload?.message)
						? documentsPayload.message
						: [];
				}

				if (!nextDocuments.length) {
					let serviceRows = [];

					if (isProfessional && fullProfile?.users_id) {
						const servicesResponse = await fetch(`/service/${fullProfile.users_id}/liste`, {
							credentials: 'same-origin',
						});
						const servicesPayload = servicesResponse.ok ? await servicesResponse.json() : null;
						serviceRows = Array.isArray(servicesPayload?.message) ? servicesPayload.message : [];
					} else {
						const professionalIds = [...new Set(reservations.map((reservation) => reservation.professional_id).filter(Boolean))];
						const serviceResults = await Promise.all(
							professionalIds.map(async (professionalId) => {
								const response = await fetch(`/service/${professionalId}/liste`, {
									credentials: 'same-origin',
								});
								if (!response.ok) {
									return [];
								}
								const payload = await response.json();
								return Array.isArray(payload?.message) ? payload.message : [];
							})
						);
						serviceRows = serviceResults.flat();
					}

					nextDocuments = buildDocuments(
						fullProfile,
						reservations,
						buildServicePriceMap(serviceRows),
						isProfessional
					);
				}

				if (!cancelled) {
					setProfile(fullProfile);
					setDocuments(nextDocuments);
					setSelectedDocumentId(nextDocuments[0]?.id || '');
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError.message || 'Impossible de charger les documents.');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadDocumentsPage();
		return () => {
			cancelled = true;
		};
	}, [initialDocuments, initialProfile, initialReservations]);

	const selectedDocument = useMemo(
		() => documents.find((document) => document.id === selectedDocumentId) || documents[0] || null,
		[documents, selectedDocumentId]
	);

	const backHref = profile?.est_pro ? '/app/profil/professionnel' : '/app/profil';

	async function handleDownload(document) {
		setDownloadingDocumentId(document.id);
		try {
			await downloadDocumentPdf(document);
		} finally {
			setDownloadingDocumentId('');
		}
	}

	return (
		<main className={`${embedded ? '' : 'min-h-screen'} bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] ${embedded ? 'px-0 pb-0 pt-0' : 'px-4 pb-14 pt-28 sm:px-6 lg:px-8'} text-[#181818]`}>
			<div className={`${embedded ? '' : 'mx-auto max-w-[1480px]'}`}>
				{!embedded ? (
					<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/38">Prestat</p>
							<h1 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.05em] text-[#171717] sm:text-[3rem]">Documents</h1>
							<p className="mt-3 max-w-[60ch] text-[1rem] leading-7 text-black/58">
								Retrouve ici un devis type et une facture type construits à partir des informations du compte et des rendez-vous enregistrés.
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigateTo(backHref)}
							className="rounded-full border border-black/10 bg-white px-5 py-3 text-[0.94rem] font-medium text-[#171717] shadow-[0_10px_24px_rgba(17,19,30,0.04)] transition hover:bg-black/[0.03]"
						>
							Retour au profil
						</button>
					</div>
				) : null}

				{loading ? <p className="text-[1rem] text-black/48">Chargement des documents…</p> : null}
				{error ? <p className="text-[1rem] text-[#b13d3d]">{error}</p> : null}

				{!loading && !error ? (
					<div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
						<aside className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
							<div className="mb-5 flex items-center justify-between gap-4">
								<h2 className="text-[1.2rem] font-semibold text-[#171717]">Vos modèles</h2>
								<div className="flex items-center gap-3">
									{selectedDocument ? (
										<button
											type="button"
											onClick={() => handleDownload(selectedDocument)}
											disabled={downloadingDocumentId === selectedDocument.id}
											className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
											aria-label="Télécharger le document en PDF"
										>
											<DownloadIcon className="h-4 w-4" />
										</button>
									) : null}
									<span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[0.74rem] font-semibold text-black/52">
										{documents.length} document{documents.length > 1 ? 's' : ''}
									</span>
								</div>
							</div>
							<div className="space-y-3">
								{documents.map((document) => (
									<DocumentCard
										key={document.id}
										document={document}
										selected={document.id === selectedDocument?.id}
										onSelect={setSelectedDocumentId}
									/>
								))}
							</div>
						</aside>

						{selectedDocument ? <DocumentPreview document={selectedDocument} /> : null}
					</div>
				) : null}
			</div>
		</main>
	);
}
