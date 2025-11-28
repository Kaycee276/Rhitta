import { Radio } from "lucide-react";

interface RealTimeListenerCountProps {
	listeners: number;
}

const RealTimeListenerCount = ({ listeners }: RealTimeListenerCountProps) => {
	return (
		<div className="flex items-center gap-2 text-xs text-(--text-tertiary)">
			<Radio className="w-3 h-3 text-(--accent-primary) animate-pulse" />
			<span>{listeners} listening now</span>
		</div>
	);
};

export default RealTimeListenerCount;
