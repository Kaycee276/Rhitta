import { supabase } from "./supabase.ts";
import fs from "fs";

export const uploadToSupabase = async (
	file: Express.Multer.File,
	bucketName: string,
	fileName: string
): Promise<{ path: string; url: string; error: any }> => {
	try {
		let fileBuffer: Buffer;
		if (file.buffer) {
			fileBuffer = file.buffer;
		} else {
			fileBuffer = fs.readFileSync(file.path);
		}

		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(fileName, fileBuffer, {
				cacheControl: "3600",
				upsert: false,
				contentType: file.mimetype,
			});

		if (error) {
			throw error;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(bucketName).getPublicUrl(data.path);

		return {
			path: data.path,
			url: publicUrl,
			error: null,
		};
	} catch (error) {
		console.error(`Error uploading to ${bucketName}:`, error);
		return {
			path: "",
			url: "",
			error,
		};
	}
};
