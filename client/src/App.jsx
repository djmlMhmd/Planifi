import { useMemo } from 'react';
import About from './components/About/About';
import CitiesCarousel from './components/CitiesCarousel/CitiesCarousel';
import Faq from './components/Faq/Faq';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProviderSignupPage from './components/ProviderSignupPage/ProviderSignupPage';

export default function App() {
	const pathname = useMemo(() => {
		const normalized = window.location.pathname.replace(/\/+$/, '');
		return normalized || '/';
	}, []);

	const isProviderSignupPage = pathname === '/app/proposer-service';

	if (isProviderSignupPage) {
		return (
			<>
				<Header variant="provider-signup" />
				<ProviderSignupPage />
				<Footer />
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
