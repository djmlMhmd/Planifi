import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function useBodyScrollLock(locked) {
	useEffect(() => {
		// Tant que locked vaut true, je bloque le scroll du document
		// pour éviter que l'arrière-plan continue de bouger sous une modale.
		if (!locked) {
			return undefined;
		}

		const { body } = document;
		const previousBodyOverflow = body.style.overflow;
		const previousBodyPaddingRight = body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

		body.style.overflow = 'hidden';

		if (scrollbarWidth > 0) {
			// J'ajoute un padding équivalent à la scrollbar pour éviter
			// que la mise en page "saute" quand le scroll disparaît.
			body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			// Le cleanup du useEffect remet le document dans son état initial
			// dès que la modale se ferme ou que le composant se démonte.
			body.style.overflow = previousBodyOverflow;
			body.style.paddingRight = previousBodyPaddingRight;
		};
	}, [locked]);
}

export function ModalPortal({ open = true, children }) {
	useBodyScrollLock(open);

	if (!open || typeof document === 'undefined') {
		return null;
	}

	// createPortal rend la modale directement dans <body>,
	// ce qui évite d'être bloqué par le layout du composant parent.
	return createPortal(children, document.body);
}
