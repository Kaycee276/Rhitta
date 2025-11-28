import * as mm from "music-metadata";

const getAudioDurationWithMetadata = async (
	filePath: string
): Promise<number> => {
	const metadata = await mm.parseFile(filePath);
	return metadata.format.duration || 0;
};

const getAudioDurationFromBufferWithMetadata = async (
	buffer: Buffer
): Promise<number> => {
	const metadata = await mm.parseBuffer(buffer);
	return metadata.format.duration || 0;
};

export const getAudioDuration = async (
	audioFile: Express.Multer.File
): Promise<number> => {
	try {
		let duration = 0;

		if (audioFile.path) {
			duration = await getAudioDurationWithMetadata(audioFile.path);
		} else if (audioFile.buffer) {
			duration = await getAudioDurationFromBufferWithMetadata(audioFile.buffer);
		}

		return duration;
	} catch (error) {
		console.error("Failed to extract audio duration:", error);
		throw new Error("Could not process audio file duration");
	}
};
