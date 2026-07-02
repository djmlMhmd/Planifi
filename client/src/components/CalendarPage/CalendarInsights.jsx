export default function CalendarInsights({
	role,
	todayEvents,
	upcomingEvents,
	sidebarEvents,
	onOpenEvent,
}) {
	const todayLabel = role === 'professional' ? "Vous avez des rendez-vous prévus aujourd'hui." : "Tu as des rendez-vous prévus aujourd’hui.";
	const todayEmptyLabel = role === 'professional' ? "Aucun rendez-vous prévu aujourd'hui." : "Aucun rendez-vous prévu aujourd’hui.";

	return (
		<div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_44px_rgba(17,19,30,0.05)]">
			<p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-black/38">Aujourd’hui</p>
			<p className="mt-3 text-[2.3rem] font-semibold tracking-[-0.05em] text-[#17181d]">{todayEvents.length}</p>
			<p className="mt-2 text-[0.96rem] leading-7 text-black/52">
				{todayEvents.length ? todayLabel : todayEmptyLabel}
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
					<span>Annulés par le client</span>
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
						onClick={() => onOpenEvent(event.extendedProps.reservation)}
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
							<p className="truncate text-[0.82rem] text-black/48">{event.extendedProps.provider_name}</p>
							<p className="text-[0.8rem] font-medium text-black/56">
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
