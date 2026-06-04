import accentOne from '../../assets/provider-signup-accent-1.jpg';
import accentTwo from '../../assets/provider-signup-accent-2.jpg';
import backgroundImage from '../../assets/provider-signup-bg.jpg';
import Reveal from '../Reveal/Reveal';
import s from './ProviderSignupPage.module.css';

export default function ProviderSignupPage() {
	return (
		<main className={s.page}>
			<section
				className={s.formSection}
				style={{ '--provider-signup-image': `url(${backgroundImage})` }}
			>
				<div className={s.formOverlay} />
				<div className={s.accentStrip} aria-hidden="true">
					<img src={accentOne} alt="" />
					<img src={accentTwo} alt="" />
				</div>
				<div className={s.formLayout}>
					<Reveal from="left">
						<p className={s.formSectionTitle}>Proposez votre service</p>
					</Reveal>

					<div className={s.formStack}>
						<Reveal from="left" delay={100}>
							<div className={s.formCard}>
								<div className={s.cardHeader}>
									<h2>
										Inscrivez-vous
										<br />
										pour commencer
									</h2>
								</div>

								<form className={s.form}>
									<label className={s.fieldGroup}>
										<span>Numero de telephone *</span>
										<input type="tel" />
									</label>

									<label className={s.fieldGroup}>
										<span>Email *</span>
										<input type="email" />
									</label>

									<label className={s.fieldGroup}>
										<span>Mot de passe *</span>
										<div className={s.passwordWrap}>
											<input type="password" />
											<span className={s.passwordCaret} aria-hidden="true">
												⌄
											</span>
										</div>
									</label>

									<label className={s.checkboxRow}>
										<input type="checkbox" />
										<span>
											J&apos;accepte les <a href="/">CGU</a> de Planifi
										</span>
									</label>

									<button className={s.submitButton} type="submit">
										S&apos;inscrire
									</button>

									<p className={s.legalText}>
										Vos informations sont traitees par Planifi, consultez notre{' '}
										<a href="/">politique de confidentialite</a>. Ce site est protege
										par reCAPTCHA et est soumis a la <a href="/">Politique de
										Confidentialite</a> et aux <a href="/">Conditions
										d&apos;Utilisation</a> de Google.
									</p>

									<p className={s.loginPrompt}>
										Deja inscrit ? <a href="/connexion/">Connexion</a>
									</p>
								</form>
							</div>
						</Reveal>
					</div>
				</div>
			</section>
		</main>
	);
}
