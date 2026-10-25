import { supabase } from "./supabase.ts";
import fs from "fs";
import path from "path";

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

		// If Supabase storage is configured, upload to bucket
		if (supabase) {
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
		}

		// Fallback: Local file persistence in uploads directory
		const uploadDir = path.resolve(process.cwd(), "uploads", bucketName);
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const localFilePath = path.join(uploadDir, fileName);
		fs.writeFileSync(localFilePath, fileBuffer);

		const serverPort = process.env.PORT || 4000;
		const publicUrl = `http://localhost:${serverPort}/uploads/${bucketName}/${fileName}`;

		return {
			path: localFilePath,
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
