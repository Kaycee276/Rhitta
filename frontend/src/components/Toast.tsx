import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ToastProps {
	message: string;
	type: "success" | "error" | "warning" | "info";
	onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			setTimeout(onClose, 500);
		}, 4000);

		return () => clearTimeout(timer);
	}, [onClose]);

	const bgColor = {
		success: "bg-(--success)",
		error: "bg-(--error)",
		warning: "bg-(--warning)",
		info: "bg-(--info)",
	};

	return (
		<div
			className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-(--text) shadow-lg transition-opacity duration-300 ${
				visible ? "opacity-100" : "opacity-0"
			} ${bgColor[type]}`}
		>
			<div className="flex items-center justify-between">
				<span>{message}</span>
				<button onClick={onClose} className="ml-4">
					<X className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default Toast;
