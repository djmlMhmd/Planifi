import favoritesPlaceholder from '../../../assets/favorites-placeholder.jpg';
import Reveal from '../../Reveal/Reveal';
import { BookmarkIcon } from './profileIcons';

export function FavoritesPanel() {
	return (
		<div>
			<h2 className="mb-10 text-[2rem] font-semibold tracking-[-0.03em] text-[#151515]">
				Retrouvez vos prestataires favoris sauvegardés ici
			</h2>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(330px,430px))] gap-6">
				{[
					{ id: 'fav-1', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-2', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-3', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-4', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-5', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
					{ id: 'fav-6', title: 'Nom de la prestation', category: 'Activité', location: 'Localisation' },
				].map((item, index) => (
					<Reveal key={item.id} from="bottom" delay={index * 60}>
						<div className="w-full max-w-[430px] rounded-[20px] border border-black/8 bg-white/96 p-3 shadow-[0_12px_28px_rgba(17,19,30,0.04)]">
							<div className="flex items-start gap-3">
								<div className="relative h-[128px] w-[124px] shrink-0 overflow-hidden rounded-[14px]">
									<img src={favoritesPlaceholder} alt={item.title} className="h-full w-full object-cover" />
									<button
										type="button"
										className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#111111] shadow-[0_10px_24px_rgba(10,10,10,0.18)]"
									>
										<BookmarkIcon className="h-[22px] w-[22px]" />
									</button>
								</div>

								<div className="flex min-w-0 flex-1 flex-col pt-1">
									<h3 className="text-[0.96rem] font-semibold leading-[1.3] text-[#151515]">{item.title}</h3>
									<p className="mt-2 text-[0.92rem] text-[#242424]">{item.category}</p>
									<p className="mt-auto pt-7 text-[0.9rem] text-black/28">{item.location}</p>
								</div>
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</div>
	);
}
