import { subscribe } from "../services/somnia";

export function TestComponent() {
	const handleClick = async () => {
		try {
			const schemaId = await subscribe();
			console.log("Schema ID:", schemaId);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<button
			className="bg-(--accent-primary) p-4 rounded-lg "
			onClick={handleClick}
		>
			Compute Schema
		</button>
	);
}
