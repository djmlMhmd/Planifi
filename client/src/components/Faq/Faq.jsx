import { useState } from 'react';
import Reveal from '../Reveal/Reveal';
import s from './Faq.module.css';

const items = [
	{
		question: "Prestat c'est quoi ?",
		answer: "Prestat est une plateforme qui met en relation les particuliers avec des professionnels de divers domaines, facilitant la prise et la gestion de rendez-vous en toute simplicité.",
	},
	{
		question: "Réserver, c'est facile ?",
		answer: "Oui. Vous recherchez un service, choisissez un professionnel, puis réservez en quelques clics depuis une interface claire et rapide à utiliser.",
	},
	{
		question: 'Comment je gère mes rendez-vous ?',
		answer: 'Depuis votre espace, vous pouvez retrouver vos réservations, suivre vos disponibilités et ajuster vos rendez-vous sans friction.',
	},
	{
		question: 'Comment proposer mes services sur Prestat ?',
		answer: "Il suffit de créer votre compte, compléter votre profil professionnel et publier vos prestations pour commencer à recevoir des demandes.",
	},
];

function Chevron({ open }) {
	return (
		<svg
			width="18" height="10" viewBox="0 0 18 10" fill="none"
			className={s.chevron}
			style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
			aria-hidden="true"
		>
			<path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default function Faq() {
	const [open, setOpen] = useState(null);

	return (
		<section className={s.section} id="faq">
			<div className={s.inner}>
				<Reveal from="bottom">
					<div className={s.header}>
						<span className={s.label}>FAQ</span>
						<h2>Questions fréquentes</h2>
					</div>
				</Reveal>

				<ul className={s.list}>
					{items.map((item, i) => {
						const isOpen = open === i;
						return (
							<Reveal key={item.question} as="li" from="bottom" delay={i * 80}
								className={`${s.item}${isOpen ? ` ${s.itemOpen}` : ''}`}
							>
								<button
									className={s.trigger}
									type="button"
									onClick={() => setOpen(isOpen ? null : i)}
									aria-expanded={isOpen}
								>
									<span>{item.question}</span>
									<Chevron open={isOpen} />
								</button>
								<div className={s.body} aria-hidden={!isOpen}>
									<p>{item.answer}</p>
								</div>
							</Reveal>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
