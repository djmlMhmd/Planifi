import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import Reveal from '../Reveal/Reveal';
import { fetchWithTimeout, ModalPortal, readJsonSafely } from '../ProfilePage/ProfilePage.shared';
import './CalendarPage.css';

const VIEW_OPTIONS = [
	{ id: 'dayGridMonth', label: 'Mois' },
	{ id: 'timeGridWeek', label: 'Semaine' },
	{ id: 'timeGridDay', label: 'Jour' },
	{ id: 'listWeek', label: 'Liste' },
];

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

function ChevronLeft({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M14.5 6.5L9 12L14.5 17.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function ChevronRight({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M9.5 6.5L15 12L9.5 17.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function buildCalendarEvents(reservations) {
	// Je transforme ici les réservations du back en évènements compris par FullCalendar.
	const now = new Date();
	const todayKey = now.toISOString().slice(0, 10);

	return reservations
		.filter((reservation) => reservation.start_at && reservation.end_at)
		.map((reservation) => {
			const eventStart = new Date(reservation.start_at);
			const eventEnd = new Date(reservation.end_at);
			const eventDayKey = reservation.start_at.slice(0, 10);
			const reservationStatus = reservation.status || 'confirmed';

			let uiStatus = 'upcoming';

			if (reservationStatus === 'cancelled_by_pro') {
				uiStatus = 'cancelledByPro';
			} else if (reservationStatus === 'cancelled_by_client') {
				uiStatus = 'cancelledByClient';
			} else if (eventDayKey === todayKey) {
				uiStatus = 'today';
			} else if (eventEnd < now) {
				uiStatus = 'past';
			}

			return {
				id: String(reservation.reservation_id),
				title: reservation.service_name,
				start: reservation.start_at,
				end: reservation.end_at,
				extendedProps: {
					service_name: reservation.service_name,
					provider_name: reservation.title,
					time_label: reservation.time_label,
					date_label: reservation.date_label,
					status: reservationStatus,
					uiStatus,
				},
			};
		});
}

function formatLongDate(dateValue) {
	// Je centralise le format long ici pour réutiliser exactement le même libellé partout.
	return new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(dateValue);
}

function EventCard({ eventInfo }) {
	// FullCalendar me donne des vues différentes selon le mode choisi,
	// donc j'adapte juste le rendu sans dupliquer la logique métier.
	const isListView = eventInfo.view.type.startsWith('list');
	const isGridMonth = eventInfo.view.type === 'dayGridMonth';
	const providerName = eventInfo.event.extendedProps.provider_name;
	const timeLabel = eventInfo.event.extendedProps.time_label;
	const uiStatus = eventInfo.event.extendedProps.uiStatus || 'upcoming';
	const statusClass = `is-${uiStatus}`;

	if (isListView) {
		return (
			<div className={`prestat-calendar-list-card ${statusClass}`}>
				<div className="prestat-calendar-list-accent">
					<span className="prestat-calendar-list-dot" />
				</div>
				<div className="prestat-calendar-list-copy">
					<p className="prestat-calendar-list-title">{eventInfo.event.title}</p>
					<p className="prestat-calendar-list-provider">{providerName}</p>
					<p className="prestat-calendar-list-time">{timeLabel}</p>
				</div>
			</div>
		);
	}

	if (isGridMonth) {
		return (
			<div className={`prestat-calendar-month-pill ${statusClass}`}>
				<div className="prestat-calendar-month-accent">
					<span className="prestat-calendar-month-dot" />
				</div>
				<div className="prestat-calendar-month-copy">
					<p className="prestat-calendar-month-text">{eventInfo.event.title}</p>
					<p className="prestat-calendar-month-time">{timeLabel}</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`prestat-calendar-time-pill ${statusClass}`}>
			<div className="prestat-calendar-time-accent">
				<span className="prestat-calendar-time-dot" />
			</div>
			<div className="prestat-calendar-time-copy">
				<p className="prestat-calendar-time-title">{eventInfo.event.title}</p>
				<p className="prestat-calendar-time-provider">{providerName}</p>
				<p className="prestat-calendar-time-time">{timeLabel}</p>
			</div>
		</div>
	);
}

export default function CalendarPage({ embedded = false }) {
	const calendarRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [reservations, setReservations] = useState([]);
	const [currentView, setCurrentView] = useState('dayGridMonth');
	const [currentTitle, setCurrentTitle] = useState('');
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function loadReservations() {
			// Je remets l'état de chargement avant chaque fetch pour éviter d'afficher
			// de vieilles données si la page se recharge.
			setLoading(true);
			setError('');

			try {
				// await attend que la route réponde avant de passer à la suite.
				// Ici ça me permet de récupérer la réponse brute avant d'essayer de lire son JSON.
				const response = await fetchWithTimeout('/reservation/client', { credentials: 'same-origin' });
				// J'attends ensuite la lecture du body pour pouvoir afficher
				// soit les réservations, soit le message d'erreur renvoyé par le back.
				const payload = await readJsonSafely(response);

				if (!response.ok) {
					throw new Error(payload?.message || 'Impossible de charger le calendrier');
				}

				if (!cancelled) {
					setReservations(payload?.message || []);
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
	}, []);

	const calendarEvents = useMemo(() => buildCalendarEvents(reservations), [reservations]);

	const upcomingEvents = useMemo(() => {
		const now = new Date();
		return calendarEvents
			.filter((event) => {
				const eventStatus = event.extendedProps.uiStatus;

				// Dans le panneau de droite, je garde aussi les annulations
				// pour avoir une vue plus complète de ce qui s'est passé autour des rendez-vous.
				if (eventStatus === 'cancelledByClient' || eventStatus === 'cancelledByPro') {
					return true;
				}

				return new Date(event.end) >= now;
			})
			.sort((left, right) => new Date(left.start) - new Date(right.start));
	}, [calendarEvents]);

	const sidebarEvents = useMemo(() => {
		// Dans la sidebar, je fais remonter les annulations
		// pour qu'on les voie tout de suite dans le résumé.
		const statusPriority = {
			cancelledByPro: 0,
			cancelledByClient: 1,
			today: 2,
			upcoming: 3,
			past: 4,
		};

		return [...upcomingEvents].sort((left, right) => {
			const leftPriority = statusPriority[left.extendedProps.uiStatus] ?? 99;
			const rightPriority = statusPriority[right.extendedProps.uiStatus] ?? 99;

			if (leftPriority !== rightPriority) {
				return leftPriority - rightPriority;
			}

			return new Date(left.start) - new Date(right.start);
		});
	}, [upcomingEvents]);

	const todayEvents = useMemo(() => {
		const todayKey = new Date().toISOString().slice(0, 10);
		return calendarEvents.filter((event) => String(event.start).slice(0, 10) === todayKey);
	}, [calendarEvents]);

	function updateCalendarTitle() {
		// Je relis le titre directement depuis FullCalendar
		// pour rester aligné avec la période réellement affichée.
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
		// Je garde le titre natif de FullCalendar pour éviter de refaire toute la logique des périodes.
		setCurrentTitle(dateInfo.view.title);
		setCurrentView(dateInfo.view.type);
	}

	function CalendarInsights() {
		return (
			<div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_44px_rgba(17,19,30,0.05)]">
				<p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-black/38">Aujourd’hui</p>
				<p className="mt-3 text-[2.3rem] font-semibold tracking-[-0.05em] text-[#17181d]">{todayEvents.length}</p>
				<p className="mt-2 text-[0.96rem] leading-7 text-black/52">
					{todayEvents.length ? 'Tu as des rendez-vous prévus aujourd’hui.' : 'Aucun rendez-vous prévu aujourd’hui.'}
				</p>
				<div className="mt-5 space-y-2 text-[0.82rem] text-black/54">
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-[#ef8c3b]" />
						<span>Du jour</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-[#41a36d]" />
						<span>Passés</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#d94c4c]">
							<span className="absolute h-[1px] w-[7px] rotate-45 bg-white" />
							<span className="absolute h-[1px] w-[7px] -rotate-45 bg-white" />
						</span>
						<span>Annulés par le prestataire</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-[#d94c4c]" />
						<span>Annulés par vous</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-[#17181d]" />
						<span>À venir</span>
					</div>
				</div>

				<div className="my-6 h-px w-full bg-black/8" />

				<div className="flex items-center justify-between gap-4">
					<p className="text-[1.1rem] font-semibold text-[#17181d]">À venir</p>
					<span className="rounded-full bg-[#f3f4f8] px-3 py-1.5 text-[0.78rem] font-medium text-black/46">
						{upcomingEvents.length} au total
					</span>
				</div>
				<div className="mt-5 space-y-3">
					{sidebarEvents.slice(0, 6).map((event) => (
						<button
							key={`aside-${event.id}`}
							type="button"
							onClick={() => {
								setSelectedEvent({
									service_name: event.title,
									title: event.extendedProps.provider_name,
									time_label: event.extendedProps.time_label,
									date_label: event.extendedProps.date_label,
									uiStatus: event.extendedProps.uiStatus,
									start: new Date(event.start),
								});
								setIsInsightsPanelOpen(false);
							}}
							className={`flex w-full items-stretch gap-3 px-0 py-0 text-left transition hover:-translate-y-px ${
								event.extendedProps.uiStatus === 'today'
									? 'bg-[linear-gradient(135deg,rgba(239,140,59,0.16)_0%,rgba(247,187,132,0.16)_100%)] text-[#8f4e18]'
									: event.extendedProps.uiStatus === 'past'
										? 'bg-[linear-gradient(135deg,rgba(65,163,109,0.13)_0%,rgba(122,198,151,0.13)_100%)] text-[#246847]'
										: event.extendedProps.uiStatus === 'cancelledByClient' || event.extendedProps.uiStatus === 'cancelledByPro'
											? 'bg-[linear-gradient(135deg,rgba(217,76,76,0.11)_0%,rgba(239,162,162,0.13)_100%)] text-[#9a3131]'
											: 'bg-[linear-gradient(135deg,rgba(243,244,248,0.96)_0%,rgba(249,250,252,0.96)_100%)] text-[#1a1b21] hover:bg-[#eceef5]'
							}`}
						>
							<span
								className={`flex w-[0.28rem] shrink-0 items-center justify-center ${
									event.extendedProps.uiStatus === 'today'
										? 'bg-[rgba(239,140,59,0.28)]'
										: event.extendedProps.uiStatus === 'past'
											? 'bg-[rgba(65,163,109,0.24)]'
											: event.extendedProps.uiStatus === 'cancelledByClient' || event.extendedProps.uiStatus === 'cancelledByPro'
												? 'bg-[rgba(217,76,76,0.22)]'
												: 'bg-[rgba(23,24,29,0.14)]'
								}`}
							>
								<span
									className={`relative h-[0.62rem] w-[0.62rem] rounded-full ${
										event.extendedProps.uiStatus === 'today'
											? 'bg-[#ef8c3b]'
											: event.extendedProps.uiStatus === 'past'
												? 'bg-[#41a36d]'
												: event.extendedProps.uiStatus === 'cancelledByClient' || event.extendedProps.uiStatus === 'cancelledByPro'
													? 'bg-[#d94c4c]'
													: 'bg-[#17181d]'
									}`}
								>
									{event.extendedProps.uiStatus === 'cancelledByPro' ? (
										<>
											<span className="absolute left-1/2 top-1/2 h-[1.4px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
											<span className="absolute left-1/2 top-1/2 h-[1.4px] w-[7px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
										</>
									) : null}
								</span>
							</span>
							<span className="flex min-w-0 flex-1 flex-col gap-[0.16rem] px-0 py-3 pr-4">
								<p className="truncate text-[0.9rem] font-semibold">{event.title}</p>
								<p
									className={`truncate text-[0.82rem] ${
										event.extendedProps.uiStatus === 'today'
											? 'text-[#8f4e18]/80'
											: event.extendedProps.uiStatus === 'past'
												? 'text-[#246847]/80'
												: event.extendedProps.uiStatus === 'cancelledByClient' || event.extendedProps.uiStatus === 'cancelledByPro'
													? 'text-[#9a3131]/80'
													: 'text-black/48'
									}`}
								>
									{event.extendedProps.provider_name}
								</p>
								<p
									className={`text-[0.8rem] font-medium ${
										event.extendedProps.uiStatus === 'today'
											? 'text-[#8f4e18]/74'
											: event.extendedProps.uiStatus === 'past'
												? 'text-[#246847]/74'
												: event.extendedProps.uiStatus === 'cancelledByClient' || event.extendedProps.uiStatus === 'cancelledByPro'
													? 'text-[#9a3131]/72'
													: 'text-black/56'
									}`}
								>
									{event.extendedProps.date_label} · {event.extendedProps.time_label}
								</p>
							</span>
						</button>
					))}
					{upcomingEvents.length === 0 ? <p className="text-[0.94rem] text-black/44">Aucun rendez-vous à venir.</p> : null}
				</div>
			</div>
		);
	}

	return (
		<main className={`${embedded ? '' : 'min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_42%,#f3f2ee_100%)]'} animate-[pageEnter_280ms_cubic-bezier(0.22,1,0.36,1)] text-[#1b1b1d]`}>
			<section className={embedded ? 'pb-6' : 'px-4 pb-14 pt-6 xl:px-8'}>
				<div className="mx-auto w-full max-w-[1480px]">
					<Reveal from="bottom" className={embedded ? 'mb-6' : 'mb-8'}>
						<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
							{embedded ? null : (
								<div>
									<h1 className="text-[clamp(2rem,3vw,2.9rem)] font-semibold tracking-[-0.045em] text-[#17181d]">Mon calendrier</h1>
									<p className="mt-3 max-w-[60ch] text-[1rem] leading-7 text-black/52">
										Garde une vue claire sur tes rendez-vous à venir, passés ou annulés.
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
												currentView === option.id ? 'bg-[#101010] text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)]' : 'text-black/54 hover:text-black'
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
									<p className="text-[0.92rem] text-black/42">{calendarEvents.length} rendez-vous enregistrés</p>
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
												// En vue mois je n'affiche qu'un rendez-vous pour éviter d'alourdir chaque case.
												dayGridMonth: { dayMaxEvents: 1 },
												timeGridWeek: { titleFormat: { day: 'numeric', month: 'long', year: 'numeric' } },
												timeGridDay: { titleFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } },
												listWeek: { noEventsContent: 'Aucun rendez-vous cette semaine' },
											}}
											events={calendarEvents}
											moreLinkClick="popover"
											moreLinkContent={(moreLinkInfo) => {
												const count = moreLinkInfo.num;
												return `${count} autre${count > 1 ? 's' : ''} rdv`;
											}}
											datesSet={handleDatesSet}
											eventClick={(clickInfo) => {
												setSelectedEvent({
													service_name: clickInfo.event.title,
													title: clickInfo.event.extendedProps.provider_name,
													time_label: clickInfo.event.extendedProps.time_label,
													date_label: clickInfo.event.extendedProps.date_label,
													uiStatus: clickInfo.event.extendedProps.uiStatus,
													start: clickInfo.event.start,
												});
											}}
											eventContent={(eventInfo) => <EventCard eventInfo={eventInfo} />}
										/>
									</div>
								)}
							</Reveal>
						</div>

						{embedded ? null : (
							<Reveal as="aside" from="right" delay={180} className="xl:sticky xl:top-[7.25rem] xl:self-start">
								<CalendarInsights />
							</Reveal>
						)}
					</div>
				</div>
			</section>

			{embedded && isInsightsPanelOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[81] bg-[rgba(10,10,14,0.36)] backdrop-blur-[3px]" onClick={() => setIsInsightsPanelOpen(false)}>
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
								<CalendarInsights />
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{selectedEvent ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[80] overflow-y-auto bg-[rgba(10,10,14,0.42)]" onClick={() => setSelectedEvent(null)}>
						<div className="flex min-h-full items-center justify-center px-4 py-6">
							<div
								className="w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]"
								onClick={(event) => event.stopPropagation()}
							>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-black/38">
									{selectedEvent.start ? formatLongDate(new Date(selectedEvent.start)) : selectedEvent.date_label}
								</p>
								<h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#17181d]">{selectedEvent.service_name}</h2>
							</div>
							<button
								type="button"
								onClick={() => setSelectedEvent(null)}
								className="text-[1.8rem] leading-none text-black/34 transition hover:text-black/62"
								aria-label="Fermer le détail"
							>
								×
							</button>
						</div>

						<div
							className={`mt-6 flex items-stretch gap-4 overflow-hidden border border-black/8 ${
								selectedEvent.uiStatus === 'today'
									? 'bg-[linear-gradient(135deg,rgba(239,140,59,0.16)_0%,rgba(247,187,132,0.16)_100%)] text-[#8f4e18]'
									: selectedEvent.uiStatus === 'past'
										? 'bg-[linear-gradient(135deg,rgba(65,163,109,0.13)_0%,rgba(122,198,151,0.13)_100%)] text-[#246847]'
										: selectedEvent.uiStatus === 'cancelledByClient' || selectedEvent.uiStatus === 'cancelledByPro'
											? 'bg-[linear-gradient(135deg,rgba(217,76,76,0.11)_0%,rgba(239,162,162,0.13)_100%)] text-[#9a3131]'
											: 'bg-[linear-gradient(135deg,rgba(243,244,248,0.96)_0%,rgba(249,250,252,0.96)_100%)] text-[#1a1b21]'
							}`}
						>
							<span
								className={`flex w-[0.34rem] shrink-0 items-center justify-center ${
									selectedEvent.uiStatus === 'today'
										? 'bg-[rgba(239,140,59,0.28)]'
										: selectedEvent.uiStatus === 'past'
											? 'bg-[rgba(65,163,109,0.24)]'
											: selectedEvent.uiStatus === 'cancelledByClient' || selectedEvent.uiStatus === 'cancelledByPro'
												? 'bg-[rgba(217,76,76,0.22)]'
												: 'bg-[rgba(23,24,29,0.14)]'
								}`}
							>
								<span
									className={`relative h-[0.7rem] w-[0.7rem] rounded-full ${
										selectedEvent.uiStatus === 'today'
											? 'bg-[#ef8c3b]'
											: selectedEvent.uiStatus === 'past'
												? 'bg-[#41a36d]'
												: selectedEvent.uiStatus === 'cancelledByClient' || selectedEvent.uiStatus === 'cancelledByPro'
													? 'bg-[#d94c4c]'
													: 'bg-[#17181d]'
									}`}
								>
									{selectedEvent.uiStatus === 'cancelledByPro' ? (
										<>
											<span className="absolute left-1/2 top-1/2 h-[1.4px] w-[8px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
											<span className="absolute left-1/2 top-1/2 h-[1.4px] w-[8px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
										</>
									) : null}
								</span>
							</span>

							<div className="flex min-w-0 flex-1 flex-col gap-5 px-0 py-5 pr-5">
								<div>
									<p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/36">Prestataire</p>
									<p className="mt-2 text-[1.02rem] font-semibold text-[#17181d]">{selectedEvent.title}</p>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/36">Date</p>
										<p className="mt-2 text-[0.98rem] font-semibold text-[#17181d]">
											{selectedEvent.start ? formatLongDate(new Date(selectedEvent.start)) : selectedEvent.date_label}
										</p>
									</div>
									<div>
										<p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/36">Horaire</p>
										<p className="mt-2 text-[0.98rem] font-semibold text-[#17181d]">{selectedEvent.time_label}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
						</div>
					</div>
				</ModalPortal>
			) : null}
		</main>
	);
}
