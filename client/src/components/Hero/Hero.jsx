import heroImage from '../../assets/hero-architecture.jpg';
import Reveal from '../Reveal/Reveal';
import s from './Hero.module.css';
import { useNavigationSearch } from '../../hooks/useNavigationSearch';

export default function Hero() {
	const {
		query,
		setQuery,
		ville,
		setVille,
		serviceSuggestions,
		villeSuggestions,
		showServiceSuggestions,
		setShowServiceSuggestions,
		showVilleSuggestions,
		setShowVilleSuggestions,
		setActiveSuggestionField,
		searchRef,
		handleSearch,
		handleSelectService,
		handleSelectVille,
		handleDiscoverProviders,
		showDiscoverProviders,
	} = useNavigationSearch();

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
					{/* onSubmit déclenche handleSearch quand l'user soumet le formulaire */}
					<form className={s.searchBar} onSubmit={handleSearch} ref={searchRef}>
						<label className={s.searchField}>
							<span className="sr-only">Cherchez un prestataire</span>
							{/* value + onChange = "input contrôlé" : React gère la valeur */}
							<input
								type="text"
								placeholder="prestation"
								value={query}
								onFocus={() => {
									setActiveSuggestionField('service');
									setShowServiceSuggestions(true);
									setShowVilleSuggestions(false);
								}}
								onChange={(e) => {
									setQuery(e.target.value);
									setActiveSuggestionField('service');
									setShowServiceSuggestions(true);
									setShowVilleSuggestions(false);
								}}
							/>
							{showDiscoverProviders ? (
								<div className={s.dropdown}>
									<button
										type="button"
										onMouseDown={(event) => event.preventDefault()}
										onClick={handleDiscoverProviders}
										className={s.dropdownItem}
									>
										Pas d&apos;idée ? Découvrez nos prestataires
									</button>
								</div>
							) : showServiceSuggestions && serviceSuggestions.length > 0 ? (
								<div className={s.dropdown}>
									{serviceSuggestions.map((suggestion) => (
										<button
											key={suggestion}
											type="button"
											onMouseDown={(event) => event.preventDefault()}
											onClick={() => handleSelectService(suggestion)}
											className={s.dropdownItem}
										>
											{suggestion}
										</button>
									))}
								</div>
							) : null}
						</label>
						<div className={s.searchDivider} aria-hidden="true" />
						<label className={s.searchField}>
							<span className="sr-only">Ville ou lieu</span>
							<input
								type="text"
								placeholder="ville"
								value={ville}
								onFocus={() => {
									setActiveSuggestionField('ville');
									setShowVilleSuggestions(true);
									setShowServiceSuggestions(false);
								}}
								onChange={(e) => {
									setVille(e.target.value);
									setActiveSuggestionField('ville');
									setShowVilleSuggestions(true);
									setShowServiceSuggestions(false);
								}}
							/>
							{showVilleSuggestions && villeSuggestions.length > 0 ? (
								<div className={s.dropdown}>
									{villeSuggestions.map((suggestion) => (
										<button
											key={suggestion.value}
											type="button"
											onMouseDown={(event) => event.preventDefault()}
											onClick={() => handleSelectVille(suggestion)}
											className={s.dropdownItem}
										>
											{suggestion.label}
										</button>
									))}
								</div>
							) : null}
						</label>
						<button className={s.searchBtn} type="submit">Rechercher</button>
					</form>
				</Reveal>
			</div>
		</section>
	);
}
