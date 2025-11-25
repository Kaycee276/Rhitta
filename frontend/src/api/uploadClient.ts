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
	total: number;
	song?: ReceivedSong;
	error?: string;
};

const DEFAULT_BASE =
	import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

function getBase(baseUrl?: string) {
	return baseUrl || DEFAULT_BASE;
}

/**
 * Upload a song payload to backend `/new-upload`.
 * If either coverArtFile or audioFile is provided, a multipart/form-data request is used.
 * Otherwise a JSON body is sent.
 */
export async function uploadSong(
	payload: UploadPayload,
	options?: { baseUrl?: string; signal?: AbortSignal }
): Promise<UploadResponse> {
	const base = getBase(options?.baseUrl);
	const url = `${base.replace(/\/$/, "")}/new-upload`;

	const hasFiles = !!(payload.coverArtFile || payload.audioFile);

	if (hasFiles) {
		const fd = new FormData();
		// append string fields
		fd.append("id", payload.id);
		if (payload.title) fd.append("title", String(payload.title));
		if (payload.artist) fd.append("artist", String(payload.artist));
		if (payload.artistId) fd.append("artistId", String(payload.artistId));
		if (payload.genre) fd.append("genre", String(payload.genre));
		// prefer file fields (the backend will use uploaded file if present)
		if (payload.coverArtFile)
			fd.append(
				"coverArtFile",
				payload.coverArtFile,
				(payload.coverArtFile as File).name
			);
		else if (payload.coverArt) fd.append("coverArt", String(payload.coverArt));

		if (payload.audioFile)
			fd.append(
				"audioFile",
				payload.audioFile,
				(payload.audioFile as File).name
			);
		else if (payload.audioUrl) fd.append("audioUrl", String(payload.audioUrl));

		const res = await fetch(url, {
			method: "POST",
			body: fd,
			signal: options?.signal,
		});
		const json = await res.json();
		return json as UploadResponse;
	}

	// JSON path
	const body: Record<string, unknown> = {
		id: payload.id,
	};
	if (payload.title) body.title = payload.title;
	if (payload.artist) body.artist = payload.artist;
	if (payload.artistId) body.artistId = payload.artistId;
	if (payload.genre) body.genre = payload.genre;
	if (payload.coverArt) body.coverArt = payload.coverArt;
	if (payload.audioUrl) body.audioUrl = payload.audioUrl;

	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		signal: options?.signal,
	});
	const json = await res.json();
	return json as UploadResponse;
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
