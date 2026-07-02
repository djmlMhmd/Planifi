export default function CalendarEventCard({ eventInfo }) {
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
