export function normalizeTo0x(input: string | `0x${string}`): `0x${string}` {
	if (input.startsWith("0x")) {
		if (!/^0x[0-9a-fA-F]+$/.test(input)) {
			throw new Error(
				"normalizeTo0x: input with 0x prefix contains non-hex characters"
			);
		}
		return input as `0x${string}`;
	}

	if (!/^[0-9a-fA-F]+$/.test(input)) {
		throw new Error("normalizeTo0x: input contains non-hex characters");
	}
	return `0x${input}` as `0x${string}`;
}
