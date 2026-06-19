import prestatLogo from '../../../assets/prestat-logo.svg';
import { BookmarkOutlineIcon, CompassIcon, DashboardIcon, DevelopmentNoticeModal, DocumentIcon, HelpIcon, LogoutIcon, ModalPortal, SettingsIcon, SidebarLink, UserIcon } from '../ProfilePage.shared';

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

export default function ProfessionalProfileModals(props) {
	const { isMobileSidebarOpen, setIsMobileSidebarOpen, displayName, companyName, activeProfessionalTab, handleProfessionalSidebarNavigation, setIsDocumentsNoticeOpen, isDocumentsNoticeOpen, isDayPlannerOpen, setIsDayPlannerOpen, selectedPlannerDay, dailyAppointments, isNewsOpen, setIsNewsOpen, newsItems, isServicesPanelOpen, setIsServicesPanelOpen, serviceTiles, selectedServiceIndex, setSelectedServiceIndex, openEditServiceModal, isCreateServiceOpen, setIsCreateServiceOpen, editingServiceId, resetServiceForm, handleCreateServiceSubmit, serviceForm, handleServiceFieldChange, serviceFormState } = props;

	return (
		<>
			{isMobileSidebarOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[95] bg-[rgba(10,10,14,0.42)] backdrop-blur-[3px]" onClick={() => setIsMobileSidebarOpen(false)}>
						<div className="ml-auto flex h-full w-[min(86vw,340px)] flex-col bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] px-5 pb-6 pt-5 text-white shadow-[-24px_0_50px_rgba(0,0,0,0.22)]" onClick={(event) => event.stopPropagation()}>
							<div className="flex items-center justify-between border-b border-white/10 pb-4">
								<img src={prestatLogo} alt="Prestat" className="w-[118px]" style={{ filter: 'brightness(0) invert(1)' }} />
								<button type="button" onClick={() => setIsMobileSidebarOpen(false)} className="rounded-full border border-white/12 px-3 py-1.5 text-[0.84rem] text-white/76">Fermer</button>
							</div>
							<div className="mt-5 min-w-0">
								<p className="truncate text-[1rem] font-semibold text-white">{displayName}</p>
								<p className="mt-1 truncate text-[0.82rem] font-medium text-[#c7b2ec]">{companyName}</p>
							</div>
							<nav className="mt-8 flex flex-1 flex-col justify-between">
								<div className="space-y-6">
									<SidebarLink href="/app/profil/professionnel" active={activeProfessionalTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleProfessionalSidebarNavigation}>Dashboard</SidebarLink>
									<SidebarLink
										href="/navigation"
										icon={CompassIcon}
										onNavigate={(href) => {
											setIsMobileSidebarOpen(false);
											handleProfessionalSidebarNavigation(href);
										}}
									>
										Découvrir
									</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=favorites" active={activeProfessionalTab === 'favorites'} icon={BookmarkOutlineIcon} onNavigate={handleProfessionalSidebarNavigation}>Favoris</SidebarLink>
									<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => { setIsMobileSidebarOpen(false); setIsDocumentsNoticeOpen(true); }}>Documents</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=profile" active={activeProfessionalTab === 'profile'} icon={UserIcon} onNavigate={handleProfessionalSidebarNavigation}>Profil</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=settings" active={activeProfessionalTab === 'settings'} icon={SettingsIcon} onNavigate={handleProfessionalSidebarNavigation}>Paramètres</SidebarLink>
								</div>
								<div className="space-y-6 pb-1">
									<SidebarLink href="/deconnexion/client" icon={LogoutIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>Déconnexion</SidebarLink>
									<SidebarLink href="#" icon={HelpIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>Contact</SidebarLink>
								</div>
							</nav>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{isDayPlannerOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,15,13,0.32)] backdrop-blur-[3px]">
						<div className="flex min-h-full items-center justify-center px-6 py-6">
							<div className="w-full max-w-[720px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)]">
								<div className="flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Planning du jour</p>
										<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">{selectedPlannerDay.label} {selectedPlannerDay.dayNumber}</h2>
									</div>
									<button type="button" onClick={() => setIsDayPlannerOpen(false)} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">Fermer</button>
								</div>
								<div className="mt-6 space-y-3">
									{dailyAppointments.map((appointment) => (
										<div key={appointment.id} className="grid gap-3 rounded-[18px] border border-black/6 bg-[#f8f8fa] px-5 py-4 md:grid-cols-[120px_1fr_auto] md:items-center">
											<div className="text-[1rem] font-semibold text-black/48">{appointment.service}</div>
											<div>
												<p className="text-[1.05rem] font-semibold text-[#171717]">{appointment.client}</p>
												<p className="mt-1 text-[0.94rem] text-black/54">{appointment.time}</p>
											</div>
											<span className="rounded-full bg-[#eef1f5] px-3 py-1 text-[0.82rem] font-medium text-[#5b6574]">Confirmé</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{isNewsOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,15,13,0.32)] backdrop-blur-[3px]">
						<div className="flex min-h-full items-center justify-center px-6 py-6">
							<div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)]">
								<div className="mb-6 flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
										<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Dernières nouvelles</h2>
									</div>
									<button type="button" onClick={() => setIsNewsOpen(false)} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">Fermer</button>
								</div>
								<div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
									{newsItems.map((item) => <NewsCard key={item.title} item={item} />)}
								</div>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{isServicesPanelOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,15,13,0.32)] backdrop-blur-[3px]">
						<div className="flex min-h-full items-center justify-center px-6 py-6">
							<div className="w-full max-w-[760px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)]">
								<div className="mb-6 flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
										<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Tous les services</h2>
									</div>
									<button type="button" onClick={() => setIsServicesPanelOpen(false)} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">Fermer</button>
								</div>
								<div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
									{serviceTiles.map((service, index) => (
										<div key={service.id} className={`flex items-center justify-between gap-4 rounded-[18px] border px-5 py-4 ${index === selectedServiceIndex ? 'border-black/14 bg-[#f6f7f9]' : 'border-black/6 bg-white'}`}>
											<button type="button" onClick={() => { setSelectedServiceIndex(index); setIsServicesPanelOpen(false); }} className="min-w-0 flex-1 text-left">
												<div className="flex items-center gap-3">
													<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#17181d]" />
													<p className="truncate text-[1rem] font-semibold text-[#171717]">{service.title}</p>
												</div>
											</button>
											<button type="button" onClick={() => { setSelectedServiceIndex(index); setIsServicesPanelOpen(false); openEditServiceModal(service); }} className="shrink-0 rounded-full bg-[#101010] px-4 py-2 text-[0.84rem] font-semibold text-white transition hover:opacity-90">Modifier</button>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			{isCreateServiceOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,19,30,0.24)] backdrop-blur-[3px]">
						<div className="flex min-h-full items-center justify-center px-6 py-6">
							<div className="w-full max-w-[680px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)]">
								<div className="flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">{editingServiceId ? 'Modifier un service' : 'Nouveau service'}</p>
										<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">{editingServiceId ? 'Modifier le service' : 'Ajouter un service'}</h2>
									</div>
									<button type="button" onClick={() => { setIsCreateServiceOpen(false); resetServiceForm(); }} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">Fermer</button>
								</div>

								<form className="mt-7 grid gap-5" onSubmit={handleCreateServiceSubmit}>
									<label className="flex flex-col gap-2">
										<span className="text-[0.94rem] font-medium text-[#171717]">Nom du service</span>
										<input type="text" value={serviceForm.service_name} onChange={(event) => handleServiceFieldChange('service_name', event.target.value)} className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white" placeholder="Ex: Brushing" />
									</label>
									<label className="flex flex-col gap-2">
										<span className="text-[0.94rem] font-medium text-[#171717]">Description</span>
										<textarea value={serviceForm.service_description} onChange={(event) => handleServiceFieldChange('service_description', event.target.value)} className="min-h-[132px] rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 py-3 outline-none transition focus:border-black/18 focus:bg-white" placeholder="Décris la prestation proposée" />
									</label>
									<div className="grid gap-5 md:grid-cols-2">
										<label className="flex flex-col gap-2">
											<span className="text-[0.94rem] font-medium text-[#171717]">Prix</span>
											<input type="number" min="0" step="0.01" value={serviceForm.service_price} onChange={(event) => handleServiceFieldChange('service_price', event.target.value)} className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white" placeholder="70" />
										</label>
										<label className="flex flex-col gap-2">
											<span className="text-[0.94rem] font-medium text-[#171717]">Durée</span>
											<input type="text" value={serviceForm.duration} onChange={(event) => handleServiceFieldChange('duration', event.target.value)} className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white" placeholder="01:00" />
										</label>
									</div>
									{serviceFormState.error ? <p className="text-[0.94rem] font-medium text-[#c35555]">{serviceFormState.error}</p> : null}
									{serviceFormState.message ? <p className="text-[0.94rem] font-medium text-[#1f6b3b]">{serviceFormState.message}</p> : null}
									<div className="flex justify-end gap-3 pt-2">
										<button type="button" onClick={() => { setIsCreateServiceOpen(false); resetServiceForm(); }} className="rounded-[14px] border border-black/10 px-5 py-3 text-[0.94rem] font-medium text-black/58 transition hover:border-black/18 hover:text-black">Annuler</button>
										<button type="submit" disabled={serviceFormState.loading} className={`rounded-[14px] px-5 py-3 text-[0.94rem] font-semibold text-white ${serviceFormState.loading ? 'bg-black/30' : 'bg-[#101010]'}`}>{serviceFormState.loading ? (editingServiceId ? 'Modification…' : 'Création…') : (editingServiceId ? 'Enregistrer les modifications' : 'Créer le service')}</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</ModalPortal>
			) : null}

			<DevelopmentNoticeModal open={isDocumentsNoticeOpen} onClose={() => setIsDocumentsNoticeOpen(false)} />
		</>
	);
}
