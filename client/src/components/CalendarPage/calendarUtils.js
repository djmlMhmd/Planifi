export const VIEW_OPTIONS = [
	{ id: 'dayGridMonth', label: 'Mois' },
	{ id: 'timeGridWeek', label: 'Semaine' },
	{ id: 'timeGridDay', label: 'Jour' },
	{ id: 'listWeek', label: 'Liste' },
];

export function formatLongDate(dateValue) {
	return new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(dateValue);
}

export function normalizeTimeLabel(value) {
	return String(value || '').slice(0, 5);
}

export function timeLabelToMinutes(value) {
	const [hours, minutes] = normalizeTimeLabel(value).split(':');
	return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

export function minutesToTimeLabel(totalMinutes) {
	const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
	const minutes = String(totalMinutes % 60).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export function formatApiDate(dateValue) {
	const date = new Date(dateValue);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${day}-${month}-${date.getFullYear()}`;
}

export function getDurationInMinutes(reservation) {
	if (reservation.start_at && reservation.end_at) {
		const start = new Date(reservation.start_at);
		const end = new Date(reservation.end_at);
		const diff = Math.round((end.getTime() - start.getTime()) / 60000);
		if (diff > 0) {
			return diff;
		}
	}

	if (reservation.start_time && reservation.end_time) {
		return timeLabelToMinutes(reservation.end_time) - timeLabelToMinutes(reservation.start_time);
	}

	return 60;
}

export function isSlotInsideAvailability(slotStartMinutes, slotEndMinutes, availabilityRanges) {
	return availabilityRanges.some((range) => {
		const rangeStartMinutes = timeLabelToMinutes(range.start_time);
		const rangeEndMinutes = timeLabelToMinutes(range.end_time);
		return slotStartMinutes >= rangeStartMinutes && slotEndMinutes <= rangeEndMinutes;
	});
}

export function doesSlotOverlapReservation(slotStartMinutes, slotEndMinutes, reservedRanges) {
	return reservedRanges.some((range) => {
		const reservedStartMinutes = timeLabelToMinutes(range.start_time);
		const reservedEndMinutes = timeLabelToMinutes(range.end_time);
		return slotStartMinutes < reservedEndMinutes && slotEndMinutes > reservedStartMinutes;
	});
}

export function getReservationUiStatus(reservation) {
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
	const eventEnd = new Date(reservation.end_at);
	const todayKey = now.toISOString().slice(0, 10);
	const eventDayKey = reservation.start_at.slice(0, 10);

	if (eventEnd < now) {
		return 'past';
	}

	if (eventDayKey === todayKey) {
		return 'today';
	}

	return 'upcoming';
}

export function getStatusLabel(uiStatus) {
	if (uiStatus === 'cancelledByPro') return 'Annulé par le prestataire';
	if (uiStatus === 'cancelledByClient') return 'Annulé par le client';
	if (uiStatus === 'past') return 'Terminé';
	if (uiStatus === 'today') return "Aujourd'hui";
	return 'À venir';
}

export function getStatusTone(uiStatus) {
	if (uiStatus === 'cancelledByPro' || uiStatus === 'cancelledByClient') {
		return 'bg-[#fbe7e7] text-[#a13b3b] border-[#efc6c6]';
	}

	if (uiStatus === 'past') {
		return 'bg-[#e7f5ec] text-[#2d7a54] border-[#c7e6d4]';
	}

	if (uiStatus === 'today') {
		return 'bg-[#fff0df] text-[#9a5a1f] border-[#f0d2ad]';
	}

	return 'bg-[#eef0f4] text-[#1f232d] border-[#dde2ea]';
}

export function buildCalendarEvents(reservations, role) {
	return reservations
		.filter((reservation) => reservation.start_at && reservation.end_at)
		.map((reservation) => {
			const uiStatus = getReservationUiStatus(reservation);
			const counterpartName =
				role === 'professional'
					? reservation.client_name || reservation.title
					: reservation.company_name || reservation.professional_name || reservation.title;

			return {
				id: String(reservation.reservation_id),
				title: reservation.service_name,
				start: reservation.start_at,
				end: reservation.end_at,
				extendedProps: {
					provider_name: counterpartName,
					time_label: reservation.time_label,
					date_label: reservation.date_label,
					status: reservation.status || 'confirmed',
					uiStatus,
					reservation: {
						...reservation,
						counterpart_name: counterpartName,
						uiStatus,
					},
				},
			};
		});
}

export function getSidebarEvents(upcomingEvents) {
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
}
