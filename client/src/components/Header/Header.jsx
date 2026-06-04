import prestatLogo from '../../assets/prestat-logo.svg';
import s from './Header.module.css';

function ThinArrow() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default function Header({ variant = 'home' }) {
	return <HeaderContent variant={variant} />;
}

export function HeaderContent({ variant = 'home' }) {
	const isProviderSignup = variant === 'provider-signup';
	const navHref = isProviderSignup ? '/app/proposer-service' : '/app/proposer-service';
	const ctaHref = isProviderSignup ? '/connexion/' : '/inscription/';
	const ctaLabel = isProviderSignup ? 'Connexion' : "S'inscrire";

	return (
		<header className={s.header}>
			<div className={s.topbar}>
				<a className={s.brandMark} href="/app/" aria-label="Planifi accueil">
					<img className={s.logo} src={prestatLogo} alt="Planifi" />
				</a>
				<nav className={s.nav}>
					<a className={s.navLink} href={navHref}>Proposer un service</a>
					<a className={s.cta} href={ctaHref}>
						{ctaLabel}
						<ThinArrow />
					</a>
				</nav>
			</div>
		</header>
	);
}
