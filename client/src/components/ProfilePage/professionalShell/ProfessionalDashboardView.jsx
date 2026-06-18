import favoritesPlaceholder from '../../../assets/favorites-placeholder.jpg';
import pdfFileIcon from '../../../assets/pdf-file-icon.png';
import tipsPerson from '../../../assets/tips-person.png';
import tipsImg2 from '../../../assets/tips-2.png';
import tipsImg3 from '../../../assets/tips-3.png';
import tipsImg4 from '../../../assets/tips-4.png';
import tipsImg5 from '../../../assets/tips-5.png';
import Reveal from '../../Reveal/Reveal';
import { ChevronIcon, DashboardIcon, DocumentIcon } from '../ProfilePage.shared';

const tipImages = [tipsPerson, tipsImg2, tipsImg3, tipsImg4, tipsImg5];

function NewsCard({ item }) {
	return (
		<div className="rounded-[14px] bg-[#f6f7f9] px-4 py-3.5">
			<div className="mb-1.5 flex items-center gap-2">
				<span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${item.tag === 'Fonctionnalité' ? 'bg-[#0a0a0a] text-white' : item.tag === 'Amélioration' ? 'bg-black/8 text-black/60' : 'bg-black/5 text-black/42'}`}>{item.tag}</span>
				<span className="text-[0.75rem] text-black/34">{item.date}</span>
			</div>
			<p className="text-[0.88rem] font-semibold text-[#1b1b1d]">{item.title}</p>
			<p className="mt-0.5 text-[0.82rem] leading-relaxed text-black/48">{item.body}</p>
		</div>
	);
}

export default function ProfessionalDashboardView(props) {
	const { selectedPlannerDay, dailyAppointments, showPreviousPlannerDay, showNextPlannerDay, statView, setStatView, totalAppointments, donutStops, dailyStats, tips, tipIndex, setTipIndex, serviceTiles, selectedService, selectedServiceIndex, setSelectedServiceIndex, previewServices, openEditServiceModal, showPreviousService, showNextService, setIsServicesPanelOpen, servicesLoading, documentItems, newsItems, setIsNewsOpen, setIsDayPlannerOpen } = props;

	const hydratedTips = tips.map((tip, index) => ({ ...tip, img: tipImages[index] }));

	return (
		<section className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">
			<div className="mb-8 grid gap-5 lg:grid-cols-3 lg:[grid-auto-rows:460px]">
				<Reveal from="bottom" className="h-full">
					<button type="button" onClick={() => setIsDayPlannerOpen(true)} className="flex h-full w-full flex-col rounded-[26px] border border-black/6 bg-[linear-gradient(180deg,#fafafa_0%,#f1f3f7_100%)] p-6 text-left shadow-[0_16px_34px_rgba(17,19,30,0.05)] transition hover:-translate-y-px hover:shadow-[0_18px_36px_rgba(17,19,30,0.08)]">
						<div className="mb-5">
							<p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black/36">{selectedPlannerDay.label}</p>
							<p className="mt-0.5 text-[3.8rem] font-semibold leading-none tracking-[-0.04em] text-[#17181d]">{selectedPlannerDay.dayNumber}</p>
						</div>
						<div className="flex flex-1 flex-col justify-center gap-2.5">
							{dailyAppointments.slice(0, 4).map((appointment, index) => (
								<div key={appointment.id} className={`flex items-center justify-between rounded-[14px] px-4 py-3 ${index % 3 === 1 ? 'bg-[#17181d] text-white' : 'border border-black/8 bg-white text-[#1f2024]'}`}>
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<span className={`h-2 w-2 shrink-0 rounded-full ${index % 3 === 1 ? 'bg-white/60' : 'bg-[#1a1b20]'}`} />
											<p className={`truncate text-[0.78rem] font-semibold ${index % 3 === 1 ? 'text-white/60' : 'text-black/42'}`}>{appointment.service}</p>
										</div>
										<p className="mt-1 truncate pl-4 text-[0.92rem] font-semibold">{appointment.client}</p>
									</div>
									<p className={`ml-3 shrink-0 text-[0.82rem] ${index % 3 === 1 ? 'text-white/54' : 'text-black/44'}`}>{appointment.time}</p>
								</div>
							))}
						</div>
						<div className="mt-4 flex items-center justify-end border-t border-black/5 pt-4">
							<div className="flex gap-2">
								<button type="button" onClick={(event) => { event.stopPropagation(); showPreviousPlannerDay(); }} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5" aria-label="Jour précédent"><ChevronIcon direction="left" className="h-3.5 w-3.5" /></button>
								<button type="button" onClick={(event) => { event.stopPropagation(); showNextPlannerDay(); }} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5" aria-label="Jour suivant"><ChevronIcon className="h-3.5 w-3.5" /></button>
							</div>
						</div>
					</button>
				</Reveal>

				<Reveal from="bottom" delay={80} className="h-full">
					<div className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-black/36">Statistiques</p>
								<h3 className="mt-1 text-[1.1rem] font-semibold tracking-[-0.03em] text-[#171717]">{statView === 0 ? 'Rendez-vous du mois' : 'Évolution annuelle'}</h3>
							</div>
							<div className="shrink-0 rounded-full bg-[#f4f5f7] px-3 py-1 text-[0.78rem] font-medium text-black/44">{totalAppointments} au total</div>
						</div>

						<div className="flex min-h-0 flex-1 items-center justify-center gap-6 overflow-hidden py-4">
							<div className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 140, height: 140, background: `conic-gradient(${donutStops.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})` }}>
								<div className="flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-white text-center">
									<span className="text-[1.7rem] font-semibold leading-none text-[#1b1917]">{totalAppointments}</span>
									<span className="text-[0.62rem] uppercase tracking-[0.10em] text-black/40">Rdv</span>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								{dailyStats.map((item) => (
									<div key={item.label} className="flex items-center gap-2.5">
										<span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
										<div>
											<p className="text-[0.82rem] font-medium text-[#2a2c31]">{item.label}</p>
											<p className="text-[1rem] font-semibold" style={{ color: item.textColor }}>{item.value}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-3 flex items-center justify-between border-t border-black/5 pt-4">
							<p className="text-[0.78rem] text-black/36">{statView === 0 ? '1/2' : '2/2'}</p>
							<div className="flex gap-2">
								<button type="button" onClick={() => setStatView(0)} className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 0 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`} aria-label="Vue camembert"><ChevronIcon direction="left" className="h-3.5 w-3.5" /></button>
								<button type="button" onClick={() => setStatView(1)} className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 1 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`} aria-label="Vue courbe"><ChevronIcon className="h-3.5 w-3.5" /></button>
							</div>
						</div>
					</div>
				</Reveal>

				<Reveal from="bottom" delay={160} className="h-full">
					<div className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#101114_0%,#14161a_100%)] shadow-[0_16px_34px_rgba(17,19,30,0.22)] text-white">
						<div className="relative min-h-0 flex-1 overflow-hidden">
							{hydratedTips.map((tip, i) => (
								<img key={tip.img} src={tip.img} alt="" aria-hidden="true" className="absolute inset-0 mx-auto h-full w-full object-contain object-center transition-opacity duration-700" style={{ opacity: i === tipIndex ? 1 : 0 }} />
							))}
							<div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,rgba(15,16,18,0)_0%,rgba(15,16,18,0.98)_100%)]" />
						</div>
						<div className="px-7 pb-7 pt-0">
							<p className="text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-white/32">Astuce Prestat</p>
							<div key={tipIndex} className="animate-[viewFade_400ms_ease_both]">
								<h4 className="mt-2.5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{hydratedTips[tipIndex].title}</h4>
								<p className="mt-2.5 text-[0.95rem] leading-[1.65] text-white/54">{hydratedTips[tipIndex].body}</p>
							</div>
						</div>
					</div>
				</Reveal>
			</div>

			<div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)_minmax(0,1fr)]">
				<Reveal from="bottom" delay={130} className="h-full">
					<section className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-7 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-[#161616]">Services</h2>
							<div className="flex items-center gap-4 text-[var(--accent-mauve)]">
								<button type="button" onClick={showPreviousService} className="transition hover:opacity-70" aria-label="Service précédent"><ChevronIcon direction="left" className="h-6 w-6" /></button>
								<button type="button" onClick={showNextService} className="transition hover:opacity-70" aria-label="Service suivant"><ChevronIcon className="h-6 w-6" /></button>
								<button type="button" onClick={() => setIsServicesPanelOpen(true)} className="transition hover:opacity-70" aria-label="Afficher tous les services"><DashboardIcon className="h-5 w-5" /></button>
							</div>
						</div>

						<div className="grid flex-1 gap-4 lg:grid-cols-[1fr_160px]">
							<div className="relative min-h-[290px] overflow-hidden rounded-[22px] border border-black/6 bg-[#ebeef4]">
								<img src={selectedService?.image || favoritesPlaceholder} alt="Illustration du service principal" className="absolute inset-0 h-full w-full object-cover" />
							</div>
							<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
								{previewServices.map((tile) => (
									<button key={tile.id} type="button" onClick={() => setSelectedServiceIndex(serviceTiles.findIndex((service) => service.id === tile.id))} className="relative min-h-[136px] overflow-hidden rounded-[18px] border border-black/6 bg-[#ebeef4] text-left">
										<img src={tile.image || favoritesPlaceholder} alt={tile.title} className="absolute inset-0 h-full w-full object-cover" />
										<p className="absolute bottom-3 left-4 right-4 z-[1] text-[1rem] font-medium text-white">{tile.title}</p>
									</button>
								))}
							</div>
						</div>
						{servicesLoading ? <p className="mt-4 text-[0.9rem] text-black/42">Chargement des services…</p> : null}
					</section>
				</Reveal>

				<Reveal from="bottom" delay={200} className="h-full">
					<aside className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
						<div className="mb-5 flex items-center justify-between">
							<h3 className="text-[1.15rem] font-semibold text-[#171717]">Documents</h3>
							<DocumentIcon className="h-5 w-5 text-[var(--accent-mauve)]" />
						</div>
						<div className="flex flex-1 flex-col gap-3">
							{documentItems.map((item) => (
								<div key={item} className="flex items-center gap-3 rounded-[16px] bg-[#f6f7f9] px-4 py-3">
									<img src={pdfFileIcon} alt="PDF" className="h-5 w-5 shrink-0 object-contain" />
									<p className="min-w-0 flex-1 truncate text-[0.88rem] text-[#232323]">{item}</p>
								</div>
							))}
						</div>
					</aside>
				</Reveal>

				<Reveal from="bottom" delay={260} className="h-full">
					<aside className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
						<div className="mb-5 flex items-center justify-between">
							<h3 className="text-[1.15rem] font-semibold text-[#171717]">Dernières nouvelles</h3>
							<span className="rounded-full bg-[var(--accent-mauve-soft)] px-2.5 py-0.5 text-[0.72rem] font-medium text-[var(--accent-mauve)]">Nouveau</span>
						</div>
						<div className="flex flex-1 flex-col justify-between gap-3">
							{newsItems.slice(0, 2).map((item) => <NewsCard key={item.title} item={item} />)}
						</div>
						<button type="button" onClick={() => setIsNewsOpen(true)} className="mt-4 w-full rounded-[14px] border border-black/8 py-2.5 text-[0.85rem] font-medium text-[var(--accent-mauve)] transition hover:bg-black/4 hover:opacity-75">Tout voir</button>
					</aside>
				</Reveal>
			</div>
		</section>
	);
}
