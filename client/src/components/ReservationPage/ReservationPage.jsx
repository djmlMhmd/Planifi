import { useEffect, useMemo, useRef, useState } from 'react';
import prestatLogo from '../../assets/prestat-logo.svg';
import { getProviderAndService } from '../../data/providers';
import { navigateTo } from '../../lib/navigation';

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

function BookmarkIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M7 4.5H17V20L12 16.7L7 20V4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
		</svg>
	);
}

function VerifiedBadge({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path fill="#c5a96a" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" />
			<path fill="#fff" d="M10.4 15.3 7.1 12l1.3-1.3 2 2 4.2-4.2 1.3 1.3z" />
		</svg>
	);
}

function TrashIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M5 7H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M9 7V5.3H15V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M8 9.5V18.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M12 9.5V18.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M16 9.5V18.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function EditIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 20H8L18.2 9.8L14.2 5.8L4 16V20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
			<path d="M12.8 7.2L16.8 11.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
			<path d="M14.6 5.4L16 4C16.8 3.2 18 3.2 18.8 4L20 5.2C20.8 6 20.8 7.2 20 8L18.6 9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
		</svg>
	);
}

function ChevronIcon({ className = '', direction = 'right' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path
				d={direction === 'left' ? 'M15 5L8 12L15 19' : 'M9 5L16 12L9 19'}
				stroke="currentColor"
				strokeWidth="1.9"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
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

function isSameDay(left, right) {
	return (
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate()
	);
}

function UserAvatar({ profile }) {
	const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Bob Alves';
	const initials =
		`${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() ||
		displayName.trim().charAt(0).toUpperCase();

	return (
		<div className="flex items-center gap-3">
			{profile?.profile_picture ? (
				<div className="h-14 w-14 overflow-hidden rounded-full">
					<img src={profile.profile_picture} alt="Profil" className="h-full w-full object-cover" />
				</div>
			) : (
				<div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#16161c_0%,#2a2a34_100%)] text-[1.1rem] font-semibold text-white shadow-[0_8px_24px_rgba(19,20,28,0.16)]">
					{initials}
				</div>
			)}
			<p className="text-[0.98rem] font-medium text-[#202020]">{displayName}</p>
		</div>
	);
}

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAY_SHORT_NAMES = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const MONTH_NAMES = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const SHORT_MONTH_NAMES = ['janv', 'fevr', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec'];
const TIME_VALUES = [
	'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
	'12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
	'15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

function startOfWeek(date) {
	const next = new Date(date);
	const day = next.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	next.setDate(next.getDate() + diff);
	next.setHours(0, 0, 0, 0);
	return next;
}

function addDays(date, amount) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}

function addMonths(date, amount) {
	const next = new Date(date);
	next.setMonth(next.getMonth() + amount);
	return next;
}

function formatLongDate(date) {
	return `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(date) {
	return `${date.getDate()} ${SHORT_MONTH_NAMES[date.getMonth()]}`;
}

function formatWeekRangeLabel(startDate) {
	const endDate = addDays(startDate, 6);
	return `Semaine du ${startDate.getDate()} ${SHORT_MONTH_NAMES[startDate.getMonth()]} au ${endDate.getDate()} ${SHORT_MONTH_NAMES[endDate.getMonth()]} ${endDate.getFullYear()}`;
}

function formatMonthLabel(date) {
	return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatApiDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${day}-${month}-${date.getFullYear()}`;
}

function normalizeTimeLabel(value) {
	// Je garde toutes les heures au format HH:mm pour éviter les comparaisons bancales.
	if (!value) {
		return '';
	}

	return String(value).slice(0, 5);
}

function timeLabelToMinutes(value) {
	// Je passe tout en minutes pour simplifier les calculs de chevauchement.
	const normalizedValue = normalizeTimeLabel(value);
	const [hours, minutes] = normalizedValue.split(':');
	return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

function durationLabelToMinutes(duration) {
	// Ici je normalise toutes les formes possibles de durée pour n'avoir qu'une valeur en minutes.
	if (!duration) {
		return 60;
	}

	if (typeof duration === 'string') {
		const timeMatch = duration.match(/^(\d{1,2}):(\d{2})$/);
		if (timeMatch) {
			return Number(timeMatch[1]) * 60 + Number(timeMatch[2]);
		}

		const hourMinuteMatch = duration.match(/(\d+)h(?:(\d{1,2}))?/i);
		if (hourMinuteMatch) {
			return (Number(hourMinuteMatch[1]) || 0) * 60 + (Number(hourMinuteMatch[2]) || 0);
		}

		const minuteMatch = duration.match(/(\d+)\s*min/i);
		if (minuteMatch) {
			return Number(minuteMatch[1]) || 0;
		}
	}

	if (typeof duration === 'object') {
		return (Number(duration.hours) || 0) * 60 + (Number(duration.minutes) || 0);
	}

	return 60;
}

function isSlotInsideAvailability(slotStartMinutes, slotEndMinutes, availabilityRanges) {
	// Le créneau doit tenir entièrement dans au moins une plage du pro.
	return availabilityRanges.some((range) => {
		const rangeStartMinutes = timeLabelToMinutes(range.start_time);
		const rangeEndMinutes = timeLabelToMinutes(range.end_time);
		return slotStartMinutes >= rangeStartMinutes && slotEndMinutes <= rangeEndMinutes;
	});
}

function doesSlotOverlapReservation(slotStartMinutes, slotEndMinutes, reservedRanges) {
	// Je bloque tout départ qui mord sur une réservation existante.
	return reservedRanges.some((range) => {
		const reservedStartMinutes = timeLabelToMinutes(range.start_time);
		const reservedEndMinutes = timeLabelToMinutes(range.end_time);
		return slotStartMinutes < reservedEndMinutes && slotEndMinutes > reservedStartMinutes;
	});
}

function formatDurationLabel(duration) {
	// J'affiche la durée dans un format lisible même si le back renvoie un interval brut.
	if (!duration) {
		return '1h';
	}

	if (typeof duration === 'string') {
		const parts = duration.split(':');

		if (parts.length >= 2) {
			const hours = Number(parts[0]) || 0;
			const minutes = Number(parts[1]) || 0;

			if (hours && minutes) return `${hours}h${String(minutes).padStart(2, '0')}`;
			if (hours) return `${hours}h`;
			if (minutes) return `${minutes}min`;
		}

		return duration;
	}

	return String(duration);
}

function formatPriceLabel(price) {
	const amount = Number(price);

	if (Number.isNaN(amount)) {
		return price || '--';
	}

	return Number.isInteger(amount) ? `${amount}€` : `${amount.toFixed(2)}€`;
}

function mapBackendService(service) {
	// Je mappe les services backend une seule fois pour garder une structure stable côté front.
	return {
		id: String(service.service_id),
		name: service.service_name,
		duration: formatDurationLabel(service.duration),
		price: formatPriceLabel(service.service_price),
		description: service.service_description || '',
	};
}

function getMonthDays(date) {
	const first = new Date(date.getFullYear(), date.getMonth(), 1);
	const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const leading = (first.getDay() + 6) % 7;
	const total = last.getDate();
	const cells = [];

	for (let i = 0; i < leading; i += 1) {
		cells.push(null);
	}

	for (let day = 1; day <= total; day += 1) {
		cells.push(new Date(date.getFullYear(), date.getMonth(), day));
	}

	while (cells.length % 7 !== 0) {
		cells.push(null);
	}

	return cells;
}

function buildFallbackScheduleDays(weekStartDate) {
	// Ce fallback sert surtout quand le back n'est pas encore prêt ou si la page charge trop tôt.
	return Array.from({ length: 7 }, (_, index) => {
		const date = addDays(weekStartDate, index);
		return {
			dayName: DAY_NAMES[date.getDay()],
			dayShortName: DAY_SHORT_NAMES[date.getDay()],
			longDate: formatLongDate(date),
			shortDate: formatShortDate(date),
			isoDate: date.toISOString().slice(0, 10),
			times:
				date.getDay() === 0 || date.getDay() === 6
					? []
					: TIME_VALUES.map((value, timeIndex) => {
							const availabilitySeed = (date.getDate() + date.getMonth() + timeIndex) % 5;
							return {
								value,
								available: availabilitySeed !== 0,
							};
						}),
		};
	});
}

export default function ReservationPage() {
	// Toute la logique de réservation vit ici: contexte, calendrier, sélection et confirmation.
	const [profile, setProfile] = useState(null);
	const [backendProvider, setBackendProvider] = useState(null);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [showSchedulePicker, setShowSchedulePicker] = useState(true);
	const [contact, setContact] = useState('[nom prénom - mail@mail.com - 06123456789]');
	const [note, setNote] = useState('');
	const [weekOffset, setWeekOffset] = useState(0);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [calendarMonthDate, setCalendarMonthDate] = useState(() => new Date(2026, 5, 4));
	const [backendProfessionalId, setBackendProfessionalId] = useState(null);
	const [backendService, setBackendService] = useState(null);
	const [scheduleDays, setScheduleDays] = useState([]);
	const [scheduleLoading, setScheduleLoading] = useState(true);
	const [pageError, setPageError] = useState('');
	const [bookingState, setBookingState] = useState({ loading: false, error: '' });
	const calendarRef = useRef(null);

	const searchParams = new URLSearchParams(window.location.search);
	const providerId = searchParams.get('professionalId') || 'tressa';
	const serviceId = searchParams.get('serviceId') || 'srv-1';
	const isBackendProviderId = /^[0-9]+$/.test(providerId);
	const { provider: fallbackProvider, service: fallbackService } = !isBackendProviderId
		? getProviderAndService(providerId, serviceId)
		: {
			provider: {
				id: providerId,
				company: 'Prestataire',
				location: '[localisation]',
			},
			service: {
				id: serviceId,
				name: 'Prestation',
				duration: '1h',
				price: '--',
				description: '',
			},
		};
	const today = new Date();
	const currentWeekStart = useMemo(() => startOfWeek(today), []);
	const displayedWeekStart = useMemo(() => addDays(currentWeekStart, weekOffset * 7), [currentWeekStart, weekOffset]);
	const isCurrentWeek = weekOffset === 0;
	const displayedWeekLabel = useMemo(() => {
		return formatWeekRangeLabel(displayedWeekStart);
	}, [displayedWeekStart]);
	const monthDays = useMemo(() => getMonthDays(calendarMonthDate), [calendarMonthDate]);
	const displayedProvider = backendProvider || fallbackProvider;
	const displayedService = backendService || fallbackService;
	const displayedServiceDurationMinutes = useMemo(() => durationLabelToMinutes(displayedService?.duration), [displayedService?.duration]);
	const scheduleDaysWithVisibleTimes = useMemo(
		() =>
			scheduleDays.map((day) => ({
				...day,
				// Je n'affiche que les vrais créneaux réservables pour éviter un calendrier plein de cases grisées.
				visibleTimes: day.times.filter((time) => time.available),
			})),
		[scheduleDays]
	);

	useEffect(() => {
		// Je préremplis les coordonnées du client connecté pour éviter une ressaisie.
		let cancelled = false;

		async function loadProfile() {
			try {
				const response = await fetch('/profil', { credentials: 'same-origin' });
				if (!response.ok) return;
				const payload = await response.json();
				if (!cancelled && payload?.message) {
					const loadedProfile = payload.message;
					setProfile(loadedProfile);
					const displayContact = `[${loadedProfile.firstName || 'nom'} ${loadedProfile.lastName || 'prénom'} - ${loadedProfile.email || 'mail@mail.com'} - ${loadedProfile.phone || '06123456789'}]`;
					setContact(displayContact);
				}
			} catch {
				// ignore
			}
		}

		loadProfile();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		// Je relie ici les ids de l'URL au vrai prestataire et au vrai service backend.
		let cancelled = false;

		async function loadBookingContext() {
			setPageError('');

			try {
				const professionalsResponse = await fetch('/professionals', { credentials: 'same-origin' });
				if (!professionalsResponse.ok) {
					throw new Error('Impossible de récupérer la liste des prestataires.');
				}

				const professionalsPayload = await professionalsResponse.json();
				const professionals = professionalsPayload?.message || [];
				const matchedProfessional = isBackendProviderId
					? professionals.find((item) => String(item.users_id) === providerId)
					: professionals.find((item) => {
						return item.company_name?.trim().toLowerCase() === fallbackProvider.company.trim().toLowerCase();
					});

				if (!matchedProfessional) {
					if (!cancelled) {
						setPageError('Ce prestataire n’est pas encore relié au backend de réservation.');
					}
					return;
				}

				const professionalNumericId = matchedProfessional.users_id;
				const servicesResponse = await fetch(`/service/${professionalNumericId}/liste`, { credentials: 'same-origin' });
				if (!servicesResponse.ok) {
					throw new Error('Impossible de récupérer les services du prestataire.');
				}

				const servicesPayload = await servicesResponse.json();
				const services = (servicesPayload?.message || []).map(mapBackendService);
				const matchedService =
					services.find((item) => item.id === serviceId) ||
					services.find((item) => item.name?.trim().toLowerCase() === fallbackService.name.trim().toLowerCase()) ||
					services[0] ||
					null;

				if (!cancelled) {
					setBackendProfessionalId(professionalNumericId);
					setBackendProvider({
						id: String(professionalNumericId),
						company: matchedProfessional.company_name,
						location: servicesPayload?.message?.[0]?.company_address || '[localisation]',
					});
					setBackendService(matchedService);
				}
			} catch (error) {
				if (!cancelled) {
					setPageError(error.message || 'Impossible de préparer la réservation.');
				}
			}
		}

		loadBookingContext();
		return () => {
			cancelled = true;
		};
	}, [isBackendProviderId, providerId, fallbackProvider.company, fallbackService.name, serviceId]);

	useEffect(() => {
		// Le mini calendrier suit toujours la semaine affichée.
		setCalendarMonthDate(displayedWeekStart);
	}, [displayedWeekStart]);

	useEffect(() => {
		// Je ferme le calendrier si on clique à côté pour garder un comportement standard.
		if (!isCalendarOpen) return undefined;

		function handleClickOutside(event) {
			if (calendarRef.current && !calendarRef.current.contains(event.target)) {
				setIsCalendarOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isCalendarOpen]);

	useEffect(() => {
		// Je reconstruis les jours affichés à partir des dispos + des réservations déjà prises.
		let cancelled = false;

		async function loadScheduleDays() {
			if (!backendProfessionalId) {
				setScheduleDays(buildFallbackScheduleDays(displayedWeekStart));
				setScheduleLoading(false);
				return;
			}

			setScheduleLoading(true);

			try {
				const days = await Promise.all(
					Array.from({ length: 7 }, async (_, index) => {
						const date = addDays(displayedWeekStart, index);
						const apiDate = formatApiDate(date);
						const dayOfWeek = String(date.getDay());

						const baseDay = {
							dayName: DAY_NAMES[date.getDay()],
							dayShortName: DAY_SHORT_NAMES[date.getDay()],
							longDate: formatLongDate(date),
							shortDate: formatShortDate(date),
							isoDate: date.toISOString().slice(0, 10),
							backendDate: apiDate,
							times: [],
						};

						if (date.getDay() === 0 || date.getDay() === 6) {
							return baseDay;
						}

						const [availabilityResponse, reservedHoursResponse] = await Promise.all([
							fetch(`/availability/${backendProfessionalId}/${dayOfWeek}`, { credentials: 'same-origin' }),
							fetch(`/reservation/reservedHours?selectedDate=${encodeURIComponent(apiDate)}&professionalId=${backendProfessionalId}`, {
								credentials: 'same-origin',
							}),
						]);

						if (!availabilityResponse.ok || !reservedHoursResponse.ok) {
							throw new Error('Impossible de récupérer les créneaux disponibles.');
						}

							const availabilityPayload = await availabilityResponse.json();
							const reservedHoursPayload = await reservedHoursResponse.json();
							const availableHoursPayload = availabilityPayload?.message || {};
							const availableHours = Array.isArray(availableHoursPayload) ? availableHoursPayload : availableHoursPayload.slots || [];
							const availabilityRanges = Array.isArray(availableHoursPayload?.ranges) ? availableHoursPayload.ranges : [];
							const reservedRanges = Array.isArray(reservedHoursPayload?.message) ? reservedHoursPayload.message : [];

							return {
								...baseDay,
								times: availableHours.map((time) => {
									const normalizedTime = normalizeTimeLabel(time);
									const slotStartMinutes = timeLabelToMinutes(normalizedTime);
									const slotEndMinutes = slotStartMinutes + displayedServiceDurationMinutes;

									return {
										value: normalizedTime,
										// Un slot est valide seulement s'il tient dans la dispo du pro et qu'il ne chevauche rien.
										available:
											isSlotInsideAvailability(slotStartMinutes, slotEndMinutes, availabilityRanges) &&
											!doesSlotOverlapReservation(slotStartMinutes, slotEndMinutes, reservedRanges),
									};
								}),
							};
					})
				);

				if (!cancelled) {
					setScheduleDays(days);
				}
			} catch (error) {
				if (!cancelled) {
					setPageError(error.message || 'Impossible de charger les disponibilités.');
					setScheduleDays(buildFallbackScheduleDays(displayedWeekStart));
				}
			} finally {
				if (!cancelled) {
					setScheduleLoading(false);
				}
			}
		}

		loadScheduleDays();
		return () => {
			cancelled = true;
		};
		}, [backendProfessionalId, displayedWeekStart, displayedServiceDurationMinutes]);

	const selectedLabel = useMemo(() => {
		if (!selectedSlot) return '';
		return `${selectedSlot.longDate} - ${selectedSlot.time}`;
	}, [selectedSlot]);

	async function handleConfirmReservation() {
		if (!selectedSlot || !profile || !backendProfessionalId || !backendService?.id) {
			setBookingState({
				loading: false,
				error: 'Impossible de créer la réservation pour le moment.',
			});
			return;
		}

		setBookingState({ loading: true, error: '' });

		try {
			const response = await fetch('/reservation', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					professional_id: backendProfessionalId,
					users_id: profile.users_id,
					service_id: Number(backendService.id),
					start_time: selectedSlot.time,
					day_of_week: selectedSlot.backendDate,
				}),
			});

			const payload = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(payload?.message || 'Erreur lors de la création du rendez-vous.');
			}

			const params = new URLSearchParams({
				professionalId: displayedProvider.id,
				confirmed: '1',
				date: selectedSlot.longDate,
				time: selectedSlot.time,
			});
			navigateTo(`/services?${params.toString()}`);
		} catch (error) {
			setBookingState({
				loading: false,
				error: error.message || 'Erreur lors de la création du rendez-vous.',
			});
			return;
		}

		setBookingState({ loading: false, error: '' });
	}

	function handleBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		navigateTo(`/services?professionalId=${displayedProvider.id}`);
	}

	function handleDateJump(date) {
		const targetWeekStart = startOfWeek(date);
		const diffMs = targetWeekStart.getTime() - currentWeekStart.getTime();
		const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
		setWeekOffset(diffWeeks);
		setIsCalendarOpen(false);
	}

	return (
		<main className="min-h-screen animate-[pageEnter_280ms_cubic-bezier(0.22,1,0.36,1)] bg-[linear-gradient(180deg,#faf9f5_0%,#ffffff_44%,#f3f1eb_100%)] text-[#1b1b1d]">
			<section className="px-4 pb-16 pt-8 xl:px-8">
				<div className="mx-auto w-full max-w-[1480px]">
					<button
						type="button"
						onClick={handleBack}
						className="mb-8 text-[0.98rem] font-medium text-black/48 transition hover:text-[#1b1b1d]"
					>
						Retour
					</button>

					<div className="mb-12 flex items-start gap-5">
						<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dbc78f] bg-white shadow-[0_16px_34px_rgba(17,19,30,0.04)]">
							<div className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2ecdd] text-[#6a5a34]">
								<BookmarkIcon className="h-[18px] w-[18px]" />
							</div>
							<svg viewBox="0 0 64 64" className="h-20 w-20 text-[#cfb16d]" fill="none" aria-hidden="true">
								<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
								<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
								<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
								<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
							</svg>
						</div>

						<div className="pt-4">
							<h1 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#181818]">{displayedProvider.company}</h1>
							<div className="mt-3 flex items-center gap-2 text-[0.96rem] text-black/48">
								<VerifiedBadge className="h-[18px] w-[18px]" />
								<span>utilisateur vérifié</span>
							</div>
						</div>
					</div>

					<div className="max-w-[760px] space-y-10">
						<section>
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Détail de la réservation</h2>
							<div className="rounded-[22px] border border-black/8 bg-white px-6 py-7 shadow-[0_14px_34px_rgba(17,19,30,0.04)]">
								<div className="flex items-start justify-between gap-4">
									<p className="text-[1.05rem] text-[#191919]">
										À partir de {displayedService.price} <span className="text-black/34">- {displayedService.duration}</span>
									</p>
									<div className="flex items-center gap-3 text-[#161616]">
										{selectedSlot ? <EditIcon className="h-5 w-5" /> : null}
										<TrashIcon className="h-5 w-5" />
									</div>
								</div>
							</div>
						</section>

						<section>
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Date & heure</h2>
							{showSchedulePicker ? (
								<div className="rounded-[22px] border border-black/8 bg-white px-5 py-6 shadow-[0_14px_34px_rgba(17,19,30,0.04)]">
									<div className="mb-6 flex items-center justify-between gap-3">
										<button
											type="button"
											onClick={() => setWeekOffset((value) => value - 1)}
											className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-black/46 transition hover:text-[#1b1b1d]"
											aria-label="Semaine précédente"
										>
											<ChevronIcon direction="left" className="h-4 w-4" />
										</button>

										<div className="relative text-center" ref={calendarRef}>
											<button
												type="button"
												onClick={() => setIsCalendarOpen((value) => !value)}
												className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#faf9f5] px-4 py-2 text-[0.96rem] font-semibold text-[#1b1b1d] shadow-[0_8px_20px_rgba(17,19,30,0.04)] transition hover:border-black/20 hover:bg-white"
												aria-expanded={isCalendarOpen}
												aria-label="Choisir une date dans le calendrier"
											>
												<CalendarGridIcon className="h-4 w-4 text-black/52" />
												<span>{displayedWeekLabel}</span>
											</button>
											{isCurrentWeek ? <div className="mt-1 text-[0.8rem] text-black/34">Semaine en cours</div> : null}

											{isCalendarOpen ? (
												<div className="absolute left-1/2 top-[calc(100%+14px)] z-30 w-[320px] -translate-x-1/2 rounded-[22px] border border-black/8 bg-white p-4 text-left shadow-[0_28px_70px_rgba(17,19,30,0.16)]">
													<div className="mb-4 flex items-center justify-between">
														<button
															type="button"
															onClick={() => setCalendarMonthDate((value) => addMonths(value, -1))}
															className="rounded-full p-2 text-black/52 transition hover:bg-black/5 hover:text-[#1b1b1d]"
															aria-label="Mois précédent"
														>
															<ChevronIcon direction="left" className="h-4 w-4" />
														</button>
														<div className="text-[0.98rem] font-semibold capitalize text-[#1b1b1d]">{formatMonthLabel(calendarMonthDate)}</div>
														<button
															type="button"
															onClick={() => setCalendarMonthDate((value) => addMonths(value, 1))}
															className="rounded-full p-2 text-black/52 transition hover:bg-black/5 hover:text-[#1b1b1d]"
															aria-label="Mois suivant"
														>
															<ChevronIcon direction="right" className="h-4 w-4" />
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
																	onClick={() => handleDateJump(date)}
																	className={`aspect-square rounded-[12px] text-[0.92rem] font-medium transition ${
																		isSameDay(date, today)
																			? 'bg-[#161616] text-white'
																			: isSameDay(startOfWeek(date), displayedWeekStart)
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

										<button
											type="button"
											onClick={() => setWeekOffset((value) => value + 1)}
											className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-black/46 transition hover:text-[#1b1b1d]"
											aria-label="Semaine suivante"
										>
											<ChevronIcon direction="right" className="h-4 w-4" />
										</button>
									</div>

									<div className="overflow-x-auto">
										{scheduleLoading ? (
											<p className="pb-2 text-[0.92rem] text-black/42">Chargement des disponibilités…</p>
										) : null}
											<div className="grid min-w-[700px] grid-cols-7 gap-4">
												{scheduleDaysWithVisibleTimes.map((day) => (
													<div key={day.dayName}>
													<p className={`text-center text-[1rem] font-medium uppercase ${isSameDay(new Date(day.isoDate), today) ? 'text-[#161616]' : 'text-[#1b1b1d]'}`}>
														{day.dayShortName}
													</p>
													<p className={`mt-1 text-center text-[0.92rem] ${isSameDay(new Date(day.isoDate), today) ? 'font-semibold text-[#161616]' : 'text-black/28'}`}>
														{day.shortDate}
													</p>
														<div className="mt-3 space-y-2">
															{day.visibleTimes.length ? (
																day.visibleTimes.map((time) => (
																	<button
																		key={`${day.dayName}-${time.value}`}
																		type="button"
																		onClick={() => {
																			setSelectedSlot({
																				longDate: day.longDate,
																				time: time.value,
																			isoDate: day.isoDate,
																			backendDate: day.backendDate,
																		});
																			setShowSchedulePicker(false);
																			setBookingState({ loading: false, error: '' });
																		}}
																		className="block w-full rounded-[8px] border border-black/10 bg-transparent px-2 py-1.5 text-[0.95rem] font-medium text-[#1f1f1f] transition hover:-translate-y-px hover:border-black/25 hover:bg-black/[0.03]"
																	>
																		{time.value}
																	</button>
																))
															) : (
																<div className="rounded-[10px] border border-dashed border-black/8 px-2 py-2 text-center text-[0.82rem] text-black/26">
																	Aucun créneau
																</div>
															)}
														</div>
													</div>
											))}
										</div>
									</div>
								</div>
							) : (
								<div className="rounded-[22px] border border-black/8 bg-white px-6 py-7 shadow-[0_14px_34px_rgba(17,19,30,0.04)]">
									<div className="flex items-start justify-between gap-4">
										<p className="text-[1.05rem] text-[#191919]">{selectedLabel}</p>
										<button
											type="button"
											onClick={() => setShowSchedulePicker(true)}
											className="text-[#161616] transition hover:opacity-70"
											aria-label="Modifier la date"
										>
											<EditIcon className="h-5 w-5" />
										</button>
									</div>
								</div>
							)}
						</section>

						<section>
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Coordonnées</h2>
							<div className="rounded-[22px] border border-black/8 bg-white px-6 py-7 shadow-[0_14px_34px_rgba(17,19,30,0.04)]">
								<div className="flex items-start justify-between gap-4">
									<p className="text-[1.05rem] text-[#191919]">{contact}</p>
									<button type="button" className="text-[#161616] transition hover:opacity-70" aria-label="Modifier les coordonnées">
										<EditIcon className="h-5 w-5" />
									</button>
								</div>
							</div>
						</section>

						<section>
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Note</h2>
							<div className="rounded-[22px] border border-black/8 bg-white p-3 shadow-[0_14px_34px_rgba(17,19,30,0.04)]">
								<textarea
									value={note}
									onChange={(event) => setNote(event.target.value)}
									placeholder="Note"
									className="min-h-[160px] w-full resize-none rounded-[16px] border-0 bg-[#f6f5f1] px-4 py-4 text-[1rem] text-[#1f1f1f] outline-none placeholder:text-black/30"
								/>
							</div>
						</section>

						{pageError ? <p className="text-[0.95rem] font-medium text-[#c35555]">{pageError}</p> : null}
						{bookingState.error ? <p className="text-[0.95rem] font-medium text-[#c35555]">{bookingState.error}</p> : null}

						<button
							type="button"
							onClick={handleConfirmReservation}
							disabled={!selectedSlot || bookingState.loading}
							className={`inline-flex min-w-[240px] items-center justify-center rounded-full px-6 py-4 text-[1rem] font-medium transition ${
								selectedSlot && !bookingState.loading
									? 'bg-[linear-gradient(135deg,#161616_0%,#35332d_100%)] text-white shadow-[0_14px_30px_rgba(22,22,22,0.18)] hover:-translate-y-px hover:opacity-92'
									: 'cursor-not-allowed border border-black/8 bg-[#ecebe7] text-black/34 shadow-none'
							}`}
						>
							{bookingState.loading ? 'Validation…' : 'Valider la réservation'}
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
