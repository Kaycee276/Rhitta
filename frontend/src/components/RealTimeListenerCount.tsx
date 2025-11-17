// import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
// import { somniaDataStreams } from "../services/somniaDataStreams";

interface RealTimeListenerCountProps {
	songId: string;
}

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const RealTimeListenerCount = ({ songId }: RealTimeListenerCountProps) => {
	// const [listenerCount, setListenerCount] = useState(0);

	// useEffect(() => {
	// 	const unsubscribe = somniaDataStreams.subscribeToListenerCount(
	// 		songId,
	// 		(count) => {
	// 			setListenerCount(count);
	// 		}
	// 	);

	// 	return unsubscribe;
	// }, [songId]);

	return (
		<div className="flex items-center gap-2 text-xs text-(--text-tertiary)">
			<Radio className="w-3 h-3 text-(--accent-primary) animate-pulse" />
			<span>{songId} listening now</span>
		</div>
	);
};

export default RealTimeListenerCount;
