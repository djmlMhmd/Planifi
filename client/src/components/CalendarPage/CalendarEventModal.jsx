import { useEffect, useMemo, useRef, useState } from 'react';
import { ModalPortal } from '../ProfilePage/ProfilePage.shared';
import { ChevronLeft, ChevronRight } from './CalendarIcons';
import { formatLongDate } from './calendarUtils';

function getStatusMeta(uiStatus, fallbackLabel) {
	if (uiStatus === 'past') {
		return {
			label: fallbackLabel,
			textClassName: 'text-[#3b8a5b]',
			accentClassName: 'bg-[#41a36d]',
			surfaceClassName: 'bg-[linear-gradient(90deg,rgba(65,163,109,0.18)_0%,rgba(65,163,109,0.07)_100%)]',
		};
	}

	if (uiStatus === 'today') {
		return {
			label: fallbackLabel,
			textClassName: 'text-[#c46d25]',
			accentClassName: 'bg-[#ef8c3b]',
			surfaceClassName: 'bg-[linear-gradient(90deg,rgba(239,140,59,0.18)_0%,rgba(239,140,59,0.07)_100%)]',
		};
	}

	if (uiStatus === 'cancelledByClient' || uiStatus === 'cancelledByPro') {
		return {
			label: fallbackLabel,
			textClassName: 'text-[#bf3f3f]',
			accentClassName: 'bg-[#d94c4c]',
			surfaceClassName: 'bg-[linear-gradient(90deg,rgba(217,76,76,0.18)_0%,rgba(217,76,76,0.07)_100%)]',
		};
	}

	return {
		label: fallbackLabel,
		textClassName: 'text-[#1f232d]',
		accentClassName: 'bg-[#17181d]',
		surfaceClassName: 'bg-[linear-gradient(90deg,rgba(23,24,29,0.14)_0%,rgba(23,24,29,0.05)_100%)]',
	};
}

const MONTH_NAMES = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

function addMonths(date, amount) {
	const next = new Date(date);
	next.setMonth(next.getMonth() + amount);
	return next;
}

function getMonthDays(date) {
	const first = new Date(date.getFullYear(), date.getMonth(), 1);
	const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const leading = (first.getDay() + 6) % 7;
	const cells = [];

	for (let index = 0; index < leading; index += 1) {
		cells.push(null);
	}

	for (let day = 1; day <= last.getDate(); day += 1) {
		cells.push(new Date(date.getFullYear(), date.getMonth(), day));
	}

	while (cells.length % 7 !== 0) {
		cells.push(null);
	}

	return cells;
}

function formatMonthLabel(date) {
	return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function isSameDay(left, right) {
	return (
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate()
	);
}

function CalendarGridIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
			<path d="M8 3.8V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
			<path d="M16 3.8V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
			<path d="M4 9.2H20" stroke="currentColor" strokeWidth="1.7" />
		</svg>
	);
}

export default function CalendarEventModal(props) {
	const {
		selectedEvent,
		role,
		counterpartLabel,
		canManageSelectedEvent,
		selectedEventStatusLabel,
		selectedEventStatusTone,
		actionState,
		moveState,
		setSelectedEvent,
		setMoveState,
		loadMoveSlots,
		handleCancelReservation,
		handleMoveReservation,
	} = props;

	if (!selectedEvent) {
		return null;
	}

	const calendarRef = useRef(null);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [calendarMonthDate, setCalendarMonthDate] = useState(() =>
		moveState.date ? new Date(moveState.date) : new Date(selectedEvent.start_at || Date.now())
	);

	const longDateLabel = selectedEvent.start_at
		? formatLongDate(new Date(selectedEvent.start_at))
		: selectedEvent.date_label;
	const statusMeta = getStatusMeta(selectedEvent.uiStatus, selectedEventStatusLabel);
	const reservationReference = `RDV-${String(selectedEvent.reservation_id || '').slice(-6) || '000001'}`;
	const counterpartKindLabel = role === 'professional' ? 'Client' : 'Prestataire';
	const locationLabel =
		selectedEvent.location ||
		selectedEvent.address ||
		selectedEvent.company_address ||
		'Adresse communiquée après confirmation';
	const detailSummary =
		selectedEvent.detail_summary ||
		selectedEvent.description ||
		(role === 'professional'
			? `${selectedEvent.counterpart_name} est attendu pour ${selectedEvent.service_name?.toLowerCase() || 'ce rendez-vous'}. Retrouvez ici les informations utiles liées à ce créneau.`
			: `${selectedEvent.counterpart_name} vous reçoit pour ${selectedEvent.service_name?.toLowerCase() || 'ce rendez-vous'}. Retrouvez ici les informations utiles avant le rendez-vous.`);
	const monthDays = useMemo(() => getMonthDays(calendarMonthDate), [calendarMonthDate]);
	const selectedMoveDate = moveState.date ? new Date(moveState.date) : null;
	const today = new Date();

	useEffect(() => {
		setCalendarMonthDate(moveState.date ? new Date(moveState.date) : new Date(selectedEvent.start_at || Date.now()));
	}, [moveState.date, selectedEvent.start_at, selectedEvent.reservation_id]);

	useEffect(() => {
		if (!isCalendarOpen) {
			return undefined;
		}

		function handleClickOutside(event) {
			if (calendarRef.current && !calendarRef.current.contains(event.target)) {
				setIsCalendarOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isCalendarOpen]);

	function handleMoveDateSelect(date) {
		const nextDateValue = date.toISOString().slice(0, 10);
		setMoveState((current) => ({ ...current, date: nextDateValue, selectedTime: '' }));
		setIsCalendarOpen(false);
		loadMoveSlots(nextDateValue);
	}

	return (
		<ModalPortal>
			<div className="fixed inset-0 z-[80] overflow-y-auto bg-[rgba(10,10,14,0.42)]" onClick={() => setSelectedEvent(null)}>
				<div className="flex min-h-full items-center justify-center px-4 py-6">
					<div className="w-full max-w-[760px] rounded-[32px] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)] sm:p-7" onClick={(event) => event.stopPropagation()}>
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0 flex-1 pt-1 sm:pt-0">
								<p className="text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-black/42">
									{longDateLabel}
								</p>
								<div className={`mt-5 flex items-stretch overflow-hidden rounded-[4px] ${statusMeta.surfaceClassName}`}>
									<div className={`w-[6px] shrink-0 ${statusMeta.accentClassName}`} aria-hidden="true" />
									<div className="min-w-0 flex-1 px-8 py-7">
										<h2 className={`text-[1.9rem] font-semibold tracking-[-0.05em] sm:text-[2.2rem] ${statusMeta.textClassName}`}>
											{selectedEvent.service_name}
										</h2>
										<p className={`mt-1 text-[1rem] ${statusMeta.textClassName} opacity-95`}>
											{selectedEvent.counterpart_name}
										</p>
										<p className={`mt-2 text-[1rem] font-medium ${statusMeta.textClassName}`}>
											{selectedEvent.date_label} • {selectedEvent.time_label}
										</p>
									</div>
								</div>
							</div>
							<button type="button" onClick={() => setSelectedEvent(null)} className="text-[1.8rem] leading-none text-black/34 transition hover:text-black/62" aria-label="Fermer le détail">
								×
							</button>
						</div>

						<div className="mt-7 px-5 py-2 text-[#181818] sm:px-7">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/8 pb-4 text-[0.92rem]">
								<span className={`font-semibold ${statusMeta.textClassName}`}>{selectedEventStatusLabel}</span>
								<span className="text-black/24">•</span>
								<span className="text-black/62">En présentiel</span>
								<span className="text-black/24">•</span>
								<span className="font-medium text-black/72">{reservationReference}</span>
							</div>

							<div className="grid gap-4 pt-5 text-[0.98rem]">
								<div className="grid gap-1 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
									<span className="font-semibold uppercase tracking-[0.12em] text-black/40">Lieu</span>
									<span className="text-black/68">{locationLabel}</span>
								</div>

								<div className="grid gap-1 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
									<span className="font-semibold uppercase tracking-[0.12em] text-black/40">Note</span>
									<p className="leading-7 text-black/68">{detailSummary}</p>
								</div>
							</div>
						</div>

						{actionState.error ? <p className="mt-4 text-[0.92rem] text-[#b13d3d]">{actionState.error}</p> : null}
						{actionState.message ? <p className="mt-4 text-[0.92rem] text-[#2f7e5d]">{actionState.message}</p> : null}

						{canManageSelectedEvent ? (
							<div className="mt-6 rounded-[28px] border border-black/7 bg-white p-5 shadow-[0_10px_24px_rgba(17,19,30,0.04)] sm:p-6">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div>
										<p className="text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-black/40">Actions</p>
										<p className="mt-2 max-w-[54ch] text-[0.98rem] leading-7 text-black/56">
											{role === 'professional'
												? 'Vous pouvez encore déplacer ou annuler ce rendez-vous depuis cet écran.'
												: 'Tu peux déplacer ou annuler ce rendez-vous directement ici.'}
										</p>
									</div>
								</div>

								<div className="mt-5 flex flex-wrap gap-3">
									<button
										type="button"
										onClick={() => {
											// Je garde l'ouverture du bloc de déplacement ici
											// pour éviter de précharger les créneaux à chaque clic sur un rdv.
											setMoveState((current) => ({ ...current, open: !current.open }));
											if (!moveState.open) {
												loadMoveSlots(moveState.date || selectedEvent.start_at?.slice(0, 10));
											}
										}}
										className="rounded-full border border-black/10 bg-white px-5 py-3 text-[0.94rem] font-medium text-[#17181d] transition hover:bg-black/[0.03]"
									>
										Déplacer
									</button>
									<button
										type="button"
										onClick={handleCancelReservation}
										disabled={actionState.loading}
										className="rounded-full bg-[#d99999] px-5 py-3 text-[0.94rem] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
									>
										{actionState.loading ? 'Traitement…' : 'Annuler le rendez-vous'}
									</button>
								</div>

								{moveState.open ? (
									<div className="mt-5 rounded-[24px] border border-black/7 bg-[linear-gradient(180deg,#fbfaf7_0%,#f3f0e9_100%)] p-5">
										<div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
											<div className="grid gap-2 text-[0.88rem] font-medium text-black/62">
												<span>Nouvelle date</span>
												<div className="relative" ref={calendarRef}>
													<button
														type="button"
														onClick={() => setIsCalendarOpen((current) => !current)}
														className="flex w-full items-center justify-between rounded-[16px] border border-black/10 bg-white px-4 py-3 text-left text-[0.96rem] font-semibold text-[#1b1b1d] outline-none transition hover:border-black/18"
														aria-expanded={isCalendarOpen}
														aria-label="Choisir une nouvelle date"
													>
														<span>{selectedMoveDate ? selectedMoveDate.toLocaleDateString('fr-FR') : 'Choisir une date'}</span>
														<CalendarGridIcon className="h-4 w-4 text-black/62" />
													</button>

													{isCalendarOpen ? (
														<div className="absolute bottom-[calc(100%+12px)] left-0 z-30 w-[min(320px,calc(100vw-56px))] rounded-[22px] border border-black/8 bg-white p-4 text-left shadow-[0_28px_70px_rgba(17,19,30,0.16)]">
															<div className="mb-4 flex items-center justify-between">
																<button
																	type="button"
																	onClick={() => setCalendarMonthDate((current) => addMonths(current, -1))}
																	className="rounded-full p-2 text-black/52 transition hover:bg-black/5 hover:text-[#1b1b1d]"
																	aria-label="Mois précédent"
																>
																	<ChevronLeft className="h-4 w-4" />
																</button>
																<div className="text-[0.98rem] font-semibold capitalize text-[#1b1b1d]">
																	{formatMonthLabel(calendarMonthDate)}
																</div>
																<button
																	type="button"
																	onClick={() => setCalendarMonthDate((current) => addMonths(current, 1))}
																	className="rounded-full p-2 text-black/52 transition hover:bg-black/5 hover:text-[#1b1b1d]"
																	aria-label="Mois suivant"
																>
																	<ChevronRight className="h-4 w-4" />
																</button>
															</div>

															<div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.78rem] font-medium uppercase tracking-[0.04em] text-black/32">
																{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((label, index) => (
																	<div key={`${label}-${index}`}>{label}</div>
																))}
															</div>

															<div className="grid grid-cols-7 gap-1">
																{monthDays.map((date, index) =>
																	date ? (
																		<button
																			key={date.toISOString()}
																			type="button"
																			onClick={() => handleMoveDateSelect(date)}
																			className={`aspect-square rounded-[12px] text-[0.92rem] font-medium transition ${
																				selectedMoveDate && isSameDay(date, selectedMoveDate)
																					? 'bg-[#161616] text-white'
																					: isSameDay(date, today)
																						? 'bg-[#f1eee7] text-[#1b1b1d]'
																						: 'text-[#1b1b1d] hover:bg-black/5'
																			}`}
																		>
																			{date.getDate()}
																		</button>
																	) : (
																		<div key={`empty-${index}`} className="aspect-square" />
																	)
																)}
															</div>
														</div>
													) : null}
												</div>
											</div>

											<div>
												<p className="text-[0.88rem] font-medium text-black/62">Créneaux disponibles</p>
												{moveState.loading ? (
													<p className="mt-3 text-[0.9rem] text-black/48">Chargement des créneaux…</p>
												) : moveState.error ? (
													<p className="mt-3 text-[0.9rem] text-[#b13d3d]">{moveState.error}</p>
												) : moveState.slots.length ? (
													<div className="mt-3 flex flex-wrap gap-2">
														{moveState.slots.map((slot) => (
															<button
																key={slot}
																type="button"
																onClick={() => setMoveState((current) => ({ ...current, selectedTime: slot }))}
																className={`rounded-full px-3.5 py-2 text-[0.88rem] font-medium transition ${
																	moveState.selectedTime === slot
																		? 'bg-[#101010] text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]'
																		: 'border border-black/10 bg-white text-[#17181d] hover:bg-black/[0.03]'
																}`}
															>
																{slot}
															</button>
														))}
													</div>
												) : (
													<p className="mt-3 text-[0.9rem] text-black/48">Aucun créneau disponible pour cette date.</p>
												)}
											</div>
										</div>

										<div className="mt-5 flex flex-wrap gap-3">
											<button type="button" onClick={handleMoveReservation} disabled={actionState.loading || !moveState.selectedTime} className="rounded-full bg-[#101010] px-5 py-3 text-[0.92rem] font-medium text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60">
												{actionState.loading ? 'Déplacement…' : 'Confirmer le déplacement'}
											</button>
											<button type="button" onClick={() => setMoveState((current) => ({ ...current, open: false, error: '' }))} className="rounded-full border border-black/10 bg-white px-5 py-3 text-[0.92rem] font-medium text-[#17181d] transition hover:bg-black/[0.03]">
												Fermer
											</button>
										</div>
									</div>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</ModalPortal>
	);
}
