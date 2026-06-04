import { useEffect, useState } from 'react';
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
import { getCurrentLocation } from './lib/navigation';

export default function App() {
	const [location, setLocation] = useState(() => getCurrentLocation());
	const pathname = location.pathname;

	useEffect(() => {
		function handleLocationChange() {
			setLocation(getCurrentLocation());
		}

		window.addEventListener('popstate', handleLocationChange);
		window.addEventListener('codex:navigation', handleLocationChange);
		return () => {
			window.removeEventListener('popstate', handleLocationChange);
			window.removeEventListener('codex:navigation', handleLocationChange);
		};
	}, []);

	const isProviderSignupPage = pathname === '/app/proposer-service';
	const isReservationPage = pathname === '/app/reservation';
	const isClientProfilePage = pathname === '/app/profil';
	const isProfessionalProfilePage = pathname === '/app/profil/professionnel';
	const isNavigationPage = pathname === '/navigation';
	const isProviderDetailPage = pathname === '/services';
	const isSignupPage = pathname === '/inscription';
	const isLoginPage = pathname === '/connexion';

	if (isProviderSignupPage) {
		return (
			<>
				<Header variant="provider-signup" />
				<ProviderSignupPage />
				<Footer />
			</>
		);
	}

	if (isReservationPage) {
		return (
			<>
				<ConnectedNavbar />
				<ReservationPage />
			</>
		);
	}

	if (isSignupPage || isLoginPage) {
		return (
			<>
				<AppHeader
					ctaHref={isLoginPage ? '/inscription/' : '/connexion/'}
					ctaLabel={isLoginPage ? 'Inscription' : 'Connexion'}
					homeHref="/"
				/>
				<AuthPage initialMode={isLoginPage ? 'login' : 'signup'} />
			</>
		);
	}

	if (isClientProfilePage || isProfessionalProfilePage) {
		return (
			<>
				<ProfilePage variant={isProfessionalProfilePage ? 'professional' : 'client'} />
			</>
		);
	}

	if (isNavigationPage) {
		return (
			<>
				<ConnectedNavbar />
				<NavigationPage />
			</>
		);
	}

	if (isProviderDetailPage) {
		return (
			<>
				<ConnectedNavbar />
				<ProviderDetailPage />
			</>
		);
	}

	return (
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
