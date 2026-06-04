import { useEffect, useState } from 'react';
import bordeauxImage from '../../assets/bordeaux.jpg';
import lyonImage from '../../assets/lyon.webp';
import marseilleImage from '../../assets/marseille.webp';
import nantesImage from '../../assets/nantes.webp';
import niceImage from '../../assets/nice.webp';
import parisImage from '../../assets/paris.avif';
import strasbourgImage from '../../assets/strasbourg.jpg';
import toulouseImage from '../../assets/toulouse.webp';
import Reveal from '../Reveal/Reveal';
import s from './CitiesCarousel.module.css';

const cities = [
	{ name: 'Paris', img: parisImage },
	{ name: 'Lyon', img: lyonImage },
	{ name: 'Marseille', img: marseilleImage },
	{ name: 'Bordeaux', img: bordeauxImage },
	{ name: 'Nantes', img: nantesImage },
	{ name: 'Nice', img: niceImage },
	{ name: 'Toulouse', img: toulouseImage },
	{ name: 'Strasbourg', img: strasbourgImage },
];

export default function CitiesCarousel() {
	const [active, setActive] = useState(0);
	const [previous, setPrevious] = useState(null);
	const [titleVisible, setTitleVisible] = useState(true);

	useEffect(() => {
		const id = window.setInterval(() => {
			setActive((i) => {
				setPrevious(i);
				setTitleVisible(false);
				return (i + 1) % cities.length;
			});
		}, 4200);
		return () => window.clearInterval(id);
	}, []);

	useEffect(() => {
		if (previous === null) return;
		const id = window.setTimeout(() => setPrevious(null), 900);
		return () => window.clearTimeout(id);
	}, [previous, active]);

	useEffect(() => {
		const id = window.setTimeout(() => setTitleVisible(true), 180);
		return () => window.clearTimeout(id);
	}, [active]);

	const handleDot = (i) => {
		if (i === active) return;
		setPrevious(active);
		setTitleVisible(false);
		setActive(i);
	};

	return (
		<section className={s.section}>
			<Reveal from="bottom">
				<div className={s.header}>
					<h2>Trouvez des prestataires proches de chez vous</h2>
					<p>À portée de main…</p>
				</div>
			</Reveal>

			<Reveal from="bottom" delay={150}>
				<div className={s.carousel}>
					<div className={s.track}>
						{cities.map((city, i) => (
							<div
								key={city.name}
								className={`${s.slide}${i === active ? ` ${s.slideActive}` : ''}${i === previous ? ` ${s.slidePrevious}` : ''}`}
								aria-hidden={i !== active}
							>
								<div className={s.slideImg}>
									<img src={city.img} alt={city.name} />
								</div>
							</div>
						))}
					</div>
				</div>

				<p className={`${s.cityName}${titleVisible ? ` ${s.cityNameVisible}` : ''}`}>
					{cities[active].name}
				</p>

				<div className={s.dots}>
					{cities.map((city, i) => (
						<button
							key={city.name}
							className={`${s.dot}${i === active ? ` ${s.dotActive}` : ''}`}
							onClick={() => handleDot(i)}
							aria-label={city.name}
						/>
					))}
				</div>
			</Reveal>
		</section>
	);
}
