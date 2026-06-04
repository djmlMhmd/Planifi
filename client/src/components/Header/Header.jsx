import AppHeader from '../AppHeader/AppHeader';

export default function Header({ variant = 'home' }) {
	return <HeaderContent variant={variant} />;
}

export function HeaderContent({ variant = 'home' }) {
	const isProviderSignup = variant === 'provider-signup';
	const ctaHref = isProviderSignup ? '/connexion/' : '/inscription/';
	const ctaLabel = isProviderSignup ? 'Connexion' : "S'inscrire";

	return <AppHeader ctaHref={ctaHref} ctaLabel={ctaLabel} homeHref="/" />;
}
