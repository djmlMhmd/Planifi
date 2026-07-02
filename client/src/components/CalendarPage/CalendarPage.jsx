import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import Reveal from '../Reveal/Reveal';
import { fetchWithTimeout, ModalPortal, readJsonSafely } from '../ProfilePage/ProfilePage.shared';
import CalendarEventCard from './CalendarEventCard';
import CalendarEventModal from './CalendarEventModal';
import { ChevronLeft, ChevronRight } from './CalendarIcons';
import CalendarInsights from './CalendarInsights';
import {
	VIEW_OPTIONS,
	buildCalendarEvents,
	doesSlotOverlapReservation,
	formatApiDate,
	getDurationInMinutes,
	getReservationUiStatus,
	getSidebarEvents,
	getStatusLabel,
	getStatusTone,
	isSlotInsideAvailability,
	minutesToTimeLabel,
	normalizeTimeLabel,
	timeLabelToMinutes,
} from './calendarUtils';
import './CalendarPage.css';

export default function CalendarPage({
	embedded = false,
	role = 'client',
	reservations: externalReservations = null,
	onReservationsChange = null,
}) {
	const calendarRef = useRef(null);
	const usesExternalReservations = Array.isArray(externalReservations);
	const [loading, setLoading] = useState(!usesExternalReservations);
	const [error, setError] = useState('');
	const [internalReservations, setInternalReservations] = useState(() =>
		usesExternalReservations ? externalReservations : []
	);
	const [currentView, setCurrentView] = useState('dayGridMonth');
	const [currentTitle, setCurrentTitle] = useState('');
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);
	const [actionState, setActionState] = useState({ loading: false, error: '', message: '' });
	const [moveState, setMoveState] = useState({
		open: false,
		date: '',
		selectedTime: '',
		loading: false,
		error: '',
		slots: [],
	});

	useEffect(() => {
		if (usesExternalReservations) {
			setInternalReservations(externalReservations);
			setLoading(false);
		}
	}, [externalReservations, usesExternalReservations]);

	useEffect(() => {
		if (usesExternalReservations) {
			return undefined;
		}

		let cancelled = false;

		async function loadReservations() {
			// Je garde le chargement ici pour que le calendrier puisse vivre
			// tout seul quand on l'affiche hors du profil.
			setLoading(true);
			setError('');

			try {
				const endpoint = role === 'professional' ? '/reservation' : '/reservation/client';
				const response = await fetchWithTimeout(endpoint, { credentials: 'same-origin' });
				const payload = await readJsonSafely(response);

				if (!response.ok) {
					throw new Error(payload?.message || 'Impossible de charger le calendrier');
				}

				if (!cancelled) {
					setInternalReservations(payload?.message || []);
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError.message || 'Impossible de charger le calendrier');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadReservations();
		return () => {
			cancelled = true;
		};
	}, [role, usesExternalReservations]);

	const reservations = usesExternalReservations ? externalReservations : internalReservations;

	function applyReservationsUpdate(updater) {
		const nextReservations = updater(reservations || []);
		if (usesExternalReservations) {
			onReservationsChange?.(nextReservations);
		} else {
			setInternalReservations(nextReservations);
		}
	}

	const calendarEvents = useMemo(
		() => buildCalendarEvents(reservations || [], role),
		[reservations, role]
	);

	const upcomingEvents = useMemo(() => {
		const now = new Date();
		return calendarEvents
			.filter((event) => {
				const eventStatus = event.extendedProps.uiStatus;

				// Je laisse aussi les annulations dans le résumé
				// pour garder une lecture plus complète de la semaine.
				if (eventStatus === 'cancelledByClient' || eventStatus === 'cancelledByPro') {
					return true;
				}

				return new Date(event.end) >= now;
			})
			.sort((left, right) => new Date(left.start) - new Date(right.start));
	}, [calendarEvents]);

	const sidebarEvents = useMemo(() => getSidebarEvents(upcomingEvents), [upcomingEvents]);

	const todayEvents = useMemo(() => {
		const todayKey = new Date().toISOString().slice(0, 10);
		return calendarEvents.filter((event) => String(event.start).slice(0, 10) === todayKey);
	}, [calendarEvents]);

	function updateCalendarTitle() {
		// Je relis le titre depuis FullCalendar pour rester
		// parfaitement aligné avec la période affichée.
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		setCurrentView(calendarApi.view.type);
		setCurrentTitle(calendarApi.view.title);
	}

	function changeView(nextView) {
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		calendarApi.changeView(nextView);
		updateCalendarTitle();
	}

	function goToToday() {
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		calendarApi.today();
		updateCalendarTitle();
	}

	function goToPrevious() {
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		calendarApi.prev();
		updateCalendarTitle();
	}

	function goToNext() {
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		calendarApi.next();
		updateCalendarTitle();
	}

	function handleDatesSet(dateInfo) {
		setCurrentTitle(dateInfo.view.title);
		setCurrentView(dateInfo.view.type);
	}

	function openEventDetails(reservation) {
		// Ici je repars d'un état propre à chaque ouverture
		// pour éviter de garder les messages ou le mode déplacement du rdv précédent.
		setSelectedEvent(reservation);
		setActionState({ loading: false, error: '', message: '' });
		setMoveState({
			open: false,
			date: reservation.start_at?.slice(0, 10) || '',
			selectedTime: reservation.start_time || '',
			loading: false,
			error: '',
			slots: [],
		});
	}

	const canManageSelectedEvent = Boolean(
		selectedEvent &&
		selectedEvent.status === 'confirmed' &&
		selectedEvent.start_at &&
		new Date(selectedEvent.end_at) >= new Date()
	);
	const selectedEventStatusLabel = selectedEvent ? getStatusLabel(selectedEvent.uiStatus) : '';
	const selectedEventStatusTone = selectedEvent ? getStatusTone(selectedEvent.uiStatus) : '';

	async function handleCancelReservation() {
		if (!selectedEvent?.reservation_id) {
			return;
		}

		setActionState({ loading: true, error: '', message: '' });

		try {
			const response = await fetch(`/reservation/${selectedEvent.reservation_id}`, {
				method: 'DELETE',
				credentials: 'same-origin',
			});
			const payload = await readJsonSafely(response);

			if (!response.ok && response.status !== 204) {
				throw new Error(payload?.message || "Impossible d'annuler ce rendez-vous.");
			}

			const nextStatus = role === 'professional' ? 'cancelled_by_pro' : 'cancelled_by_client';
			const nextUiStatus = role === 'professional' ? 'cancelledByPro' : 'cancelledByClient';

			applyReservationsUpdate((currentReservations) =>
				currentReservations.map((reservation) =>
					reservation.reservation_id === selectedEvent.reservation_id
						? { ...reservation, status: nextStatus }
						: reservation
				)
			);

			setSelectedEvent((current) =>
				current ? { ...current, status: nextStatus, uiStatus: nextUiStatus } : current
			);
			setActionState({ loading: false, error: '', message: 'Rendez-vous annulé.' });
			setMoveState((current) => ({ ...current, open: false }));
		} catch (requestError) {
			setActionState({
				loading: false,
				error: requestError.message || "Impossible d'annuler ce rendez-vous.",
				message: '',
			});
		}
	}

	async function loadMoveSlots(nextDateValue = moveState.date) {
		if (!selectedEvent?.professional_id || !nextDateValue) {
			return;
		}

		setMoveState((current) => ({
			...current,
			loading: true,
			error: '',
			slots: [],
		}));

		try {
			const selectedDate = new Date(`${nextDateValue}T12:00:00`);
			const backendDate = formatApiDate(selectedDate);
			const dayOfWeek = String(selectedDate.getDay());
			const durationInMinutes = getDurationInMinutes(selectedEvent);

			// Je recharge ici les vraies dispos + les réservations prises
			// pour ne proposer que des créneaux réalistes dans la modale.
			const [availabilityResponse, reservedHoursResponse] = await Promise.all([
				fetch(`/availability/${selectedEvent.professional_id}/${dayOfWeek}`, {
					credentials: 'same-origin',
				}),
				fetch(
					`/reservation/reservedHours?selectedDate=${encodeURIComponent(backendDate)}&professionalId=${selectedEvent.professional_id}&excludeReservationId=${selectedEvent.reservation_id}`,
					{ credentials: 'same-origin' }
				),
			]);

			const [availabilityPayload, reservedHoursPayload] = await Promise.all([
				readJsonSafely(availabilityResponse),
				readJsonSafely(reservedHoursResponse),
			]);

			if (!availabilityResponse.ok || !reservedHoursResponse.ok) {
				throw new Error('Impossible de récupérer les créneaux disponibles.');
			}

			const availableHoursPayload = availabilityPayload?.message || {};
			const availableHours = Array.isArray(availableHoursPayload)
				? availableHoursPayload
				: availableHoursPayload.slots || [];
			const availabilityRanges = Array.isArray(availableHoursPayload?.ranges)
				? availableHoursPayload.ranges
				: [];
			const reservedRanges = Array.isArray(reservedHoursPayload?.message)
				? reservedHoursPayload.message
				: [];
			const currentTime =
				selectedEvent.start_time || selectedEvent.time_label?.split(' - ')[0] || '';

			const slots = availableHours.filter((time) => {
				const normalizedTime = normalizeTimeLabel(time);
				const slotStartMinutes = timeLabelToMinutes(normalizedTime);
				const slotEndMinutes = slotStartMinutes + durationInMinutes;

				if (
					normalizeTimeLabel(currentTime) === normalizedTime &&
					selectedEvent.start_at?.slice(0, 10) === nextDateValue
				) {
					return true;
				}

				return (
					isSlotInsideAvailability(slotStartMinutes, slotEndMinutes, availabilityRanges) &&
					!doesSlotOverlapReservation(slotStartMinutes, slotEndMinutes, reservedRanges)
				);
			});

			setMoveState((current) => ({
				...current,
				loading: false,
				error: '',
				date: nextDateValue,
				slots,
				selectedTime: slots.includes(current.selectedTime)
					? current.selectedTime
					: slots[0] || '',
			}));
		} catch (requestError) {
			setMoveState((current) => ({
				...current,
				loading: false,
				error: requestError.message || 'Impossible de charger les disponibilités.',
				slots: [],
			}));
		}
	}

	async function handleMoveReservation() {
		if (!selectedEvent?.reservation_id || !moveState.date || !moveState.selectedTime) {
			setActionState({ loading: false, error: 'Choisis une date et un créneau.', message: '' });
			return;
		}

		setActionState({ loading: true, error: '', message: '' });

		try {
			const response = await fetch(`/reservation/${selectedEvent.reservation_id}`, {
				method: 'PATCH',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					start_time: moveState.selectedTime,
					day_of_week: formatApiDate(new Date(`${moveState.date}T12:00:00`)),
				}),
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				throw new Error(payload?.message || 'Impossible de déplacer ce rendez-vous.');
			}

			const durationInMinutes = getDurationInMinutes(selectedEvent);
			const nextStartAt = `${moveState.date}T${moveState.selectedTime}:00`;
			const nextEndLabel = minutesToTimeLabel(
				timeLabelToMinutes(moveState.selectedTime) + durationInMinutes
			);
			const nextDateLabel = new Intl.DateTimeFormat('fr-FR', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
			}).format(new Date(`${moveState.date}T12:00:00`));

			const updatedReservation = {
				...selectedEvent,
				start_at: nextStartAt,
				end_at: `${moveState.date}T${nextEndLabel}:00`,
				start_time: moveState.selectedTime,
				end_time: nextEndLabel,
				time_label: `${moveState.selectedTime} - ${nextEndLabel}`,
				date_label: nextDateLabel,
				day_of_week: formatApiDate(new Date(`${moveState.date}T12:00:00`)),
			};

			applyReservationsUpdate((currentReservations) =>
				currentReservations.map((reservation) =>
					reservation.reservation_id === selectedEvent.reservation_id
						? updatedReservation
						: reservation
				)
			);

			setSelectedEvent({
				...updatedReservation,
				uiStatus: getReservationUiStatus(updatedReservation),
			});
			setActionState({ loading: false, error: '', message: 'Rendez-vous déplacé.' });
			setMoveState((current) => ({ ...current, open: false }));
		} catch (requestError) {
			setActionState({
				loading: false,
				error: requestError.message || 'Impossible de déplacer ce rendez-vous.',
				message: '',
			});
		}
	}

	const pageTitle = role === 'professional' ? 'Calendrier professionnel' : 'Mon calendrier';
	const pageSubtitle =
		role === 'professional'
			? 'Suivez vos rendez-vous, annulez un créneau si besoin et déplacez-le directement depuis votre espace.'
			: 'Garde une vue claire sur tes rendez-vous à venir, passés ou annulés.';
	const counterpartLabel = role === 'professional' ? 'Client' : 'Prestataire';

	return (
		<main
			className={`${
				embedded
					? ''
					: 'min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_42%,#f3f2ee_100%)]'
			} animate-[pageEnter_280ms_cubic-bezier(0.22,1,0.36,1)] text-[#1b1b1d]`}
		>
			<section className={embedded ? 'pb-6' : 'px-4 pb-14 pt-6 xl:px-8'}>
				<div className="mx-auto w-full max-w-[1480px]">
					<Reveal from="bottom" className={embedded ? 'mb-6' : 'mb-8'}>
						<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
							{embedded ? null : (
								<div>
									<h1 className="text-[clamp(2rem,3vw,2.9rem)] font-semibold tracking-[-0.045em] text-[#17181d]">
										{pageTitle}
									</h1>
									<p className="mt-3 max-w-[60ch] text-[1rem] leading-7 text-black/52">
										{pageSubtitle}
									</p>
								</div>
							)}

							<div className={`flex flex-wrap items-center gap-3 ${embedded ? 'lg:ml-auto' : ''}`}>
								{embedded ? (
									<button
										type="button"
										onClick={() => setIsInsightsPanelOpen(true)}
										className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-[0.92rem] font-medium text-[#17181d] shadow-[0_10px_24px_rgba(17,19,30,0.035)] transition hover:-translate-y-px"
									>
										Voir mes infos
									</button>
								) : null}
								<button
									type="button"
									onClick={goToToday}
									className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-[0.92rem] font-medium text-[#17181d] shadow-[0_10px_24px_rgba(17,19,30,0.035)] transition hover:-translate-y-px"
								>
									Aujourd’hui
								</button>
								<div className="flex w-full flex-wrap items-center gap-2 rounded-[22px] border border-black/10 bg-white p-1 shadow-[0_10px_24px_rgba(17,19,30,0.035)] sm:w-auto sm:rounded-full">
									{VIEW_OPTIONS.map((option) => (
										<button
											key={option.id}
											type="button"
											onClick={() => changeView(option.id)}
											className={`rounded-full px-4 py-2 text-[0.9rem] font-medium transition ${
												currentView === option.id
													? 'bg-[#101010] text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]'
													: 'text-black/54 hover:text-black'
											}`}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</Reveal>

					<div className={embedded ? 'grid gap-8' : 'grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]'}>
						<div className="min-w-0">
							<Reveal from="bottom" delay={90}>
								<div className="mb-5 flex flex-col gap-4 px-1 py-1 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex flex-wrap items-center gap-3">
										<button
											type="button"
											onClick={goToPrevious}
											className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-[#fafaf8] text-[#17181d] transition hover:-translate-y-px"
											aria-label="Période précédente"
										>
											<ChevronLeft className="h-5 w-5" />
										</button>
										<div className="rounded-full border border-black/8 bg-[#fafaf8] px-4 py-3 text-[0.96rem] font-semibold text-[#17181d] sm:px-5 sm:text-[1.02rem]">
											{currentTitle}
										</div>
										<button
											type="button"
											onClick={goToNext}
											className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-[#fafaf8] text-[#17181d] transition hover:-translate-y-px"
											aria-label="Période suivante"
										>
											<ChevronRight className="h-5 w-5" />
										</button>
									</div>
									<p className="text-[0.92rem] text-black/42">
										{calendarEvents.length} rendez-vous enregistrés
									</p>
								</div>
							</Reveal>

							<Reveal from="bottom" delay={140}>
								{loading ? (
									<div className="rounded-[30px] border border-black/8 bg-white p-10 text-center shadow-[0_18px_44px_rgba(17,19,30,0.05)]">
										<p className="text-[1rem] text-black/48">Chargement du calendrier…</p>
									</div>
								) : error ? (
									<div className="rounded-[30px] border border-[#e3b6b6] bg-[#fff8f8] p-10 text-center shadow-[0_18px_44px_rgba(17,19,30,0.03)]">
										<p className="text-[1rem] font-medium text-[#9b3d3d]">{error}</p>
									</div>
								) : (
									<div className="prestat-calendar-shell rounded-[30px] border border-black/8 bg-white p-4 shadow-[0_18px_44px_rgba(17,19,30,0.05)] md:p-5">
										<FullCalendar
											ref={calendarRef}
											plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
											locale={frLocale}
											initialView="dayGridMonth"
											headerToolbar={false}
											firstDay={1}
											height="auto"
											expandRows
											nowIndicator
											allDaySlot={false}
											slotMinTime="08:00:00"
											slotMaxTime="21:00:00"
											slotDuration="00:30:00"
											slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
											dayHeaderFormat={{ weekday: 'short' }}
											buttonText={{
												today: "Aujourd'hui",
												month: 'Mois',
												week: 'Semaine',
												day: 'Jour',
												list: 'Liste',
											}}
											views={{
												// En vue mois je limite l'affichage dans chaque case
												// pour garder un calendrier respirant.
												dayGridMonth: { dayMaxEvents: 1 },
												timeGridWeek: {
													titleFormat: { day: 'numeric', month: 'long', year: 'numeric' },
												},
												timeGridDay: {
													titleFormat: {
														weekday: 'long',
														day: 'numeric',
														month: 'long',
														year: 'numeric',
													},
												},
												listWeek: { noEventsContent: 'Aucun rendez-vous cette semaine' },
											}}
											events={calendarEvents}
											moreLinkClick="popover"
											moreLinkContent={(moreLinkInfo) => {
												const count = moreLinkInfo.num;
												return `${count} autre${count > 1 ? 's' : ''} rdv`;
											}}
											datesSet={handleDatesSet}
											eventClick={(clickInfo) =>
												openEventDetails(clickInfo.event.extendedProps.reservation)
											}
											eventContent={(eventInfo) => (
												<CalendarEventCard eventInfo={eventInfo} />
											)}
										/>
									</div>
								)}
							</Reveal>
						</div>

						{embedded ? null : (
							<Reveal
								as="aside"
								from="right"
								delay={180}
								className="xl:sticky xl:top-[7.25rem] xl:self-start"
							>
								<CalendarInsights
									role={role}
									todayEvents={todayEvents}
									upcomingEvents={upcomingEvents}
									sidebarEvents={sidebarEvents}
									onOpenEvent={openEventDetails}
								/>
							</Reveal>
						)}
					</div>
				</div>
			</section>

			{embedded && isInsightsPanelOpen ? (
				<ModalPortal>
					<div
						className="fixed inset-0 z-[81] bg-[rgba(10,10,14,0.36)] backdrop-blur-[3px]"
						onClick={() => setIsInsightsPanelOpen(false)}
					>
						<div className="flex min-h-full items-center justify-end px-4 py-6">
							<div
								className="w-full max-w-[380px] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]"
								onClick={(event) => event.stopPropagation()}
							>
								<div className="mb-3 flex justify-end">
									<button
										type="button"
										onClick={() => setIsInsightsPanelOpen(false)}
										className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-[1.55rem] leading-none text-black/42 shadow-[0_14px_32px_rgba(17,19,30,0.12)] transition hover:text-black/68"
										aria-label="Fermer le panneau calendrier"
									>
										×
									</button>
								</div>
								<CalendarInsights
									role={role}
									todayEvents={todayEvents}
									upcomingEvents={upcomingEvents}
									sidebarEvents={sidebarEvents}
									onOpenEvent={(reservation) => {
										openEventDetails(reservation);
										setIsInsightsPanelOpen(false);
									}}
								/>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			<CalendarEventModal
				selectedEvent={selectedEvent}
				role={role}
				counterpartLabel={counterpartLabel}
				canManageSelectedEvent={canManageSelectedEvent}
				selectedEventStatusLabel={selectedEventStatusLabel}
				selectedEventStatusTone={selectedEventStatusTone}
				actionState={actionState}
				moveState={moveState}
				setSelectedEvent={setSelectedEvent}
				setMoveState={setMoveState}
				loadMoveSlots={loadMoveSlots}
				handleCancelReservation={handleCancelReservation}
				handleMoveReservation={handleMoveReservation}
			/>
		</main>
	);
}
