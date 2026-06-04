import heroImage from '../../assets/hero-architecture.jpg';
import Reveal from '../Reveal/Reveal';
import s from './Hero.module.css';

export default function Hero() {
	return (
		<section className={s.section} style={{ '--hero-image': `url(${heroImage})` }}>
			<div className={s.overlay} />
			<div className={s.inner}>
				<Reveal from="bottom" delay={100}>
					<p className={s.kicker}>À portée de main</p>
					<h1 className={s.title}>Réservez en un instant</h1>
					<p className={s.subtitle}>
						Trouvez le bon prestataire, au bon endroit, sans perdre de temps.
					</p>
				</Reveal>
				<Reveal from="bottom" delay={300}>
					<form className={s.searchBar} onSubmit={(e) => e.preventDefault()}>
						<label className={s.searchField}>
							<span className="sr-only">Cherchez un prestataire</span>
							<input type="text" placeholder="Cherchez un prestataire" />
						</label>
						<div className={s.searchDivider} aria-hidden="true" />
						<label className={s.searchField}>
							<span className="sr-only">Ville ou lieu</span>
							<input type="text" placeholder="Ville, lieu…" />
						</label>
						<button className={s.searchBtn} type="submit">Rechercher</button>
					</form>
				</Reveal>
			</div>
		</section>
	);
}
