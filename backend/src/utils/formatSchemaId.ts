const formatSchemaId = (schemaId: string | null): string => {
	if (!schemaId?.startsWith("0x") || schemaId?.length !== 66) {
		throw new Error("Invalid schema ID format");
	}
	return schemaId as `0x${string}`;
};

export default formatSchemaId;
