/* Thin-typed client for uploads and events
 * - uploadSong: sends JSON when no files are present, or multipart/form-data when files are provided
 * - getEvents: fetch buffer from backend
 *
 * Usage:
 *  import { uploadSong } from '../api/uploadClient';
 *  await uploadSong({ id: 'song-1', title: 'Title', coverArtFile: fileInput.files[0] });
 */

export type UploadPayload = {
	id: string; // required
	title?: string;
	artist?: string;
	artistId?: string;
	genre?: string;
	// prefer one of coverArt OR coverArtFile
	coverArt?: string;
	coverArtFile?: File;
	// prefer one of audioUrl OR audioFile
	audioUrl?: string;
	audioFile?: File;
};

export type ReceivedSong = {
	id: string;
	title?: string;
	artist?: string;
	artistId?: string;
	coverArt?: string;
	audioUrl?: string;
	genre?: string;
	receivedAt?: number;
};

export type UploadResponse = {
	ok: boolean;
	success?: boolean;
	total: number;
	song?: ReceivedSong;
	data?: ReceivedSong;
	error?: string;
	message?: string;
};

const DEFAULT_BASE =
	import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

function getBase(baseUrl?: string) {
	return baseUrl || DEFAULT_BASE;
}

export async function uploadSong(
	payload: UploadPayload,
	options?: { baseUrl?: string; signal?: AbortSignal }
): Promise<UploadResponse> {
	const base = getBase(options?.baseUrl);
	const url = `${base.replace(/\/$/, "")}/new-upload`;

	const hasFiles = !!(payload.coverArtFile || payload.audioFile);

	try {
		let res: Response;
		if (hasFiles) {
			const fd = new FormData();
			// append string fields
			fd.append("id", payload.id);
			if (payload.title) fd.append("title", String(payload.title));
			if (payload.artist) fd.append("artist", String(payload.artist));
			if (payload.artistId) fd.append("artistId", String(payload.artistId));
			if (payload.genre) fd.append("genre", String(payload.genre));
			// receive just files
			if (payload.coverArtFile)
				fd.append(
					"coverArtFile",
					payload.coverArtFile,
					payload.coverArtFile.name
				);
			if (payload.audioFile)
				fd.append("audioFile", payload.audioFile, payload.audioFile.name);

			res = await fetch(url, {
				method: "POST",
				body: fd,
				signal: options?.signal,
			});
			const json = await res.json();
			return json as UploadResponse;
		} else {
			const body: Record<string, unknown> = {
				id: payload.id,
			};
			if (payload.title) body.title = payload.title;
			if (payload.artist) body.artist = payload.artist;
			if (payload.artistId) body.artistId = payload.artistId;
			if (payload.genre) body.genre = payload.genre;
			if (payload.coverArt) body.coverArt = payload.coverArt;
			if (payload.audioUrl) body.audioUrl = payload.audioUrl;

			res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				signal: options?.signal,
			});
			if (!res.ok) {
				const errorText = await res.text();
				console.error("Backend error response:", errorText);
				return {
					ok: false,
					total: 0,
					error: `Upload failed: ${res.status} ${res.statusText}`,
				};
			}

			const json = await res.json();
			return json as UploadResponse;
		}
	} catch (error) {
		console.error("Network error:", error);
		return {
			ok: false,
			total: 0,
			error: `Network error: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}
}

export async function getEvents(options?: {
	baseUrl?: string;
	signal?: AbortSignal;
}) {
	const base = getBase(options?.baseUrl);
	const url = `${base.replace(/\/$/, "")}/events`;
	const res = await fetch(url, { signal: options?.signal });
	const json = await res.json();
	return json as { data: ReceivedSong[] };
}

export default { uploadSong, getEvents };
