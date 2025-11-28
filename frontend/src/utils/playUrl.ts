// utils/playUrl.ts
export async function playUrl(
	audioEl: HTMLAudioElement,
	url: string,
	opts?: { timeoutMs?: number }
) {
	const timeoutMs = opts?.timeoutMs ?? 8000;

	if (!audioEl) throw new Error("audio element missing");

	// Set CORS before changing src so the browser requests with CORS mode
	try {
		audioEl.crossOrigin = "anonymous";
	} catch {
		// ignore
	}

	// Assign src then load
	audioEl.src = url;
	audioEl.preload = "auto"; // or "metadata" if you want to minimize early bandwidth
	audioEl.load();

	// Wait for canplay (readyState >= 3) or timeout
	if (audioEl.readyState >= 3) {
		// already OK
	} else {
		await new Promise<void>((resolve, reject) => {
			let finished = false;
			const onCan = () => {
				if (finished) return;
				finished = true;
				cleanup();
				resolve();
			};
			const onErr = () => {
				if (finished) return;
				finished = true;
				cleanup();
				reject(new Error("media error"));
			};
			const timer = window.setTimeout(() => {
				if (finished) return;
				finished = true;
				cleanup();
				reject(new Error("canplay timeout"));
			}, timeoutMs);
			function cleanup() {
				audioEl.removeEventListener("canplay", onCan);
				audioEl.removeEventListener("error", onErr);
				clearTimeout(timer);
			}
			audioEl.addEventListener("canplay", onCan);
			audioEl.addEventListener("error", onErr);
		});
	}

	try {
		await audioEl.play();
	} catch (err: unknown) {
		// Narrow unknown -> check for a name property (DOMException may not be available in all envs)
		const name =
			typeof err === "object" &&
			err !== null &&
			"name" in err &&
			typeof (err as { name?: unknown }).name === "string"
				? (err as { name: string }).name
				: undefined;

		if (name === "AbortError") {
			// interrupted by new load — safe to ignore here
			return;
		}
		throw err;
	}
}
