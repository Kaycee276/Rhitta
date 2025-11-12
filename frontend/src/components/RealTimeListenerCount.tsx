import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { somniaDataStreams } from "../services/somniaDataStreams";

interface RealTimeListenerCountProps {
	songId: string;
}

const RealTimeListenerCount = ({ songId }: RealTimeListenerCountProps) => {
	const [listenerCount, setListenerCount] = useState(0);

	useEffect(() => {
		const unsubscribe = somniaDataStreams.subscribeToListenerCount(
			songId,
			(count) => {
				setListenerCount(count);
			}
		);

		return unsubscribe;
	}, [songId]);

	return (
		<div className="flex items-center gap-2 text-xs text-(--text-tertiary)">
			<Radio className="w-3 h-3 text-(--accent-primary) animate-pulse" />
			<span>{listenerCount} listening now</span>
		</div>
	);
};

export default RealTimeListenerCount;
