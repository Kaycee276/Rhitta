import { useEffect, useRef } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside<T extends HTMLElement>(
	handler: Handler | (() => void),
	active = true
) {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		if (!active) return;

		const listener = (event: MouseEvent | TouchEvent) => {
			const element = ref.current;
			if (!element || element.contains(event.target as Node)) {
				return;
			}

			if (typeof handler === "function") {
				handler(event);
			}
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [handler, active]);

	return ref;
}

export default useClickOutside;
