import { startTransition, useEffect, useRef, useState } from 'react';
import AppHeader from './components/AppHeader/AppHeader';
import About from './components/About/About';
import AuthPage from './components/AuthPage/AuthPage';
import CitiesCarousel from './components/CitiesCarousel/CitiesCarousel';
import ConnectedNavbar from './components/ConnectedNavbar/ConnectedNavbar';
import Faq from './components/Faq/Faq';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import NavigationPage from './components/NavigationPage/NavigationPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ReservationPage from './components/ReservationPage/ReservationPage';
import ProviderDetailPage from './components/ProviderDetailPage/ProviderDetailPage';
import ProviderSignupPage from './components/ProviderSignupPage/ProviderSignupPage';
import { getCurrentLocation, isInternalNavigationTarget, navigateTo } from './lib/navigation';

export default function App() {
	const [location, setLocation] = useState(() => getCurrentLocation());
	const [renderLocation, setRenderLocation] = useState(() => getCurrentLocation());
	const [transitionStage, setTransitionStage] = useState('idle');
	const exitTimerRef = useRef(null);
	const enterTimerRef = useRef(null);
	const pathname = renderLocation.pathname;

	useEffect(() => {
		function handleLocationChange() {
			// Je passe le changement de vue en transition pour éviter
			// un rendu trop brutal quand une page lourde monte.
			startTransition(() => {
				setLocation(getCurrentLocation());
			});
		}

		window.addEventListener('popstate', handleLocationChange);
		window.addEventListener('codex:navigation', handleLocationChange);
		return () => {
			window.removeEventListener('popstate', handleLocationChange);
			window.removeEventListener('codex:navigation', handleLocationChange);
		};
	}, []);

	useEffect(() => {
		if (location.pathname === '/app/calendar') {
			navigateTo('/app/profil?tab=calendar', { replace: true });
		}
	}, [location.pathname]);

	useEffect(() => {
		if (
			location.pathname === renderLocation.pathname &&
			location.search === renderLocation.search
		) {
			return;
		}

		window.clearTimeout(exitTimerRef.current);
		window.clearTimeout(enterTimerRef.current);
		setRenderLocation(location);
		setTransitionStage('enter');

		enterTimerRef.current = window.setTimeout(() => {
			setTransitionStage('idle');
		}, 180);

		return () => {
			window.clearTimeout(exitTimerRef.current);
			window.clearTimeout(enterTimerRef.current);
		};
	}, [location, renderLocation.pathname, renderLocation.search]);

	useEffect(() => () => {
		window.clearTimeout(exitTimerRef.current);
		window.clearTimeout(enterTimerRef.current);
	}, []);

	useEffect(() => {
		function handleDocumentClick(event) {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const anchor = event.target.closest('a[href]');
			if (!anchor) {
				return;
			}

			if (
				anchor.target === '_blank' ||
				anchor.hasAttribute('download') ||
				anchor.getAttribute('rel') === 'external'
			) {
				return;
			}

			const href = anchor.getAttribute('href');
			if (!isInternalNavigationTarget(href)) {
				return;
			}

			event.preventDefault();
			navigateTo(href);
		}

		document.addEventListener('click', handleDocumentClick);
		return () => {
			document.removeEventListener('click', handleDocumentClick);
		};
	}, []);

	const isProviderSignupPage = pathname === '/app/proposer-service';
	const isReservationPage = pathname === '/app/reservation';
	const isCalendarPage = pathname === '/app/calendar';
	const isClientProfilePage = pathname === '/app/profil';
	const isProfessionalProfilePage = pathname === '/app/profil/professionnel';
	const isNavigationPage = pathname === '/navigation';
	const isProviderDetailPage = pathname === '/services';
	const isSignupPage = pathname === '/inscription';
	const isLoginPage = pathname === '/connexion';

	let page;

	if (isProviderSignupPage) {
		page = (
			<>
				<Header variant="provider-signup" />
				<ProviderSignupPage />
				<Footer />
			</>
		);
	} else if (isReservationPage) {
		page = (
			<>
				<ConnectedNavbar />
				<ReservationPage />
			</>
		);
	} else if (isCalendarPage) {
		page = null;
	} else if (isSignupPage || isLoginPage) {
		page = (
			<>
				<AppHeader
					ctaHref={isLoginPage ? '/inscription/' : '/connexion/'}
					ctaLabel={isLoginPage ? 'Inscription' : 'Connexion'}
					homeHref="/"
				/>
				<AuthPage initialMode={isLoginPage ? 'login' : 'signup'} />
			</>
		);
	} else if (isClientProfilePage || isProfessionalProfilePage) {
		page = (
			<>
				<ProfilePage variant={isProfessionalProfilePage ? 'professional' : 'client'} />
			</>
		);
	} else if (isNavigationPage) {
		page = (
			<>
				<ConnectedNavbar />
				<NavigationPage />
			</>
		);
	} else if (isProviderDetailPage) {
		page = (
			<>
				<ConnectedNavbar />
				<ProviderDetailPage />
			</>
		);
	} else {
		page = (
			<>
				<Header variant="home" />
				<Hero />
				<CitiesCarousel />
				<About />
				<Faq />
				<Footer />
			</>
		);
	}

	return (
		<div className={`app-shell app-shell--${transitionStage}`}>
			{page}
		</div>
	);
}
