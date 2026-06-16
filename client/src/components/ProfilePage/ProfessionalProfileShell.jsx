import { startTransition, useEffect, useState } from 'react';
import favoritesPlaceholder from '../../assets/favorites-placeholder.jpg';
import navigationPlaceholder from '../../assets/navigation-placeholder.jpg';
import providerGalleryOne from '../../assets/provider-gallery-1.jpg';
import providerGalleryTwo from '../../assets/provider-gallery-2.jpg';
import pdfFileIcon from '../../assets/pdf-file-icon.png';
import prestatLogo from '../../assets/prestat-logo.svg';
import tipsPerson from '../../assets/tips-person.png';
import tipsImg2 from '../../assets/tips-2.png';
import tipsImg3 from '../../assets/tips-3.png';
import tipsImg4 from '../../assets/tips-4.png';
import tipsImg5 from '../../assets/tips-5.png';
import { getProviderById, saveProfessionalProvider, saveProviderOverride } from '../../data/providers';
import { navigateTo } from '../../lib/navigation';
import Reveal from '../Reveal/Reveal';
import {
  BellOutlineIcon,
  BookmarkOutlineIcon,
  ChevronIcon,
  CompassIcon,
  DashboardIcon,
  DevelopmentNoticeModal,
  DocumentIcon,
  FavoritesPanel,
  getProfessionalProviderStorageId,
  getProfessionalTabFromLocation,
  HelpIcon,
  LogoutIcon,
  ModalPortal,
  PencilIcon,
  PinIcon,
  PlusCircleIcon,
  ProfessionalSettingsPanel,
  readJsonSafely,
  resolveProfessionalProviderId,
  SearchIcon,
  SettingsIcon,
  SidebarLink,
  SocialIcon,
  StarIcon,
  TrashIcon,
  UserIcon,
  VerifiedBadge,
} from './ProfilePage.shared';

function MenuIcon({ className = '' }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
			<path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M4 17H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

function ProfessionalProfile({ profile, serviceTiles, onAddService, onEditService }) {
	const providerId = resolveProfessionalProviderId(profile);
	const professionalProviderId = getProfessionalProviderStorageId(profile);
	const provider = getProviderById(providerId);
	const [isEditing, setIsEditing] = useState(false);
	const [saveState, setSaveState] = useState('');
	const [draft, setDraft] = useState(() => ({
		company: profile.company_name || provider.company,
		location: profile.company_address || provider.location,
		policy: provider.policy,
		news: provider.news,
		description: provider.description,
		hours: provider.hours,
		gallery: provider.gallery.length ? provider.gallery : [
			{ id: 'g1', image: providerGalleryOne, alt: 'Photo vitrine 1' },
			{ id: 'g2', image: providerGalleryTwo, alt: 'Photo vitrine 2' },
			{ id: 'g3', image: favoritesPlaceholder, alt: 'Photo vitrine 3' },
		],
		socials: {
			instagram: provider.socials.find((item) => item.id === 'instagram')?.href || '',
			tiktok: provider.socials.find((item) => item.id === 'tiktok')?.href || '',
			link: provider.socials.find((item) => item.id === 'link')?.href || '',
		},
	}));

	useEffect(() => {
		setDraft({
			company: profile.company_name || provider.company,
			location: profile.company_address || provider.location,
			policy: provider.policy,
			news: provider.news,
			description: provider.description,
			hours: provider.hours,
			gallery: provider.gallery.length ? provider.gallery : [
				{ id: 'g1', image: providerGalleryOne, alt: 'Photo vitrine 1' },
				{ id: 'g2', image: providerGalleryTwo, alt: 'Photo vitrine 2' },
				{ id: 'g3', image: favoritesPlaceholder, alt: 'Photo vitrine 3' },
			],
			socials: {
				instagram: provider.socials.find((item) => item.id === 'instagram')?.href || '',
				tiktok: provider.socials.find((item) => item.id === 'tiktok')?.href || '',
				link: provider.socials.find((item) => item.id === 'link')?.href || '',
			},
		});
	}, [profile.company_name, profile.company_address, provider.company, provider.location, provider.policy, provider.news, provider.description, provider.hours, provider.gallery, provider.socials]);

	function updateDraft(field, value) {
		setDraft((current) => ({ ...current, [field]: value }));
		setSaveState('');
	}

	function updateHour(index, value) {
		setDraft((current) => ({
			...current,
			hours: current.hours.map((entry, entryIndex) => (entryIndex === index ? [entry[0], value] : entry)),
		}));
		setSaveState('');
	}

	function updateSocial(field, value) {
		setDraft((current) => ({
			...current,
			socials: { ...current.socials, [field]: value },
		}));
		setSaveState('');
	}

	function handleSaveProfile() {
		const nextProviderData = {
			company: draft.company,
			location: draft.location,
			policy: draft.policy,
			news: draft.news,
			description: draft.description,
			hours: draft.hours,
			gallery: draft.gallery,
			socials: [
				{ id: 'instagram', label: 'Instagram', href: draft.socials.instagram || '#' },
				{ id: 'tiktok', label: 'TikTok', href: draft.socials.tiktok || '#' },
				{ id: 'link', label: 'Site', href: draft.socials.link || '#' },
			],
			services: serviceTiles.map((service) => ({
				id: service.id,
				name: service.title,
				duration: service.duration || '1h',
				price: service.price,
				description: service.description || '',
			})),
		};

		saveProviderOverride(providerId, nextProviderData);
		saveProfessionalProvider({
			...provider,
			...nextProviderData,
			id: professionalProviderId,
		});
		setIsEditing(false);
		setSaveState('Modifications enregistrées.');
	}

	return (
		<div className="px-9 pb-12 pt-9">
			<div className="mx-auto max-w-[1480px]">
				<div className="mb-8 flex flex-wrap items-center gap-4">
					<button
						type="button"
						onClick={() => setIsEditing((value) => !value)}
						className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-[0.95rem] font-medium text-[#171717] transition hover:border-black/18 hover:bg-black/[0.02]"
					>
						{isEditing ? 'Annuler l’édition' : 'Éditer le profil'}
					</button>
					<button
						type="button"
						onClick={handleSaveProfile}
						className="rounded-full bg-[#101010] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_14px_28px_rgba(17,19,30,0.14)] transition hover:-translate-y-px"
					>
						Enregistrer
					</button>
					{saveState ? <p className="text-[0.9rem] text-black/48">{saveState}</p> : null}
				</div>

				<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
					<div className="min-w-0">
						<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
							<div className="flex items-start gap-5">
								<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dbc78f] bg-white shadow-[0_16px_34px_rgba(17,19,30,0.04)]">
									<div className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1b20] text-white shadow-[0_10px_24px_rgba(17,19,30,0.18)]">
										<PlusCircleIcon className="h-5 w-5" />
									</div>
									{profile?.profile_picture ? (
										<img src={profile.profile_picture} alt={draft.company} className="h-full w-full rounded-full object-cover" />
									) : (
										<svg viewBox="0 0 64 64" className="h-20 w-20 text-[#cfb16d]" fill="none" aria-hidden="true">
											<path d="M32 13C24 19 21 27 21 34C21 42 26 49 32 53C38 49 43 42 43 34C43 27 40 19 32 13Z" stroke="currentColor" strokeWidth="2.8" />
											<path d="M32 18V49" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
											<path d="M24.5 24.5C29 28 30.8 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
											<path d="M39.5 24.5C35 28 33.2 33.5 32 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
										</svg>
									)}
								</div>

								<div className="pt-2">
									{isEditing ? (
										<input
											type="text"
											value={draft.company}
											onChange={(event) => updateDraft('company', event.target.value)}
											className="w-full max-w-[420px] rounded-[16px] border border-black/8 bg-white px-4 py-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#181818] outline-none transition focus:border-black/18"
										/>
									) : (
										<h1 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#181818]">{draft.company}</h1>
									)}
									<div className="mt-3 flex items-center gap-2 text-[1rem] font-medium text-[#1f1f1f]">
										<PinIcon className="h-[18px] w-[18px]" />
										{isEditing ? (
											<input
												type="text"
												value={draft.location}
												onChange={(event) => updateDraft('location', event.target.value)}
												className="w-full max-w-[320px] rounded-[12px] border border-black/8 bg-white px-3 py-2 text-[0.98rem] outline-none transition focus:border-black/18"
											/>
										) : (
											<span>{draft.location}</span>
										)}
									</div>
									<div className="mt-2 flex items-center gap-2 text-[0.96rem] text-black/48">
										<VerifiedBadge className="h-[18px] w-[18px]" />
										<span>utilisateur vérifié</span>
									</div>
								</div>
							</div>
						</div>

						<div className="mb-8">
							<button
								type="button"
								onClick={onAddService}
								className="inline-flex items-center gap-2 rounded-full bg-[#1a1b20] px-4 py-2.5 text-[0.9rem] font-medium text-white shadow-[0_12px_24px_rgba(17,19,30,0.14)]"
							>
								<PlusCircleIcon className="h-4 w-4" />
								Ajouter un service
							</button>
						</div>

						<section>
							<div className="space-y-6">
								{serviceTiles.map((service) => (
									<div key={service.id} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_34px_rgba(17,19,30,0.045)]">
										<div className="mb-4 flex items-start justify-between gap-4">
											<div>
												<h3 className="text-[1.2rem] font-semibold text-[#191919]">{service.title}</h3>
												{service.duration ? <span className="text-[0.95rem] text-black/34">{service.duration}</span> : null}
											</div>
											<div className="flex items-center gap-3 text-black/46">
												<button type="button" onClick={() => onEditService(service)} className="transition hover:text-black" aria-label="Modifier le service">
													<PencilIcon className="h-5 w-5" />
												</button>
												<button type="button" className="transition hover:text-black" aria-label="Supprimer le service">
													<TrashIcon className="h-5 w-5" />
												</button>
											</div>
										</div>
										<div className="grid grid-cols-[96px_1fr] gap-4">
											<div>
												<div className="flex h-24 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#aba79c_0%,#7c786f_100%)] text-white">
													<PlusCircleIcon className="h-7 w-7" />
												</div>
												<p
													className="mt-3 text-center text-[2rem] tracking-[-0.04em] text-[#161616]"
													style={{ fontFamily: '"TAN Meringue", "Iowan Old Style", "Times New Roman", serif' }}
												>
													{service.price}
												</p>
											</div>
											<div className="flex min-h-[96px] flex-col">
												<p className="text-[0.96rem] leading-7 text-black/62">{service.description || 'Ajoutez une description pour ce service.'}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>

						<section className="mt-10">
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Descriptions</h2>
							<div className="rounded-[26px] border border-black/8 bg-white p-7 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
								{isEditing ? (
									<textarea
										value={draft.description}
										onChange={(event) => updateDraft('description', event.target.value)}
										className="h-[260px] w-full resize-none rounded-[18px] border border-black/8 bg-[#f7f7f8] p-5 text-[1rem] leading-8 text-black/68 outline-none transition focus:border-black/18 focus:bg-white"
										placeholder="Description"
									/>
								) : (
									<div className="text-[1rem] leading-8 text-black/66">
										{draft.description.split('\n\n').map((paragraph) => (
											<p key={paragraph} className="mb-6 last:mb-0">{paragraph}</p>
										))}
									</div>
								)}
							</div>
						</section>

						<section className="mt-10">
							<h2 className="mb-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Vitrine photo</h2>
							<div className="flex flex-wrap gap-4">
								{draft.gallery.map((photo, index) => (
									<div key={photo.id} className="group relative aspect-square w-[168px] overflow-hidden rounded-[22px] border border-black/6 bg-white shadow-[0_14px_34px_rgba(17,19,30,0.04)] sm:w-[182px] lg:w-[196px] xl:w-[210px]">
										<img src={photo.image} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
										<div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,16,18,0.18)]">
											<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/72 text-[#17181d] backdrop-blur-[2px]">
												{index === 2 ? <PlusCircleIcon className="h-8 w-8" /> : <PencilIcon className="h-7 w-7" />}
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>

					<aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
						<div className="overflow-hidden rounded-[26px] border border-black/8 bg-white p-4 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="relative h-[240px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#efe5c7_0%,#dad7cf_40%,#f1efe8_100%)]">
								<img src={navigationPlaceholder} alt="Carte" className="h-full w-full object-cover" />
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Politique de prestation</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							{isEditing ? (
								<textarea
									value={draft.policy}
									onChange={(event) => updateDraft('policy', event.target.value)}
									className="h-[150px] w-full resize-none rounded-[16px] border border-black/8 bg-[#f7f7f8] p-4 text-[0.96rem] leading-7 text-black/62 outline-none transition focus:border-black/18 focus:bg-white"
								/>
							) : (
								<p className="text-[0.96rem] leading-7 text-black/62">{draft.policy}</p>
							)}
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Actualités</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							{isEditing ? (
								<textarea
									value={draft.news}
									onChange={(event) => updateDraft('news', event.target.value)}
									className="h-[150px] w-full resize-none rounded-[16px] border border-black/8 bg-[#f7f7f8] p-4 text-[0.96rem] leading-7 text-black/62 outline-none transition focus:border-black/18 focus:bg-white"
								/>
							) : (
								<p className="text-[0.96rem] leading-7 text-black/62">{draft.news}</p>
							)}
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Horaires d’ouvertures</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							<div className="mt-4 overflow-hidden rounded-[16px] border border-black/6">
								{draft.hours.map(([day, hours], index) => (
									<div key={day} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/6 px-5 py-3.5 text-[1rem] last:border-b-0">
										<span className="text-[#2c2c2c]">{day}</span>
										{isEditing ? (
											<input
												type="text"
												value={hours}
												onChange={(event) => updateHour(index, event.target.value)}
												className="w-[120px] rounded-[10px] border border-black/8 bg-[#f7f7f8] px-3 py-1 text-right text-[0.92rem] outline-none transition focus:border-black/18 focus:bg-white"
											/>
										) : (
											<span className={`${hours === 'Fermé' ? 'text-black/34' : 'text-[#2c2c2c]'}`}>{hours}</span>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Avis</h3>
							<div className="mt-5 rounded-[18px] border border-black/6 p-5">
								<div className="flex items-center gap-2 text-[0.95rem] text-[#1d1d1d]">
									<span className="font-semibold">5,0</span>
									<StarIcon className="h-4 w-4" />
								</div>
								<p className="mt-4 text-[0.96rem] leading-7 text-black/62">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lo...</p>
								<div className="mt-4 flex justify-end text-[#1a1a1a]">→</div>
							</div>
						</div>

						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Nous suivre</h3>
								{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}
							</div>
							<div className="space-y-3 rounded-[18px] border border-black/6 px-4 py-4">
								{[
									{ id: 'instagram', label: 'Lien instagram' },
									{ id: 'tiktok', label: 'Lien tiktok' },
									{ id: 'link', label: 'Autre liens' },
								].map((item) => (
									<div key={item.id} className="grid grid-cols-[28px_1fr] items-center gap-3">
										<SocialIcon kind={item.id} className="h-6 w-6 text-[#111111]" />
										{isEditing ? (
											<input
												type="text"
												value={draft.socials[item.id]}
												onChange={(event) => updateSocial(item.id, event.target.value)}
												className="h-10 rounded-[12px] border border-black/8 bg-[#f7f7f8] px-3 text-[0.9rem] outline-none transition focus:border-black/18 focus:bg-white"
												placeholder={item.label}
											/>
										) : (
											<p className="text-[0.92rem] text-black/54">{draft.socials[item.id] || item.label}</p>
										)}
									</div>
								))}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

const newsItems = [
	{ tag: 'Fonctionnalité', date: 'Juin 2025', title: 'Réservation instantanée', body: 'Les clients peuvent désormais réserver sans confirmation manuelle de votre part.' },
	{ tag: 'Amélioration', date: 'Mai 2025', title: 'Nouveau tableau de bord', body: 'Statistiques enrichies et graphiques d\'évolution annuelle disponibles.' },
	{ tag: 'Correction', date: 'Avr. 2025', title: 'Notifications push', body: 'Les rappels de RDV sont maintenant envoyés 24 h à l\'avance.' },
	{ tag: 'Fonctionnalité', date: 'Mar. 2025', title: 'Messagerie intégrée', body: 'Échangez directement avec vos clients depuis votre espace professionnel.' },
	{ tag: 'Amélioration', date: 'Fév. 2025', title: 'Photos de profil', body: 'Ajoutez jusqu\'à 6 photos pour illustrer vos prestations.' },
];

function NewsCard({ item }) {
	return (
		<div className="rounded-[14px] bg-[#f6f7f9] px-4 py-3.5">
			<div className="mb-1.5 flex items-center gap-2">
				<span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${
					item.tag === 'Fonctionnalité' ? 'bg-[#0a0a0a] text-white' :
					item.tag === 'Amélioration' ? 'bg-black/8 text-black/60' :
					'bg-black/5 text-black/42'
				}`}>{item.tag}</span>
				<span className="text-[0.75rem] text-black/34">{item.date}</span>
			</div>
			<p className="text-[0.88rem] font-semibold text-[#1b1b1d]">{item.title}</p>
			<p className="mt-0.5 text-[0.82rem] leading-relaxed text-black/48">{item.body}</p>
		</div>
	);
}

export default function ProfessionalDashboardShell({ profile }) {
	const [currentProfile, setCurrentProfile] = useState(profile);
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

	const plannerDays = [
		{
			id: 'day-1',
			label: 'Vendredi',
			dayNumber: '20',
			appointments: [
				{ id: 'appt-1', service: 'Brushing', client: 'Chloé Ritel', time: '09:00 - 11:00' },
				{ id: 'appt-2', service: 'Boucle', client: 'Vanessa Trio', time: '13:00 - 15:00' },
				{ id: 'appt-3', service: 'Lissage', client: 'Rebecca Eart', time: '15:40 - 18:00' },
			],
		},
		{
			id: 'day-2',
			label: 'Samedi',
			dayNumber: '21',
			appointments: [
				{ id: 'appt-4', service: 'Coupe', client: 'Ariane Lopes', time: '10:00 - 11:30' },
				{ id: 'appt-5', service: 'Barbe', client: 'Karim Ben Ali', time: '12:30 - 13:30' },
			],
		},
		{
			id: 'day-3',
			label: 'Dimanche',
			dayNumber: '22',
			appointments: [
				{ id: 'appt-6', service: 'Soin', client: 'Mila Roussel', time: '11:00 - 12:00' },
				{ id: 'appt-7', service: 'Coloration', client: 'Zoé Lambert', time: '14:00 - 16:00' },
				{ id: 'appt-8', service: 'Lissage', client: 'Ines Martin', time: '16:30 - 18:00' },
			],
		},
	];

	const selectedPlannerDay = plannerDays[selectedDayIndex] ?? plannerDays[0];
	const dailyAppointments = selectedPlannerDay.appointments;

	const dailyStats = [
		{ label: 'Honorés', value: 11, color: '#1e1f25', textColor: '#1e1f25' },
		{ label: 'Annulés', value: 2, color: '#8f99ab', textColor: '#5d6777' },
		{ label: 'Rdv total', value: 17, color: '#c9d3e4', textColor: '#6b7485' },
	];

	const tips = [
		{ title: 'Soignez vos photos', body: 'Les prestataires avec des photos de qualité reçoivent jusqu\'à 3× plus de réservations.', img: tipsPerson },
		{ title: 'Répondez rapidement', body: 'Un temps de réponse court améliore votre positionnement dans les résultats de recherche.', img: tipsImg2 },
		{ title: 'Disponibilités à jour', body: 'Mettez à jour vos créneaux régulièrement pour rester visible et éviter les annulations.', img: tipsImg3 },
		{ title: 'Demandez des avis', body: 'Après chaque prestation, invitez vos clients à laisser un avis pour renforcer votre crédibilité.', img: tipsImg4 },
		{ title: 'Profil complet', body: 'Un profil renseigné à 100 % apparaît en priorité dans les suggestions Prestat.', img: tipsImg5 },
	];
	const [tipIndex, setTipIndex] = useState(0);
	const [statView, setStatView] = useState(0); // 0 = donut, 1 = courbe
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	useEffect(() => {
		setCurrentProfile(profile);
	}, [profile]);

	useEffect(() => {
		const id = window.setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 5000);
		return () => window.clearInterval(id);
	}, [tips.length]);

	const totalAppointments = dailyStats.reduce((sum, item) => sum + item.value, 0);
	const donutStops = dailyStats.reduce((accumulator, item, index) => {
		const previous = accumulator[index - 1]?.end ?? 0;
		const end = previous + (item.value / totalAppointments) * 100;
		accumulator.push({ ...item, start: previous, end });
		return accumulator;
	}, []);

	const [serviceTiles, setServiceTiles] = useState([
		{ id: 'srv-main', title: 'Brushing', price: '70€', description: '', large: true },
		{ id: 'srv-2', title: 'Coloration', price: '', description: '' },
		{ id: 'srv-3', title: 'Lissage', price: '', description: '' },
	]);

	const documentItems = [
		`FACTURE - ${companyName} - Avril.pdf`,
		`DEVIS - ${companyName} - Mai.pdf`,
	];
	function EmptyMediaPlaceholder({ label = '' }) {
		return (
			<div className="pointer-events-none flex h-full w-full items-center justify-center rounded-[inherit] bg-[linear-gradient(180deg,#f0f1f5_0%,#e1e5eb_100%)]">
				<div className="h-[54%] w-[54%] rounded-[18px] border-2 border-dashed border-black/12" />
				{label ? <span className="sr-only">{label}</span> : null}
			</div>
		);
	}

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
		if (!value) {
			return '01:00';
		}

		if (typeof value === 'string') {
			return value.slice(0, 5);
		}

		if (typeof value === 'object') {
			const hours = String(value.hours ?? value.hour ?? 1).padStart(2, '0');
			const minutes = String(value.minutes ?? value.minute ?? 0).padStart(2, '0');
			return `${hours}:${minutes}`;
		}

		return '01:00';
	}

	function formatServicePrice(value) {
		if (value === null || value === undefined || value === '') {
			return '';
		}

		const numericValue = Number(String(value).replace(',', '.'));
		if (Number.isNaN(numericValue)) {
			return `${value}€`;
		}

		const formatted = Number.isInteger(numericValue)
			? String(numericValue)
			: numericValue.toFixed(2).replace(/\.?0+$/, '');

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
			image: service.service_image_url || navigationPlaceholder,
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
				// Keep current fallback cards if the list endpoint is unavailable.
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
				headers: {
					'Content-Type': 'application/json',
				},
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
				image: service.image || navigationPlaceholder,
			})),
		});
	}, [baseProvider, professionalProviderId, currentProfile.company_address, currentProfile.company_name, serviceTiles]);

	useEffect(() => {
		function handlePopState() {
			startTransition(() => {
				setActiveProfessionalTab(getProfessionalTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

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

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#181818]">
			<div className="grid min-h-screen xl:grid-cols-[202px_1fr]">
				<aside className="hidden xl:flex xl:sticky xl:top-0 xl:h-screen xl:flex-col xl:overflow-hidden xl:border-r xl:border-white/10 xl:bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] xl:text-white">
					<div className="flex h-[92px] items-center justify-center border-b border-white/10 px-6 xl:h-[132px]">
						<a href="/" aria-label="Retour a l'accueil Prestat" className="transition hover:opacity-80">
							<img
								src={prestatLogo}
								alt="Prestat"
								className="w-[126px]"
								style={{ filter: 'brightness(0) invert(1)' }}
							/>
						</a>
					</div>

					<nav className="flex flex-1 flex-col px-5 pb-6 pt-6 xl:px-7 xl:pb-8 xl:pt-10">
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
							<SidebarLink href="/app/profil/professionnel" active={activeProfessionalTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleProfessionalSidebarNavigation}>
								Dashboard
							</SidebarLink>
							<SidebarLink href="/navigation" icon={CompassIcon}>
								Découvrir
							</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=favorites" active={activeProfessionalTab === 'favorites'} icon={BookmarkOutlineIcon} onNavigate={handleProfessionalSidebarNavigation}>
								Favoris
							</SidebarLink>
							<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => setIsDocumentsNoticeOpen(true)}>
								Documents
							</SidebarLink>
						</div>

						<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:mt-auto xl:grid-cols-1 xl:gap-5">
							<SidebarLink href="/app/profil/professionnel?tab=profile" active={activeProfessionalTab === 'profile'} icon={UserIcon} onNavigate={handleProfessionalSidebarNavigation}>
								Profil
							</SidebarLink>
							<SidebarLink href="/app/profil/professionnel?tab=settings" active={activeProfessionalTab === 'settings'} icon={SettingsIcon} onNavigate={handleProfessionalSidebarNavigation}>
								Paramètres
							</SidebarLink>
							<SidebarLink href="/deconnexion/client" icon={LogoutIcon}>
								Déconnexion
							</SidebarLink>
							<SidebarLink href="#" icon={HelpIcon}>
								Contact
							</SidebarLink>
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
											: activeProfessionalTab === 'profile'
												? 'Profil'
												: 'Dashboard'}
								</h1>
								<button
									type="button"
									onClick={() => setIsMobileSidebarOpen(true)}
									className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-black/8 bg-white text-[#151515] shadow-[0_10px_24px_rgba(24,24,35,0.035)] xl:hidden"
									aria-label="Ouvrir le menu du profil professionnel"
								>
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
							<button
								type="button"
								onClick={() => setIsCreateServiceOpen(true)}
								className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#101010] px-5 py-3.5 text-[0.96rem] font-semibold text-white shadow-[0_16px_32px_rgba(10,10,10,0.14)] sm:w-auto sm:px-6 sm:py-4 sm:text-[1rem]"
							>
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
					) : activeProfessionalTab === 'profile' ? (
						<ProfessionalProfile
							profile={currentProfile}
							serviceTiles={serviceTiles}
							onAddService={() => setIsCreateServiceOpen(true)}
							onEditService={openEditServiceModal}
						/>
					) : (
					<section className="px-5 pb-10 pt-8 sm:px-7 lg:px-9 lg:pt-9">

						{/* ── Rangée 1 : Planner · Stats · Astuces ── */}
						<div className="mb-8 grid gap-5 lg:grid-cols-3 lg:[grid-auto-rows:460px]">

							{/* 1. Planner */}
							<Reveal from="bottom" className="h-full">
								<button
									type="button"
									onClick={() => setIsDayPlannerOpen(true)}
									className="flex h-full w-full flex-col rounded-[26px] border border-black/6 bg-[linear-gradient(180deg,#fafafa_0%,#f1f3f7_100%)] p-6 text-left shadow-[0_16px_34px_rgba(17,19,30,0.05)] transition hover:-translate-y-px hover:shadow-[0_18px_36px_rgba(17,19,30,0.08)]"
								>
									{/* En-tête : jour */}
									<div className="mb-5">
										<p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black/36">
											{selectedPlannerDay.label}
										</p>
										<p className="mt-0.5 text-[3.8rem] font-semibold leading-none tracking-[-0.04em] text-[#17181d]">
											{selectedPlannerDay.dayNumber}
										</p>
									</div>

									{/* Cartes RDV en colonne */}
									<div className="flex flex-1 flex-col justify-center gap-2.5">
										{dailyAppointments.slice(0, 4).map((appointment, index) => (
											<div
												key={appointment.id}
												className={`flex items-center justify-between rounded-[14px] px-4 py-3 ${
													index % 3 === 1
														? 'bg-[#17181d] text-white'
														: 'border border-black/8 bg-white text-[#1f2024]'
												}`}
											>
												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<span className={`h-2 w-2 shrink-0 rounded-full ${index % 3 === 1 ? 'bg-white/60' : 'bg-[#1a1b20]'}`} />
														<p className={`truncate text-[0.78rem] font-semibold ${index % 3 === 1 ? 'text-white/60' : 'text-black/42'}`}>
															{appointment.service}
														</p>
													</div>
													<p className="mt-1 truncate pl-4 text-[0.92rem] font-semibold">{appointment.client}</p>
												</div>
												<p className={`ml-3 shrink-0 text-[0.82rem] ${index % 3 === 1 ? 'text-white/54' : 'text-black/44'}`}>
													{appointment.time}
												</p>
											</div>
										))}
									</div>

									{/* Navigation */}
									<div className="mt-4 flex items-center justify-end border-t border-black/5 pt-4">
										<div className="flex gap-2">
											<button
												type="button"
												onClick={(event) => { event.stopPropagation(); showPreviousPlannerDay(); }}
												className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5"
												aria-label="Jour précédent"
											>
												<ChevronIcon direction="left" className="h-3.5 w-3.5" />
											</button>
											<button
												type="button"
												onClick={(event) => { event.stopPropagation(); showNextPlannerDay(); }}
												className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5"
												aria-label="Jour suivant"
											>
												<ChevronIcon className="h-3.5 w-3.5" />
											</button>
										</div>
									</div>
								</button>
							</Reveal>

							{/* 2. Statistiques */}
							<Reveal from="bottom" delay={80} className="h-full">
								<div className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-black/36">Statistiques</p>
											<h3 className="mt-1 text-[1.1rem] font-semibold tracking-[-0.03em] text-[#171717]">
												{statView === 0 ? 'Rendez-vous du mois' : 'Évolution annuelle'}
											</h3>
										</div>
										<div className="shrink-0 rounded-full bg-[#f4f5f7] px-3 py-1 text-[0.78rem] font-medium text-black/44">
											{totalAppointments} au total
										</div>
									</div>

									{/* Vue 0 — Donut + légende à droite */}
									{statView === 0 ? (
										<div className="flex min-h-0 flex-1 items-center justify-center gap-6 overflow-hidden py-4">
											<div
												className="shrink-0 flex items-center justify-center rounded-full"
												style={{
													width: 140, height: 140,
													background: `conic-gradient(${donutStops.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})`,
												}}
											>
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
									) : (
										/* Vue 1 — Courbe annuelle */
										<div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-3">
											<svg viewBox="0 0 280 140" className="w-full" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
												{/* Grilles horizontales */}
												{[0,1,2,3,4].map((i) => (
													<line key={i} x1="32" y1={12 + i * 26} x2="276" y2={12 + i * 26}
														stroke="#e8eaed" strokeWidth="1" />
												))}
												{/* Labels Y */}
												{[250,200,150,100,50,0].map((v, i) => (
													<text key={v} x="28" y={15 + i * 22} textAnchor="end"
														fontSize="8" fill="#9ca3af">{v}</text>
												))}
												{/* Courbe */}
												{(() => {
													const pts = [18,35,52,68,90,108,125,148,185,210,235,248];
													const maxV = 250;
													const xs = pts.map((_, i) => 36 + i * 21.8);
													const ys = pts.map(v => 12 + (1 - v / maxV) * 104);
													const d = pts.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
													const area = `${d} L${xs[11].toFixed(1)},116 L${xs[0].toFixed(1)},116 Z`;
													return (
														<>
															<defs>
																<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
																	<stop offset="0%" stopColor="#1d9bf0" stopOpacity="0.18" />
																	<stop offset="100%" stopColor="#1d9bf0" stopOpacity="0" />
																</linearGradient>
															</defs>
															<path d={area} fill="url(#areaGrad)" />
															<path d={d} fill="none" stroke="#1d9bf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
															{pts.map((_, i) => (
																<circle key={i} cx={xs[i].toFixed(1)} cy={ys[i].toFixed(1)} r="3" fill="#1d9bf0" />
															))}
														</>
													);
												})()}
												{/* Labels X */}
												{['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].map((m, i) => (
													<text key={m} x={(36 + i * 21.8).toFixed(1)} y="130" textAnchor="middle"
														fontSize="7.5" fill="#9ca3af">{m}</text>
												))}
											</svg>
										</div>
									)}

									{/* Navigation */}
									<div className="mt-3 flex items-center justify-between border-t border-black/5 pt-4">
										<p className="text-[0.78rem] text-black/36">{statView === 0 ? '1/2' : '2/2'}</p>
										<div className="flex gap-2">
											<button type="button" onClick={() => setStatView(0)}
												className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 0 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`}
												aria-label="Vue camembert">
												<ChevronIcon direction="left" className="h-3.5 w-3.5" />
											</button>
											<button type="button" onClick={() => setStatView(1)}
												className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${statView === 1 ? 'border-black/20 bg-[#17181d] text-white' : 'border-black/10 text-black/50 hover:bg-black/5'}`}
												aria-label="Vue courbe">
												<ChevronIcon className="h-3.5 w-3.5" />
											</button>
										</div>
									</div>
								</div>
							</Reveal>

							{/* 3. Astuces */}
							<Reveal from="bottom" delay={160} className="h-full">
								<div className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#101114_0%,#14161a_100%)] shadow-[0_16px_34px_rgba(17,19,30,0.22)] text-white">

									{/* Images — cross-fade, centrées, grandes */}
									<div className="relative min-h-0 flex-1 overflow-hidden">
										<div className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-[radial-gradient(circle_at_55%_18%,rgba(255,176,84,0.32)_0%,rgba(255,176,84,0.12)_18%,rgba(255,176,84,0)_54%)]" />
										{tips.map((tip, i) => (
											<img
												key={tip.img}
												src={tip.img}
												alt=""
												aria-hidden="true"
												className="absolute inset-0 mx-auto h-full w-full object-contain object-center transition-opacity duration-700"
												style={{ opacity: i === tipIndex ? 1 : 0 }}
											/>
										))}
										{/* Fondu en bas vers la zone texte */}
										<div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,rgba(15,16,18,0)_0%,rgba(15,16,18,0.98)_100%)]" />
									</div>

									{/* Texte — positionné au bas */}
									<div className="px-7 pb-7 pt-0">
										<p className="text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-white/32">
											Astuce Prestat
										</p>
										<div key={tipIndex} className="animate-[viewFade_400ms_ease_both]">
											<h4 className="mt-2.5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
												{tips[tipIndex].title}
											</h4>
											<p className="mt-2.5 text-[0.95rem] leading-[1.65] text-white/54">
												{tips[tipIndex].body}
											</p>
										</div>
										<div className="mt-5 flex items-center justify-between">
											<div className="flex items-center gap-1.5">
												{tips.map((_, i) => (
													<button
														key={i}
														type="button"
														onClick={() => setTipIndex(i)}
														aria-label={`Astuce ${i + 1}`}
														className={`h-[3px] rounded-full transition-all duration-300 ${
															i === tipIndex ? 'w-6 bg-white' : 'w-[6px] bg-white/22'
														}`}
													/>
												))}
											</div>
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => setTipIndex((i) => (i - 1 + tips.length) % tips.length)}
													className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 transition hover:bg-white/18"
													aria-label="Astuce précédente"
												>
													<ChevronIcon direction="left" className="h-3.5 w-3.5" />
												</button>
												<button
													type="button"
													onClick={() => setTipIndex((i) => (i + 1) % tips.length)}
													className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 transition hover:bg-white/18"
													aria-label="Astuce suivante"
												>
													<ChevronIcon className="h-3.5 w-3.5" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</Reveal>
						</div>

						{/* ── Rangée 2 : Services · Documents · Nouveautés ── */}
						<div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)_minmax(0,1fr)]">
							<Reveal from="bottom" delay={130} className="h-full">
								<section className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-7 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
											<div className="mb-6 flex items-center justify-between">
												<h2 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-[#161616]">Services</h2>
												<div className="flex items-center gap-4 text-[var(--accent-mauve)]">
												<button type="button" onClick={showPreviousService} className="transition hover:opacity-70" aria-label="Service précédent">
													<ChevronIcon direction="left" className="h-6 w-6" />
												</button>
												<button type="button" onClick={showNextService} className="transition hover:opacity-70" aria-label="Service suivant">
													<ChevronIcon className="h-6 w-6" />
												</button>
												<button
													type="button"
													onClick={() => setIsServicesPanelOpen(true)}
													className="transition hover:opacity-70"
													aria-label="Afficher tous les services"
												>
													<DashboardIcon className="h-5 w-5" />
												</button>
											</div>
										</div>

										<div className="grid flex-1 gap-4 lg:grid-cols-[1fr_160px]">
											<div className="relative min-h-[290px] overflow-hidden rounded-[22px] border border-black/6 bg-[#ebeef4]">
												<img
													src={selectedService?.image || favoritesPlaceholder}
													alt="Illustration du service principal"
													className="absolute inset-0 h-full w-full object-cover"
												/>
												<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(18,18,18,0.02)_50%,rgba(10,10,10,0.18)_100%)]" />
												<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,rgba(22,22,24,0.02)_0%,rgba(18,18,20,0.28)_24%,rgba(14,14,16,0.56)_55%,rgba(10,10,12,0.8)_100%)] backdrop-blur-[4px]" />
												<div className="absolute inset-x-0 bottom-0 z-[1] grid gap-6 px-5 pb-5 pt-8 text-white sm:px-7 md:grid-cols-[190px_minmax(0,1fr)] md:items-end">
													<div className="self-end">
														<p className="text-[1.1rem] font-medium leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
															{selectedService?.title || 'Service'}
														</p>
														<p className="mt-1 text-[3.15rem] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
															{selectedService?.price || '--'}
														</p>
														<button
															type="button"
															onClick={() => selectedService && openEditServiceModal(selectedService)}
															className="mt-4 rounded-full bg-white px-4 py-1.5 text-[0.82rem] font-semibold text-[#151515] shadow-[0_10px_22px_rgba(17,19,30,0.16)] transition hover:-translate-y-px"
														>
															Modifier
														</button>
													</div>
													{selectedService?.description ? (
														<div className="flex min-h-[128px] items-start pt-1">
															<p
																className="max-w-[44ch] overflow-hidden text-[0.84rem] leading-7 text-white/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)] md:text-[0.92rem]"
																style={{
																	display: '-webkit-box',
																	WebkitLineClamp: 4,
																	WebkitBoxOrient: 'vertical',
																}}
															>
																{selectedService.description}
															</p>
														</div>
													) : (
														<div className="min-h-[128px]" />
													)}
												</div>
											</div>

											<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
												{previewServices.map((tile) => (
													<button
														key={tile.id}
														type="button"
														onClick={() => setSelectedServiceIndex(serviceTiles.findIndex((service) => service.id === tile.id))}
														className="relative min-h-[136px] overflow-hidden rounded-[18px] border border-black/6 bg-[#ebeef4] text-left transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(17,19,30,0.12)]"
													>
														<img src={tile.image || favoritesPlaceholder} alt={tile.title} className="absolute inset-0 h-full w-full object-cover" />
														<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(18,18,18,0.02)_48%,rgba(10,10,10,0.16)_100%)]" />
														<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,rgba(20,20,22,0.08)_0%,rgba(15,15,17,0.32)_38%,rgba(10,10,12,0.58)_100%)] backdrop-blur-[2px]" />
														<p className="absolute bottom-3 left-4 right-4 z-[1] text-[1rem] font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">{tile.title}</p>
													</button>
												))}
											</div>
										</div>
										{servicesLoading ? <p className="mt-4 text-[0.9rem] text-black/42">Chargement des services…</p> : null}
								</section>
							</Reveal>

							{/* Documents */}
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

							{/* Dernières nouvelles */}
							<Reveal from="bottom" delay={260} className="h-full">
								<aside className="flex h-full flex-col rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_16px_34px_rgba(17,19,30,0.05)]">
									<div className="mb-5 flex items-center justify-between">
										<h3 className="text-[1.15rem] font-semibold text-[#171717]">Dernières nouvelles</h3>
										<span className="rounded-full bg-[var(--accent-mauve-soft)] px-2.5 py-0.5 text-[0.72rem] font-medium text-[var(--accent-mauve)]">Nouveau</span>
									</div>
									<div className="flex flex-1 flex-col justify-between gap-3">
										{newsItems.slice(0, 2).map((item) => (
											<NewsCard key={item.title} item={item} />
										))}
									</div>
									<button
										type="button"
										onClick={() => setIsNewsOpen(true)}
										className="mt-4 w-full rounded-[14px] border border-black/8 py-2.5 text-[0.85rem] font-medium text-[var(--accent-mauve)] transition hover:bg-black/4 hover:opacity-75"
									>
										Tout voir
									</button>
								</aside>
							</Reveal>
						</div>
					</section>
					)}
				</div>
			</div>
			{isMobileSidebarOpen ? (
				<ModalPortal>
					<div className="fixed inset-0 z-[95] bg-[rgba(10,10,14,0.42)] backdrop-blur-[3px]" onClick={() => setIsMobileSidebarOpen(false)}>
						<div
							className="ml-auto flex h-full w-[min(86vw,340px)] flex-col bg-[linear-gradient(180deg,#090909_0%,#121212_100%)] px-5 pb-6 pt-5 text-white shadow-[-24px_0_50px_rgba(0,0,0,0.22)]"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="flex items-center justify-between border-b border-white/10 pb-4">
								<img
									src={prestatLogo}
									alt="Prestat"
									className="w-[118px]"
									style={{ filter: 'brightness(0) invert(1)' }}
								/>
								<button
									type="button"
									onClick={() => setIsMobileSidebarOpen(false)}
									className="rounded-full border border-white/12 px-3 py-1.5 text-[0.84rem] text-white/76"
								>
									Fermer
								</button>
							</div>

							<div className="mt-5 min-w-0">
								<p className="truncate text-[1rem] font-semibold text-white">{displayName}</p>
								<p className="mt-1 truncate text-[0.82rem] font-medium text-[#c7b2ec]">{companyName}</p>
							</div>

							<nav className="mt-8 flex flex-1 flex-col justify-between">
								<div className="space-y-6">
									<SidebarLink href="/app/profil/professionnel" active={activeProfessionalTab === 'dashboard'} icon={DashboardIcon} onNavigate={handleProfessionalSidebarNavigation}>
										Dashboard
									</SidebarLink>
									<SidebarLink href="/navigation" icon={CompassIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>
										Découvrir
									</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=favorites" active={activeProfessionalTab === 'favorites'} icon={BookmarkOutlineIcon} onNavigate={handleProfessionalSidebarNavigation}>
										Favoris
									</SidebarLink>
									<SidebarLink href="/documents" icon={DocumentIcon} onNavigate={() => {
										setIsMobileSidebarOpen(false);
										setIsDocumentsNoticeOpen(true);
									}}>
										Documents
									</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=profile" active={activeProfessionalTab === 'profile'} icon={UserIcon} onNavigate={handleProfessionalSidebarNavigation}>
										Profil
									</SidebarLink>
									<SidebarLink href="/app/profil/professionnel?tab=settings" active={activeProfessionalTab === 'settings'} icon={SettingsIcon} onNavigate={handleProfessionalSidebarNavigation}>
										Paramètres
									</SidebarLink>
								</div>

								<div className="space-y-6 pb-1">
									<SidebarLink href="/deconnexion/client" icon={LogoutIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>
										Déconnexion
									</SidebarLink>
									<SidebarLink href="#" icon={HelpIcon} onNavigate={() => setIsMobileSidebarOpen(false)}>
										Contact
									</SidebarLink>
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
							<div className="w-full max-w-[720px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
								<div className="flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Planning du jour</p>
										<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">
											{selectedPlannerDay.label} {selectedPlannerDay.dayNumber}
										</h2>
									</div>
									<button
										type="button"
										onClick={() => setIsDayPlannerOpen(false)}
										className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
									>
										Fermer
									</button>
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
							<div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
								<div className="mb-6 flex items-start justify-between gap-6">
									<div>
										<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
										<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Dernières nouvelles</h2>
									</div>
									<button
										type="button"
										onClick={() => setIsNewsOpen(false)}
										className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
									>
										Fermer
									</button>
								</div>
								<div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
									{newsItems.map((item) => (
										<NewsCard key={item.title} item={item} />
									))}
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
							<div className="w-full max-w-[760px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="mb-6 flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
								<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Tous les services</h2>
							</div>
							<button
								type="button"
								onClick={() => setIsServicesPanelOpen(false)}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>
						<div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
							{serviceTiles.map((service, index) => (
								<div
									key={service.id}
									className={`flex items-center justify-between gap-4 rounded-[18px] border px-5 py-4 ${
										index === selectedServiceIndex ? 'border-black/14 bg-[#f6f7f9]' : 'border-black/6 bg-white'
									}`}
								>
									<button
										type="button"
										onClick={() => {
											setSelectedServiceIndex(index);
											setIsServicesPanelOpen(false);
										}}
										className="min-w-0 flex-1 text-left"
									>
										<div className="flex items-center gap-3">
											<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#17181d]" />
											<p className="truncate text-[1rem] font-semibold text-[#171717]">{service.title}</p>
										</div>
										<div className="mt-1 flex items-center gap-3 pl-[22px]">
											<span className="text-[0.92rem] font-medium text-black/56">{service.price || '--'}</span>
											{service.duration ? <span className="text-[0.88rem] text-black/38">{service.duration}</span> : null}
										</div>
									</button>
									<button
										type="button"
										onClick={() => {
											setSelectedServiceIndex(index);
											setIsServicesPanelOpen(false);
											openEditServiceModal(service);
										}}
										className="shrink-0 rounded-full bg-[#101010] px-4 py-2 text-[0.84rem] font-semibold text-white transition hover:opacity-90"
									>
										Modifier
									</button>
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
							<div className="w-full max-w-[680px] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
						<div className="flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">
									{editingServiceId ? 'Modifier un service' : 'Nouveau service'}
								</p>
								<h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#171717]">
									{editingServiceId ? 'Modifier le service' : 'Ajouter un service'}
								</h2>
							</div>
							<button
								type="button"
								onClick={() => {
									setIsCreateServiceOpen(false);
									resetServiceForm();
								}}
								className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black"
							>
								Fermer
							</button>
						</div>

						<form className="mt-7 grid gap-5" onSubmit={handleCreateServiceSubmit}>
							<label className="flex flex-col gap-2">
								<span className="text-[0.94rem] font-medium text-[#171717]">Nom du service</span>
								<input
									type="text"
									value={serviceForm.service_name}
									onChange={(event) => handleServiceFieldChange('service_name', event.target.value)}
									className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white"
									placeholder="Ex: Brushing"
								/>
							</label>

							<label className="flex flex-col gap-2">
								<span className="text-[0.94rem] font-medium text-[#171717]">Description</span>
								<textarea
									value={serviceForm.service_description}
									onChange={(event) => handleServiceFieldChange('service_description', event.target.value)}
									className="min-h-[132px] rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 py-3 outline-none transition focus:border-black/18 focus:bg-white"
									placeholder="Décris la prestation proposée"
								/>
							</label>

							<div className="grid gap-5 md:grid-cols-2">
								<label className="flex flex-col gap-2">
									<span className="text-[0.94rem] font-medium text-[#171717]">Prix</span>
									<input
										type="number"
										min="0"
										step="0.01"
										value={serviceForm.service_price}
										onChange={(event) => handleServiceFieldChange('service_price', event.target.value)}
										className="h-12 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 outline-none transition focus:border-black/18 focus:bg-white"
										placeholder="70"
									/>
								</label>

								<label className="flex flex-col gap-2">
									<span className="text-[0.94rem] font-medium text-[#171717]">Durée</span>
									<div className="flex items-center gap-3">
										<input
											type="text"
											inputMode="numeric"
											maxLength={2}
											value={serviceForm.duration.split(':')[0]}
											onChange={(event) => {
												const hours = event.target.value.replace(/\D/g, '').slice(0, 2);
												const minutes = serviceForm.duration.split(':')[1] || '00';
												handleServiceFieldChange('duration', `${hours.padStart(hours.length || 1, '0')}:${minutes}`);
											}}
											className="h-12 w-20 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 text-center outline-none transition focus:border-black/18 focus:bg-white"
											placeholder="01"
										/>
										<span className="text-[1.2rem] font-semibold text-black/52">:</span>
										<input
											type="text"
											inputMode="numeric"
											maxLength={2}
											value={serviceForm.duration.split(':')[1]}
											onChange={(event) => {
												const minutes = event.target.value.replace(/\D/g, '').slice(0, 2);
												const hours = serviceForm.duration.split(':')[0] || '00';
												handleServiceFieldChange('duration', `${hours}:${minutes.padStart(minutes.length || 1, '0')}`);
											}}
											className="h-12 w-20 rounded-[14px] border border-black/8 bg-[#f7f7f8] px-4 text-center outline-none transition focus:border-black/18 focus:bg-white"
											placeholder="00"
										/>
									</div>
									<p className="text-[0.82rem] text-black/42">Heures et minutes, avec `:` fixe.</p>
								</label>
							</div>

							{serviceFormState.error ? <p className="text-[0.94rem] font-medium text-[#c35555]">{serviceFormState.error}</p> : null}
							{serviceFormState.message ? <p className="text-[0.94rem] font-medium text-[#1f6b3b]">{serviceFormState.message}</p> : null}

							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => {
										setIsCreateServiceOpen(false);
										resetServiceForm();
									}}
									className="rounded-[14px] border border-black/10 px-5 py-3 text-[0.94rem] font-medium text-black/58 transition hover:border-black/18 hover:text-black"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={serviceFormState.loading}
									className={`rounded-[14px] px-5 py-3 text-[0.94rem] font-semibold text-white ${
										serviceFormState.loading ? 'bg-black/30' : 'bg-[#101010]'
									}`}
								>
									{serviceFormState.loading ? (editingServiceId ? 'Modification…' : 'Création…') : (editingServiceId ? 'Enregistrer les modifications' : 'Créer le service')}
								</button>
							</div>
						</form>
					</div>
						</div>
					</div>
				</ModalPortal>
			) : null}
			<DevelopmentNoticeModal open={isDocumentsNoticeOpen} onClose={() => setIsDocumentsNoticeOpen(false)} />
		</main>
	);
}
