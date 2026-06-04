import { useMemo } from 'react';
import AppHeader from './components/AppHeader/AppHeader';
import About from './components/About/About';
import AuthPage from './components/AuthPage/AuthPage';
import CitiesCarousel from './components/CitiesCarousel/CitiesCarousel';
import Faq from './components/Faq/Faq';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ProviderSignupPage from './components/ProviderSignupPage/ProviderSignupPage';

export default function App() {
	const pathname = useMemo(() => {
		const normalized = window.location.pathname.replace(/\/+$/, '');
		return normalized || '/';
	}, []);

	const isProviderSignupPage = pathname === '/app/proposer-service';
	const isClientProfilePage = pathname === '/app/profil';
	const isProfessionalProfilePage = pathname === '/app/profil/professionnel';
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
