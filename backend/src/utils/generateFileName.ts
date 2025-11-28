import path from "path";

export const generateFileName = (
	originalName: string,
	prefix: string
): string => {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	const extension = path.extname(originalName);
	return `${prefix}-${timestamp}-${randomString}${extension}`;
};
