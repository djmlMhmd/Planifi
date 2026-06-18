import { startTransition, useEffect, useMemo, useState } from 'react';
import { navigateTo } from '../../lib/navigation';
import {
  getProfileTabFromLocation,
} from './ProfilePage.shared';
import { buildFallbackReservations, buildInvoiceItems, buildQuoteItems, favoriteNewsItems, reviewCards } from './clientShell/clientProfileData';
import { ClientDesktopSidebar, ClientHeader, ClientTabContent } from './clientShell/ClientProfileParts';
import { ClientProfileModals } from './clientShell/ClientProfileModals';

export default function DashboardShell({ profile, reservations, onProfileUpdated }) {
	const invoiceItems = useMemo(
		// Je génère des libellés cohérents à partir du profil client.
		() => buildInvoiceItems(profile),
		[profile.city, profile.firstName, profile.lastName]
	);
	const quoteItems = useMemo(
		() => buildQuoteItems(profile),
		[profile.city, profile.firstName, profile.lastName]
	);

	async function handleLogout() {
		// await bloque seulement cette fonction ici le temps que la déconnexion réponde,
		// comme ça je ne redirige pas le user avant que la session soit bien fermée côté back.
		await fetch('/deconnexion/client', { method: 'POST', credentials: 'same-origin' });
		navigateTo('/connexion/');
	}

	// L'onglet actif reste synchronisé avec l'URL pour éviter d'ajouter un router plus lourd ici.
	const [activeTab, setActiveTab] = useState(() => getProfileTabFromLocation());
	const [contentVisible, setContentVisible] = useState(true);
	const [isDocumentsNoticeOpen, setIsDocumentsNoticeOpen] = useState(false);
	const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
	const [billingView, setBillingView] = useState('invoices');
	const [billingQuery, setBillingQuery] = useState('');
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [dashboardHighlight, setDashboardHighlight] = useState('reviews');
	const [reviewModalProvider, setReviewModalProvider] = useState('');
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewComment, setReviewComment] = useState('');
	const [reviewHoverRating, setReviewHoverRating] = useState(0);
	const [reviewStep, setReviewStep] = useState('form');

	// Si le backend a déjà des réservations je les prends, sinon je garde un fallback visuel.
	const reservationList = reservations.length
		? reservations.slice(0, 7)
		: buildFallbackReservations();
	const shouldShowAllReservationsButton = reservations.length >= 6;
	const fullReservationList = reservations.length ? reservations : reservationList;
	const billingItems = billingView === 'invoices' ? invoiceItems : quoteItems;
	const filteredBillingItems = billingItems.filter((item) =>
		item.toLowerCase().includes(billingQuery.trim().toLowerCase())
	);
	const profileAvatarFallback = {
		...profile,
		profile_picture: '',
		profile_picture_preview: '',
	};

	function openReviewModal(providerName) {
		// J'ouvre la modale en repartant d'un état propre pour éviter de réafficher
		// la note ou le commentaire de l'avis précédent.
		setReviewModalProvider(providerName);
		setReviewRating(0);
		setReviewComment('');
		setReviewHoverRating(0);
		setReviewStep('form');
	}

	function closeReviewModal() {
		// Je ferme la modale et je remets juste les états liés au hover / étape,
		// le reset complet sera refait à la prochaine ouverture.
		setReviewModalProvider('');
		setReviewHoverRating(0);
		setReviewStep('form');
	}

	function handleReviewSubmit(event) {
		// Je garde le submit natif du form mais j'empêche le rechargement de page
		// pour piloter la confirmation directement en React.
		event.preventDefault();

		if (!reviewRating) {
			return;
		}

		setReviewStep('success');
		// Je laisse le message de confirmation respirer un instant,
		// puis je ferme la modale automatiquement.
		window.setTimeout(() => {
			closeReviewModal();
		}, 1800);
	}

	useEffect(() => {
		// Je resynchronise l'onglet si l'utilisateur navigue avec précédent / suivant.
		function handlePopState() {
			startTransition(() => {
				setActiveTab(getProfileTabFromLocation());
			});
		}

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	useEffect(() => {
		// Petite transition d'entrée quand on change d'onglet.
		setContentVisible(false);

		const animationFrameId = window.requestAnimationFrame(() => {
			setContentVisible(true);
		});

		return () => window.cancelAnimationFrame(animationFrameId);
	}, [activeTab]);

	function handleSidebarNavigation(href) {
		// Si on ne change pas de page, je gère juste le changement d'onglet localement.
		setIsMobileSidebarOpen(false);
		const targetUrl = new URL(href, window.location.origin);
		const nextTab = getProfileTabFromLocation(targetUrl.search);

		if (targetUrl.pathname !== window.location.pathname) {
			// Ici je suis sur une vraie autre page, donc je laisse
			// le helper de navigation faire le changement complet.
			navigateTo(targetUrl.toString());
			return;
		}

		if (nextTab === activeTab) {
			return;
		}

		// pushState change juste l'URL dans l'historique du navigateur
		// sans recharger la page, ce qui est parfait pour des onglets front.
		window.history.pushState({}, '', `${targetUrl.pathname}${targetUrl.search}`);
		startTransition(() => {
			setActiveTab(nextTab);
		});
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#fcfcfa_45%,#f3f1ec_100%)] text-[#1f1f1f]">
			<div className="grid min-h-screen xl:grid-cols-[210px_1fr]">
				<ClientDesktopSidebar activeTab={activeTab} handleSidebarNavigation={handleSidebarNavigation} handleLogout={handleLogout} setIsDocumentsNoticeOpen={setIsDocumentsNoticeOpen} />

				<div className="min-w-0">
					<ClientHeader activeTab={activeTab} profile={profile} profileAvatarFallback={profileAvatarFallback} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
					<ClientTabContent
						activeTab={activeTab}
						profile={profile}
						onProfileUpdated={onProfileUpdated}
						contentVisible={contentVisible}
						dashboardHighlight={dashboardHighlight}
						setDashboardHighlight={setDashboardHighlight}
						favoriteNewsItems={favoriteNewsItems}
						reviewCards={reviewCards}
						openReviewModal={openReviewModal}
						billingView={billingView}
						setBillingView={setBillingView}
						billingQuery={billingQuery}
						setBillingQuery={setBillingQuery}
						filteredBillingItems={filteredBillingItems}
						reservationList={reservationList}
						shouldShowAllReservationsButton={shouldShowAllReservationsButton}
						setIsReservationsModalOpen={setIsReservationsModalOpen}
					/>
				</div>
			</div>
			<ClientProfileModals
				isMobileSidebarOpen={isMobileSidebarOpen}
				setIsMobileSidebarOpen={setIsMobileSidebarOpen}
				profile={profile}
				profileAvatarFallback={profileAvatarFallback}
				activeTab={activeTab}
				handleSidebarNavigation={handleSidebarNavigation}
				handleLogout={handleLogout}
				isDocumentsNoticeOpen={isDocumentsNoticeOpen}
				setIsDocumentsNoticeOpen={setIsDocumentsNoticeOpen}
				reviewModalProvider={reviewModalProvider}
				reviewStep={reviewStep}
				closeReviewModal={closeReviewModal}
				handleReviewSubmit={handleReviewSubmit}
				reviewRating={reviewRating}
				reviewHoverRating={reviewHoverRating}
				setReviewHoverRating={setReviewHoverRating}
				setReviewRating={setReviewRating}
				reviewComment={reviewComment}
				setReviewComment={setReviewComment}
				isReservationsModalOpen={isReservationsModalOpen}
				setIsReservationsModalOpen={setIsReservationsModalOpen}
				fullReservationList={fullReservationList}
			/>
			</main>
	);
}
