import { useEffect, useState } from 'react';
import favoritesPlaceholder from '../../../assets/favorites-placeholder.jpg';
import navigationPlaceholder from '../../../assets/navigation-placeholder.jpg';
import providerGalleryOne from '../../../assets/provider-gallery-1.jpg';
import providerGalleryTwo from '../../../assets/provider-gallery-2.jpg';
import { getProviderById, saveProfessionalProvider, saveProviderOverride } from '../../../data/providers';
import { PencilIcon, PinIcon, PlusCircleIcon, SocialIcon, StarIcon, TrashIcon, VerifiedBadge, getProfessionalProviderStorageId, resolveProfessionalProviderId } from '../ProfilePage.shared';

export default function ProfessionalProfileView({ profile, serviceTiles, onAddService, onEditService }) {
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
		gallery: provider.gallery.length ? provider.gallery : [{ id: 'g1', image: providerGalleryOne, alt: 'Photo vitrine 1' }, { id: 'g2', image: providerGalleryTwo, alt: 'Photo vitrine 2' }, { id: 'g3', image: favoritesPlaceholder, alt: 'Photo vitrine 3' }],
		socials: {
			instagram: provider.socials.find((item) => item.id === 'instagram')?.href || '',
			tiktok: provider.socials.find((item) => item.id === 'tiktok')?.href || '',
			link: provider.socials.find((item) => item.id === 'link')?.href || '',
		},
	}));

	useEffect(() => {
		setDraft((current) => ({
			...current,
			company: profile.company_name || provider.company,
			location: profile.company_address || provider.location,
		}));
	}, [profile.company_name, profile.company_address, provider.company, provider.location]);

	function updateDraft(field, value) {
		setDraft((current) => ({ ...current, [field]: value }));
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
			services: serviceTiles.map((service) => ({ id: service.id, name: service.title, duration: service.duration || '1h', price: service.price, description: service.description || '' })),
		};

		saveProviderOverride(providerId, nextProviderData);
		saveProfessionalProvider({ ...provider, ...nextProviderData, id: professionalProviderId });
		setIsEditing(false);
		setSaveState('Modifications enregistrées.');
	}

	return (
		<div className="px-9 pb-12 pt-9">
			<div className="mx-auto max-w-[1480px]">
				<div className="mb-8 flex flex-wrap items-center gap-4">
					<button type="button" onClick={() => setIsEditing((value) => !value)} className="rounded-full border border-black/12 bg-white px-5 py-2.5 text-[0.95rem] font-medium text-[#171717] transition hover:border-black/18 hover:bg-black/[0.02]">{isEditing ? 'Annuler l’édition' : 'Éditer le profil'}</button>
					<button type="button" onClick={handleSaveProfile} className="rounded-full bg-[#101010] px-5 py-2.5 text-[0.95rem] font-medium text-white shadow-[0_14px_28px_rgba(17,19,30,0.14)] transition hover:-translate-y-px">Enregistrer</button>
					{saveState ? <p className="text-[0.9rem] text-black/48">{saveState}</p> : null}
				</div>

				<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
					<div className="min-w-0">
						<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
							<div className="flex items-start gap-5">
								<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#dbc78f] bg-white shadow-[0_16px_34px_rgba(17,19,30,0.04)]">
									<div className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1b20] text-white shadow-[0_10px_24px_rgba(17,19,30,0.18)]"><PlusCircleIcon className="h-5 w-5" /></div>
								</div>
								<div className="pt-2">
									{isEditing ? <input type="text" value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} className="w-full max-w-[420px] rounded-[16px] border border-black/8 bg-white px-4 py-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#181818] outline-none transition focus:border-black/18" /> : <h1 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#181818]">{draft.company}</h1>}
									<div className="mt-3 flex items-center gap-2 text-[1rem] font-medium text-[#1f1f1f]"><PinIcon className="h-[18px] w-[18px]" /> <span>{draft.location}</span></div>
									<div className="mt-2 flex items-center gap-2 text-[0.96rem] text-black/48"><VerifiedBadge className="h-[18px] w-[18px]" /><span>utilisateur vérifié</span></div>
								</div>
							</div>
						</div>

						<div className="mb-8">
							<button type="button" onClick={onAddService} className="inline-flex items-center gap-2 rounded-full bg-[#1a1b20] px-4 py-2.5 text-[0.9rem] font-medium text-white shadow-[0_12px_24px_rgba(17,19,30,0.14)]"><PlusCircleIcon className="h-4 w-4" />Ajouter un service</button>
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
												<button type="button" onClick={() => onEditService(service)} className="transition hover:text-black" aria-label="Modifier le service"><PencilIcon className="h-5 w-5" /></button>
												<button type="button" className="transition hover:text-black" aria-label="Supprimer le service"><TrashIcon className="h-5 w-5" /></button>
											</div>
										</div>
										<div className="grid grid-cols-[96px_1fr] gap-4">
											<div>
												<div className="flex h-24 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#aba79c_0%,#7c786f_100%)] text-white"><PlusCircleIcon className="h-7 w-7" /></div>
												<p className="mt-3 text-center text-[2rem] tracking-[-0.04em] text-[#161616]">{service.price}</p>
											</div>
											<div className="flex min-h-[96px] flex-col"><p className="text-[0.96rem] leading-7 text-black/62">{service.description || 'Ajoutez une description pour ce service.'}</p></div>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>

					<aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
						<div className="overflow-hidden rounded-[26px] border border-black/8 bg-white p-4 shadow-[0_16px_38px_rgba(17,19,30,0.045)]"><div className="relative h-[240px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#efe5c7_0%,#dad7cf_40%,#f1efe8_100%)]"><img src={navigationPlaceholder} alt="Carte" className="h-full w-full object-cover" /></div></div>
						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]"><h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Avis</h3><div className="mt-5 rounded-[18px] border border-black/6 p-5"><div className="flex items-center gap-2 text-[0.95rem] text-[#1d1d1d]"><span className="font-semibold">5,0</span><StarIcon className="h-4 w-4" /></div><p className="mt-4 text-[0.96rem] leading-7 text-black/62">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div></div>
						<div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_38px_rgba(17,19,30,0.045)]"><div className="mb-4 flex items-center justify-between"><h3 className="text-center text-[1.15rem] font-semibold text-[#222222]">Nous suivre</h3>{isEditing ? <PencilIcon className="h-5 w-5 text-black/36" /> : null}</div><div className="space-y-3 rounded-[18px] border border-black/6 px-4 py-4">{['instagram', 'tiktok', 'link'].map((item) => <div key={item} className="grid grid-cols-[28px_1fr] items-center gap-3"><SocialIcon kind={item} className="h-6 w-6 text-[#111111]" /><p className="text-[0.92rem] text-black/54">{item}</p></div>)}</div></div>
					</aside>
				</div>
			</div>
		</div>
	);
}
