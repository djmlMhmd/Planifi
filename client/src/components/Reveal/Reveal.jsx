import { useReveal } from '../../hooks/useReveal';
import s from './Reveal.module.css';

/**
 * Wraps children in a reveal animation triggered on scroll.
 * @param {string}  from    - Direction: 'bottom' (default) | 'left' | 'right' | 'none'
 * @param {number}  delay   - Delay in ms (0, 100, 200…)
 * @param {string}  as      - HTML tag to render ('div' by default)
 */
export default function Reveal({ children, from = 'bottom', delay = 0, as: Tag = 'div', className = '' }) {
	const ref = useReveal();

	return (
		<Tag
			ref={ref}
			className={`${s.reveal} ${s[from]} ${className}`}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</Tag>
	);
}
