import prestatLogo from '../../assets/prestat-logo.svg';
import Reveal from '../Reveal/Reveal';
import s from './Footer.module.css';

const professionals = ['Coiffeurs à domicile', 'Photographes', 'Coachs sportifs', 'Artisans'];
const searches = ['Coiffure à Bordeaux', 'Photographe événementiel', 'Cours de sport à domicile', 'Services ménagers'];

export default function Footer() {
	return (
		<footer className={s.footer}>
			<div className={s.top}>
				<Reveal from="bottom">
					<div className={s.brand}>
						<img src={prestatLogo} alt="Planifi" />
						<p>La réservation de services, réinventée.</p>
					</div>
				</Reveal>
				<nav className={s.nav}>
					{[
						{ title: 'Planifi', links: [['À propos', '/'], ['CGU', '/'], ['Confidentialité', '/'], ['Cookies', '/']] },
						{ title: 'Professionnels', links: professionals.map((p) => [p, '/services']) },
						{ title: 'Recherches', links: searches.map((r) => [r, '/services']) },
					].map(({ title, links }, i) => (
						<Reveal key={title} from="bottom" delay={i * 80}>
							<div className={s.col}>
								<h3>{title}</h3>
								<ul>
									{links.map(([label, href]) => (
										<li key={label}><a href={href}>{label}</a></li>
									))}
								</ul>
							</div>
						</Reveal>
					))}
				</nav>
			</div>
			<div className={s.bottom}>
				<p>© {new Date().getFullYear()} Planifi. Tous droits réservés.</p>
				<a href="#faq">Proposer un service</a>
			</div>
		</footer>
	);
}
