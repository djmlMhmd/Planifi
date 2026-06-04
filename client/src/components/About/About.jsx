import aboutImage from '../../assets/about-work.jpg';
import Reveal from '../Reveal/Reveal';
import s from './About.module.css';

export default function About() {
	return (
		<section className={s.section}>
			<Reveal from="none">
				<div className={s.imageWrap}>
					<img src={aboutImage} alt="Professionnel organisant son activité depuis son ordinateur" />
					<div className={s.caption}>
						<Reveal from="bottom" delay={100}>
							<span className={s.label}>Notre mission</span>
						</Reveal>
						<Reveal from="bottom" delay={200}>
							<h2>Tout savoir sur nous…</h2>
						</Reveal>
						<Reveal from="bottom" delay={320}>
							<p>
								Simplifier la mise en relation entre particuliers et professionnels,
								partout en France, en toute confiance.
							</p>
						</Reveal>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
