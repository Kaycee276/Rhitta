export const formatDate = (isoString: string): number => {
	return new Date(isoString).getTime();
};
