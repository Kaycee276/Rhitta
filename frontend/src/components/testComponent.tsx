// import { subscribe } from "../services/somnia";
import { useState } from "react";

export function TestComponent() {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string>("");

	const handleClick = async () => {
		try {
			setError(null);
			setStatus("Starting subscription...");
			console.log("🔄 Starting subscription...");

			// const cleanup = await subscribe();
			setIsSubscribed(true);
			setStatus("✅Subscription active - waiting for data...");

			console.log("✅ Subscription started successfully");
		} catch (error) {
			console.error("❌ Subscription error:", error);
			const errorMsg = error instanceof Error ? error.message : "Unknown error";
			setError(errorMsg);

			if (errorMsg.includes("NoData") || errorMsg.includes("No data found")) {
				setStatus(
					"❌ No songs found. Please publish songs first using the backend script."
				);
			} else {
				setStatus("❌ Subscription failed");
			}
			setIsSubscribed(false);
		}
	};

	return (
		<div className="p-4 space-y-4 max-w-md">
			<button
				className="flex-1 py-3 px-4 bg-(--accent-primary) hover:bg-(--accent-dark) text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
				onClick={handleClick}
				disabled={isSubscribed}
			>
				{isSubscribed ? " Listening for Songs..." : "Start Song Subscription"}
			</button>

			{status && (
				<div
					className={`p-3 rounded-lg text-sm ${
						status.includes("✅")
							? "bg-green-100 text-(--success)"
							: status.includes("❌")
							? "bg-red-100 text-(--error)"
							: "bg-blue-100 text-(--info)"
					}`}
				>
					{status}
				</div>
			)}

			{error && !error.includes("NoData") && (
				<div className="text-(--error) p-2 bg-red-50 rounded text-sm">
					Error: {error}
				</div>
			)}
		</div>
	);
}
