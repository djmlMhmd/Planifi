import { ModalPortal } from './profileModal';

export function SidebarLink({ href, active = false, icon: Icon, onNavigate, tone = 'dark', children }) {
	function handleClick(event) {
		if (onNavigate) {
			// preventDefault empêche le comportement natif du lien <a>.
			// Ici je veux laisser React gérer la navigation pour rester fluide.
			event.preventDefault();
			onNavigate(href);
		}
	}

	const activeClass = tone === 'light' ? 'text-[var(--accent-mauve)]' : 'text-[#c7b2ec]';
	const idleClass = tone === 'light' ? 'text-black/82 hover:text-black' : 'text-white/62 hover:text-white';

	return (
		<a className={`flex items-center gap-3 text-[0.98rem] font-medium transition ${active ? activeClass : idleClass}`} href={href} onClick={handleClick}>
			<Icon className="h-5 w-5" />
			<span>{children}</span>
		</a>
	);
}

export function DevelopmentNoticeModal({ open, onClose }) {
	return (
		<ModalPortal open={open}>
			<div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,15,13,0.32)] backdrop-blur-[3px]">
				<div className="flex min-h-full items-center justify-center px-6 py-6">
					<div className="w-full max-w-[420px] animate-[panelSwapIn_280ms_cubic-bezier(0.22,1,0.36,1)] rounded-[28px] bg-white p-7 shadow-[0_28px_80px_rgba(17,19,30,0.18)]">
						<div className="flex items-start justify-between gap-6">
							<div>
								<p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/42">Prestat</p>
								<h2 className="mt-1.5 text-[1.8rem] font-semibold tracking-[-0.04em] text-[#171717]">Documents</h2>
							</div>
							<button type="button" onClick={onClose} className="rounded-full border border-black/10 px-4 py-2 text-[0.9rem] font-medium text-black/56 transition hover:border-black/18 hover:text-black">
								Fermer
							</button>
						</div>
						<p className="mt-6 text-[1rem] leading-8 text-black/62">Cette page est en cours de développement.</p>
					</div>
				</div>
			</div>
		</ModalPortal>
	);
}
