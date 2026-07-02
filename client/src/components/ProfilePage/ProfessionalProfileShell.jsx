import { startTransition, useEffect, useState } from 'react';
import CalendarPage from '../CalendarPage/CalendarPage';
import DocumentsPage from '../DocumentsPage/DocumentsPage';
import prestatLogo from '../../assets/prestat-logo.svg';
import { getProviderById, saveProfessionalProvider } from '../../data/providers';
import { navigateTo } from '../../lib/navigation';
import {
	BookmarkOutlineIcon,
	CalendarIcon,
	CompassIcon,
	DashboardIcon,
	DocumentIcon,
	HelpIcon,
	LogoutIcon,
	PlusCircleIcon,
	ProfessionalSettingsPanel,
	SidebarLink,
	SettingsIcon,
	UserIcon,
	VerifiedBadge,
	getProfessionalProviderStorageId,
	getProfessionalTabFromLocation,
	readJsonSafely,
	resolveProfessionalProviderId,
} from './ProfilePage.shared';
import { FavoritesPanel } from './ProfilePage.shared';
import ProfessionalDashboardView from './professionalShell/ProfessionalDashboardView';
import ProfessionalProfileModals from './professionalShell/ProfessionalProfileModals';
import ProfessionalProfileView from './professionalShell/ProfessionalProfileView';
import { dailyStats, initialServiceTiles, newsItems, plannerDays, tips } from './professionalShell/professionalProfileData';

function MenuIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 17H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export default function ProfessionalDashboardShell({ profile, reservations = [] }) {
	const [currentProfile, setCurrentProfile] = useState(profile);
	const [currentReservations, setCurrentReservations] = useState(reservations);
	const displayName = `${currentProfile.firstName || ''} ${currentProfile.lastName || ''}`.trim() || '[nom pro]';
	const companyName = currentProfile.company_name || 'TRESSA COIFFURE';
	const baseProviderId = resolveProfessionalProviderId(currentProfile);
	const professionalProviderId = getProfessionalProviderStorageId(currentProfile);
	const baseProvider = getProviderById(baseProviderId);
	const [activeProfessionalTab, setActiveProfessionalTab] = useState(() => getProfessionalTabFromLocation());
	const [isDayPlannerOpen, setIsDayPlannerOpen] = useState(false);
	const [isNewsOpen, setIsNewsOpen] = useState(false);
	const [isServicesPanelOpen, setIsServicesPanelOpen] = useState(false);
	const [isDocumentsNoticeOpen, setIsDocumentsNoticeOpen] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);
	const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
	const [editingServiceId, setEditingServiceId] = useState(null);
	const [serviceForm, setServiceForm] = useState({
		service_name: '',
		service_description: '',
		service_price: '',
		duration: '01:00',
	});
	const [serviceFormState, setServiceFormState] = useState({
		loading: false,
		error: '',
		message: '',
	});
	const [servicesLoading, setServicesLoading] = useState(false);
	const [serviceListVersion, setServiceListVersion] = useState(0);
	const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
	const [tipIndex, setTipIndex] = useState(0);
	const [statView, setStatView] = useState(0);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [serviceTiles, setServiceTiles] = useState(initialServiceTiles);
	const [documents, setDocuments] = useState([]);

	useEffect(() => {
		setCurrentProfile(profile);
	}, [profile]);

	useEffect(() => {
		setCurrentReservations(reservations);
	}, [reservations]);

	useEffect(() => {
		const id = window.setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 5000);
		return () => window.clearInterval(id);
	}, []);

	useEffect(() => {
		function handlePopState() {
			startTransition(() => {
				setActiveProfessionalTab(getProfessionalTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	const selectedPlannerDay = plannerDays[selectedDayIndex] ?? plannerDays[0];
	const dailyAppointments = selectedPlannerDay.appointments;
	const totalAppointments = dailyStats.reduce((sum, item) => sum + item.value, 0);
	const donutStops = dailyStats.reduce((accumulator, item, index) => {
		const previous = accumulator[index - 1]?.end ?? 0;
		const end = previous + (item.value / totalAppointments) * 100;
		accumulator.push({ ...item, start: previous, end });
		return accumulator;
	}, []);
	function resetServiceForm() {
		setServiceForm({
			service_name: '',
			service_description: '',
			service_price: '',
			duration: '01:00',
		});
		setServiceFormState({ loading: false, error: '', message: '' });
		setEditingServiceId(null);
	}

	function formatDurationForBackend(value) {
		if (!value) return '';
		return value.length === 5 ? `${value}:00` : value;
	}

	function normalizeDurationInput(value) {
		if (!value) return '01:00';
		if (typeof value === 'string') return value.slice(0, 5);
		if (typeof value === 'object') {
			const hours = String(value.hours ?? value.hour ?? 1).padStart(2, '0');
			const minutes = String(value.minutes ?? value.minute ?? 0).padStart(2, '0');
			return `${hours}:${minutes}`;
		}
		return '01:00';
	}

	function formatServicePrice(value) {
		if (value === null || value === undefined || value === '') return '';
		const numericValue = Number(String(value).replace(',', '.'));
		if (Number.isNaN(numericValue)) return `${value}€`;
		const formatted = Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(2).replace(/\.?0+$/, '');
		return `${formatted}€`;
	}

	function handleServiceFieldChange(field, value) {
		setServiceForm((current) => ({ ...current, [field]: value }));
		setServiceFormState((current) => ({ ...current, error: '', message: '' }));
	}

	function mapServicesToTiles(loadedServices) {
		return loadedServices.map((service, index) => ({
			id: service.service_id,
			title: service.service_name,
			price: formatServicePrice(service.service_price),
			description: service.service_description || '',
			duration: normalizeDurationInput(service.duration),
			image: service.service_image_url,
			large: index === 0,
		}));
	}

	useEffect(() => {
		let cancelled = false;

		async function loadProfessionalServices() {
			if (!currentProfile?.users_id) {
				return;
			}

			setServicesLoading(true);

			try {
				const response = await fetch(`/service/${currentProfile.users_id}/liste`, {
					credentials: 'same-origin',
				});
				const payload = await readJsonSafely(response);

				if (!response.ok || cancelled) {
					return;
				}

				const loadedServices = Array.isArray(payload?.message) ? payload.message : [];
				if (!loadedServices.length) {
					return;
				}

				setServiceTiles(mapServicesToTiles(loadedServices));
				setSelectedServiceIndex(0);
			} catch {
				// Je garde les cartes de fallback si l'API n'est pas dispo.
			} finally {
				if (!cancelled) {
					setServicesLoading(false);
				}
			}
		}

		loadProfessionalServices();

		return () => {
			cancelled = true;
		};
	}, [currentProfile?.users_id, serviceListVersion]);

	useEffect(() => {
		let cancelled = false;

		async function loadProfessionalDocuments() {
			try {
				const response = await fetch('/documents/data', {
					credentials: 'same-origin',
				});
				const payload = response.ok ? await response.json() : null;
				const nextDocuments = Array.isArray(payload?.message) ? payload.message : [];

				if (!cancelled) {
					setDocuments(nextDocuments);
				}
			} catch {
				if (!cancelled) {
					setDocuments([]);
				}
			}
		}

		loadProfessionalDocuments();

		return () => {
			cancelled = true;
		};
	}, []);

	async function handleCreateServiceSubmit(event) {
		event.preventDefault();

		if (!serviceForm.service_name || !serviceForm.service_description || !serviceForm.service_price || !serviceForm.duration) {
			setServiceFormState({ loading: false, error: 'Renseigne tous les champs du service.', message: '' });
			return;
		}

		if (!/^\d{2}:\d{2}$/.test(serviceForm.duration)) {
			setServiceFormState({ loading: false, error: 'La durée doit être au format HH:MM.', message: '' });
			return;
		}

		setServiceFormState({ loading: true, error: '', message: '' });

		try {
			const isEditing = Boolean(editingServiceId);
			const response = await fetch(isEditing ? `/service/${editingServiceId}` : '/service/create', {
				method: isEditing ? 'PUT' : 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service_name: serviceForm.service_name,
					service_description: serviceForm.service_description,
					service_price: Number(serviceForm.service_price),
					duration: formatDurationForBackend(serviceForm.duration),
				}),
			});

			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setServiceFormState({
					loading: false,
					error: payload?.message || (isEditing ? 'Impossible de modifier le service.' : 'Impossible de créer le service.'),
					message: '',
				});
				return;
			}

			setServiceFormState({
				loading: false,
				error: '',
				message: isEditing ? 'Service modifié avec succès.' : 'Service créé avec succès.',
			});
			setServiceListVersion((current) => current + 1);
			window.setTimeout(() => {
				setIsCreateServiceOpen(false);
				resetServiceForm();
			}, 500);
		} catch {
			setServiceFormState({
				loading: false,
				error: editingServiceId ? 'Erreur réseau lors de la modification du service.' : 'Erreur réseau lors de la création du service.',
				message: '',
			});
		}
	}

	function openEditServiceModal(service) {
		setEditingServiceId(service.id);
		setServiceForm({
			service_name: service.title || '',
			service_description: service.description || '',
			service_price: service.price ? String(service.price).replace(/[^0-9.,]/g, '').replace(',', '.') : '',
			duration: normalizeDurationInput(service.duration),
		});
		setServiceFormState({ loading: false, error: '', message: '' });
		setIsCreateServiceOpen(true);
	}

	function showPreviousService() {
		setSelectedServiceIndex((current) => {
			if (serviceTiles.length <= 1) return current;
			return current === 0 ? serviceTiles.length - 1 : current - 1;
		});
	}

	function showNextService() {
		setSelectedServiceIndex((current) => {
			if (serviceTiles.length <= 1) return current;
			return current === serviceTiles.length - 1 ? 0 : current + 1;
		});
	}

	function showPreviousPlannerDay() {
		setSelectedDayIndex((current) => (current === 0 ? plannerDays.length - 1 : current - 1));
	}

	function showNextPlannerDay() {
		setSelectedDayIndex((current) => (current === plannerDays.length - 1 ? 0 : current + 1));
	}

	function handleProfessionalSidebarNavigation(href) {
		setIsMobileSidebarOpen(false);
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfessionalTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			navigateTo(targetUrl.toString());
			return;
		}

		if (nextTab === activeProfessionalTab) {
			return;
		}

		window.history.pushState({}, '', `${targetUrl.pathname}${targetUrl.search}`);
		startTransition(() => {
			setActiveProfessionalTab(nextTab);
		});
	}

	const selectedService = serviceTiles[selectedServiceIndex] ?? serviceTiles[0] ?? null;
	const previewServices = serviceTiles.length <= 1
		? []
		: Array.from({ length: Math.min(2, serviceTiles.length - 1) }, (_, offset) => {
			const index = (selectedServiceIndex + offset + 1) % serviceTiles.length;
			return serviceTiles[index];
		});

	useEffect(() => {
		saveProfessionalProvider({
			...baseProvider,
			id: professionalProviderId,
			company: currentProfile.company_name || baseProvider.company,
			location: currentProfile.company_address || baseProvider.location,
			services: serviceTiles.map((service) => ({
				id: service.id,
				name: service.title,
				duration: service.duration || '1h',
				price: service.price,
				description: service.description || '',
				image: service.image,
			})),
		});
	}, [baseProvider, professionalProviderId, currentProfile.company_address, currentProfile.company_name, serviceTiles]);

	async function handleLogout() {
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		navigateTo('/connexion/');
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#181818]">
			<div className="grid min-h-screen xl:grid-cols-[202px_1fr]">
				<aside className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:flex-col xl:overflow-hidden xl:border-r xl:border-white/10 xl:bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] xl:text-white">
					<div className="flex h-[92px] items-center justify-center border-b border-white/10 px-6 xl:h-[132px]">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition hover:opacity-80">
							<img src={prestatLogo} alt="Prestat" className="w-[126px]" style={{ filter: 'brightness(0) invert(1)' }} />
						</a>
					</div>

					<nav className="flex flex-1 flex-col px-5 pb-6 pt-6 xl:px-7 xl:pb-8 xl:pt-10">
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
							<SidebarLink href="/app/profil/professionnel" active={activeProfessionalTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleProfessionalSidebarNavigation}>Dashboard</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=calendar" active={activeProfessionalTab === 'calendar'} icon={CalendarIcon} onNavigate={handleProfessionalSidebarNavigation}>Calendrier</SidebarLink>
							<SidebarLink href="/navigation" icon={CompassIcon}>Découvrir</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=favorites" active={activeProfessionalTab === 'favorites'} icon={BookmarkOutlineIcon} onNavigate={handleProfessionalSidebarNavigation}>Favoris</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=documents" active={activeProfessionalTab === 'documents'} icon={DocumentIcon} onNavigate={handleProfessionalSidebarNavigation}>Documents</SidebarLink>
						</div>

						<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:mt-auto xl:grid-cols-1 xl:gap-5">
							<SidebarLink href="/app/profil/professionnel?tab=profile" active={activeProfessionalTab === 'profile'} icon={UserIcon} onNavigate={handleProfessionalSidebarNavigation}>Profil</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=settings" active={activeProfessionalTab === 'settings'} icon={SettingsIcon} onNavigate={handleProfessionalSidebarNavigation}>Paramètres</SidebarLink>
							<button type="button" onClick={handleLogout} className="flex items-center gap-3 text-[0.98rem] font-medium text-white/62 transition hover:text-white">
								<LogoutIcon className="h-5 w-5" />
								<span>Déconnexion</span>
							</button>
							<SidebarLink href="#" icon={HelpIcon}>Contact</SidebarLink>
						</div>
					</nav>
				</aside>

				<div className="min-w-0">
					<header className="flex flex-col gap-5 border-b border-black/6 bg-[rgba(255,255,255,0.72)] px-5 py-5 backdrop-blur-sm sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-9 lg:py-6 xl:h-[132px] xl:py-0">
						<div>
							<div className="mb-3 flex items-start justify-between gap-4 xl:mb-0">
								<h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-[#1a1a1a] sm:text-[2.4rem] xl:text-[3rem]">
									{activeProfessionalTab === 'settings'
										? 'Paramètres'
										: activeProfessionalTab === 'favorites'
											? 'Favoris'
											: activeProfessionalTab === 'calendar'
												? 'Calendrier'
												: activeProfessionalTab === 'documents'
													? 'Documents'
												: activeProfessionalTab === 'profile'
													? 'Profil'
													: 'Dashboard'}
								</h1>
								<button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-black/8 bg-white text-[#151515] shadow-[0_10px_24px_rgba(24,24,35,0.035)] xl:hidden" aria-label="Ouvrir le menu du profil professionnel">
									<MenuIcon className="h-5 w-5" />
								</button>
							</div>
							<p className="mt-1 text-[1.05rem] text-black/72">Bienvenue, {displayName}</p>
							<div className="mt-1 flex flex-wrap items-center gap-3">
								<p className="text-[0.96rem] font-semibold uppercase tracking-[0.02em] text-[var(--accent-mauve)] sm:text-[1rem]">{companyName}</p>
								<span className="inline-flex items-center gap-2 text-[0.84rem] text-[var(--accent-mauve)] sm:text-[0.9rem]">
									<VerifiedBadge className="h-[18px] w-[18px] shrink-0" />
									utilisateur vérifié
								</span>
							</div>
						</div>

						<div className="flex w-full items-center gap-4 lg:w-auto">
							<button type="button" onClick={() => setIsCreateServiceOpen(true)} className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#101010] px-5 py-3.5 text-[0.96rem] font-semibold text-white shadow-[0_16px_32px_rgba(10,10,10,0.14)] sm:w-auto sm:px-6 sm:py-4 sm:text-[1rem]">
								<PlusCircleIcon className="h-6 w-6 text-white" />
								<span>Ajouter un service</span>
							</button>
						</div>
					</header>

					{activeProfessionalTab === 'settings' ? (
						<div className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">
							<ProfessionalSettingsPanel profile={currentProfile} onProfileUpdated={setCurrentProfile} />
						</div>
					) : activeProfessionalTab === 'favorites' ? (
						<div className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">
							<FavoritesPanel />
						</div>
					) : activeProfessionalTab === 'calendar' ? (
						<div className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">
							<CalendarPage
								embedded
								role="professional"
								reservations={currentReservations}
								onReservationsChange={setCurrentReservations}
							/>
						</div>
					) : activeProfessionalTab === 'documents' ? (
						<div className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">
							<DocumentsPage
								embedded
								initialProfile={currentProfile}
								initialReservations={currentReservations}
								initialDocuments={documents}
							/>
						</div>
					) : activeProfessionalTab === 'profile' ? (
						<ProfessionalProfileView profile={currentProfile} serviceTiles={serviceTiles} onAddService={() => setIsCreateServiceOpen(true)} onEditService={openEditServiceModal} />
					) : (
						<ProfessionalDashboardView
							selectedPlannerDay={selectedPlannerDay}
							dailyAppointments={dailyAppointments}
							showPreviousPlannerDay={showPreviousPlannerDay}
							showNextPlannerDay={showNextPlannerDay}
							statView={statView}
							setStatView={setStatView}
							totalAppointments={totalAppointments}
							donutStops={donutStops}
							dailyStats={dailyStats}
							tips={tips}
							tipIndex={tipIndex}
							setTipIndex={setTipIndex}
							serviceTiles={serviceTiles}
							selectedService={selectedService}
							selectedServiceIndex={selectedServiceIndex}
							setSelectedServiceIndex={setSelectedServiceIndex}
							previewServices={previewServices}
							openEditServiceModal={openEditServiceModal}
							showPreviousService={showPreviousService}
							showNextService={showNextService}
							setIsServicesPanelOpen={setIsServicesPanelOpen}
							servicesLoading={servicesLoading}
							documentItems={documents}
							newsItems={newsItems}
							setIsNewsOpen={setIsNewsOpen}
							setIsDayPlannerOpen={setIsDayPlannerOpen}
						/>
					)}
				</div>
			</div>

			<ProfessionalProfileModals
				isMobileSidebarOpen={isMobileSidebarOpen}
				setIsMobileSidebarOpen={setIsMobileSidebarOpen}
				displayName={displayName}
				companyName={companyName}
				activeProfessionalTab={activeProfessionalTab}
				handleProfessionalSidebarNavigation={handleProfessionalSidebarNavigation}
				setIsDocumentsNoticeOpen={setIsDocumentsNoticeOpen}
				isDocumentsNoticeOpen={isDocumentsNoticeOpen}
				isDayPlannerOpen={isDayPlannerOpen}
				setIsDayPlannerOpen={setIsDayPlannerOpen}
				selectedPlannerDay={selectedPlannerDay}
				dailyAppointments={dailyAppointments}
				isNewsOpen={isNewsOpen}
				setIsNewsOpen={setIsNewsOpen}
				newsItems={newsItems}
				isServicesPanelOpen={isServicesPanelOpen}
				setIsServicesPanelOpen={setIsServicesPanelOpen}
				serviceTiles={serviceTiles}
				selectedServiceIndex={selectedServiceIndex}
				setSelectedServiceIndex={setSelectedServiceIndex}
				openEditServiceModal={openEditServiceModal}
				isCreateServiceOpen={isCreateServiceOpen}
				setIsCreateServiceOpen={setIsCreateServiceOpen}
				editingServiceId={editingServiceId}
						resetServiceForm={resetServiceForm}
						handleCreateServiceSubmit={handleCreateServiceSubmit}
						serviceForm={serviceForm}
						handleServiceFieldChange={handleServiceFieldChange}
						serviceFormState={serviceFormState}
						handleLogout={handleLogout}
					/>
		</main>
	);
}
