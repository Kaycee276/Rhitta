import { upsertMockSong } from "../data/mockData";
import { useSongStore } from "../store/songStore";
import type { Song as SongType } from "../types";

type Subscriber = {
	intervalId?: number | null;
	running: boolean;
};

const subscriber: Subscriber = { intervalId: null, running: false };

const DEFAULT_INTERVAL = 5000;

async function fetchEvents(baseUrl?: string) {
	const base =
		baseUrl ||
		(import.meta.env.VITE_BACKEND_API_URL as string) ||
		"http://localhost:4000";
	const url = `${base.replace(/\/$/, "")}/events`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`fetchEvents status ${res.status}`);
	const json = await res.json();
	return json.data as Array<SongType>;
}

async function runOnce(baseUrl?: string) {
	try {
		const events = await fetchEvents(baseUrl);
		if (!Array.isArray(events)) return;

		const upsert = useSongStore.getState().upsertSong;
		for (const ev of events) {
			// normalize to shape expected by upsertSong / upsertMockSong
			const partial = {
				id: String(ev.id),
				title: ev.title,
				artist: ev.artist,
				artistId: ev.artistId,
				coverArt: ev.coverArt,
				audioUrl: ev.audioUrl,
				genre: ev.genre,
			};

			// update mock array (dev) and Zustand store
			try {
				upsertMockSong(partial as SongType);
			} catch {
				// ignore mock upsert errors
			}
			try {
				upsert(partial as SongType);
			} catch {
				// ignore store errors
			}
		}
	} catch (err) {
		console.debug("eventsSubscriber runOnce error", err);
	}
}

export function startEventsSubscription(options?: {
	intervalMs?: number;
	baseUrl?: string;
}) {
	if (subscriber.running) return;
	subscriber.running = true;
	const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL;

	// immediate fetch
	runOnce(options?.baseUrl).catch(() => {});

	const id = setInterval(() => {
		runOnce(options?.baseUrl).catch(() => {});
	}, intervalMs) as unknown as number;

	subscriber.intervalId = id;
}

export function stopEventsSubscription() {
	if (!subscriber.running) return;
	subscriber.running = false;
	if (subscriber.intervalId) {
		clearInterval(subscriber.intervalId);
		subscriber.intervalId = null;
	}
}

export function isEventsSubscriptionRunning() {
	return subscriber.running;
}

export default {
	startEventsSubscription,
	stopEventsSubscription,
	isEventsSubscriptionRunning,
};
