import { useState } from 'react';
import aboutWorkImage from './assets/about-work.jpg';
import bordeauxImage from './assets/bordeaux.jpg';
import heroArchitectureImage from './assets/hero-architecture.jpg';
import prestatLogo from './assets/prestat-logo.svg';

const faqItems = [
	{
		question: "Prestat c'est quoi ?",
		answer:
			"Prestat est une plateforme qui met en relation les particuliers avec des professionnels de divers domaines, facilitant la prise et la gestion de rendez-vous en toute simplicite.",
	},
	{
		question: "Reserver, c'est facile ?",
		answer:
			"Oui. Vous recherchez un service, choisissez un professionnel, puis reservez en quelques clics depuis une interface claire et rapide a utiliser.",
	},
	{
		question: 'Comment je gere mes rendez-vous ?',
		answer:
			'Depuis votre espace, vous pouvez retrouver vos reservations, suivre vos disponibilites et ajuster vos rendez-vous sans friction.',
	},
	{
		question: 'Comment proposer mes services sur Prestat ?',
		answer:
			"Il suffit de creer votre compte, completer votre profil professionnel et publier vos prestations pour commencer a recevoir des demandes.",
	},
];

const professionals = [
	'Coiffeurs a domicile',
	'Photographes',
	'Coachs sportifs',
	'Artisans',
];

const frequentSearches = [
	'Coiffure a Bordeaux',
	'Photographe evenementiel',
	'Cours de sport a domicile',
	'Services menagers',
];

function App() {
	const [openFaq, setOpenFaq] = useState(0);

	return (
		<div className="landing-page">
			<header className="site-header">
				<div className="topbar">
					<a className="brand-mark" href="/app/" aria-label="Prestat accueil">
						<img src={prestatLogo} alt="Prestat" />
					</a>
					<nav className="topbar-nav">
						<a className="nav-link dark" href="#faq">
							Proposer un service
						</a>
						<a className="pill-button light" href="/inscription/">
							S&apos;inscrire
							<span aria-hidden="true">{'→'}</span>
						</a>
					</nav>
				</div>
			</header>

			<section
				className="hero-section"
				style={{ '--hero-image': `url(${heroArchitectureImage})` }}
			>
				<div className="hero-backdrop" />
				<div className="hero-panel">
					<div className="hero-copy">
						<p className="hero-kicker">A portee de main</p>
						<h1>Reservez en un instant</h1>
						<p className="hero-subtitle">
							Trouvez le bon prestataire, au bon endroit, sans perdre de
							temps.
						</p>
					</div>

					<form className="search-bar" onSubmit={(event) => event.preventDefault()}>
						<label className="search-field">
							<span className="sr-only">Cherchez un prestataire</span>
							<input
								type="text"
								placeholder="Cherchez un prestataire"
								aria-label="Cherchez un prestataire"
							/>
						</label>
						<label className="search-field location-field">
							<span className="sr-only">Ville ou lieu</span>
							<input
								type="text"
								placeholder="Ville, Lieu..."
								aria-label="Ville ou lieu"
							/>
						</label>
						<button className="search-button" type="submit">
							Rechercher
							<span aria-hidden="true">o</span>
						</button>
					</form>
				</div>
			</section>

			<section className="showcase-section">
				<div className="showcase-copy">
					<h2>Trouvez des prestataires proches de chez vous</h2>
					<p>A portee de main...</p>
				</div>

				<article className="city-card">
					<div className="city-card-image-wrap">
						<img src={bordeauxImage} alt="Place de la Bourse a Bordeaux" />
						<div className="city-card-rail" aria-hidden="true">
							<span />
						</div>
					</div>
					<h3>Bordeaux</h3>
				</article>
			</section>

			<section className="about-section">
				<div className="about-heading">
					<h2>Tout savoir sur nous...</h2>
				</div>

				<div className="about-image-panel">
					<img
						src={aboutWorkImage}
						alt="Professionnel organisant son activite depuis son ordinateur"
					/>
				</div>
			</section>

			<section className="faq-section" id="faq">
				<div className="faq-list">
					{faqItems.map((item, index) => {
						const isOpen = openFaq === index;

						return (
							<article className={`faq-item ${isOpen ? 'open' : ''}`} key={item.question}>
								<button
									className="faq-trigger"
									type="button"
									onClick={() => setOpenFaq(isOpen ? -1 : index)}
									aria-expanded={isOpen}
								>
									<span>{item.question}</span>
									<span className="faq-icon" aria-hidden="true">
										{isOpen ? '-' : 'v'}
									</span>
								</button>
								{isOpen ? (
									<div className="faq-answer">
										<p>{item.answer}</p>
									</div>
								) : null}
							</article>
						);
					})}
				</div>
			</section>

			<footer className="site-footer">
				<div className="footer-content">
					<div className="footer-brand">
						<img src={prestatLogo} alt="Prestat" />
					</div>

					<div className="footer-column">
						<h3>A propos de Prestat</h3>
						<ul>
							<li><a href="/">Gestion des cookies</a></li>
							<li><a href="/">CGU</a></li>
							<li><a href="/">Politique de confidentialite</a></li>
							<li><a href="/inscription/">Inscrivez-vous</a></li>
							<li><a href="#faq">Proposer un service</a></li>
						</ul>
					</div>

					<div className="footer-column">
						<h3>Vos professionnels</h3>
						<ul>
							{professionals.map((item) => (
								<li key={item}>
									<a href="/services">{item}</a>
								</li>
							))}
						</ul>
					</div>

					<div className="footer-column">
						<h3>Recherches frequentes</h3>
						<ul>
							{frequentSearches.map((item) => (
								<li key={item}>
									<a href="/services">{item}</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
