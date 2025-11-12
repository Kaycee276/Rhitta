import { X, History, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "../store/notificationStore";

const formatTimeAgo = (timestamp: number): string => {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	const months = Math.floor(days / 30);
	return `${months} month${months > 1 ? "s" : ""} ago`;
};

interface NotificationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
	const {
		notifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAll,
		unreadCount,
	} = useNotificationStore();

	const getTypeColor = (type?: string) => {
		switch (type) {
			case "success":
				return "border-l-green-500";
			case "warning":
				return "border-l-yellow-500";
			case "error":
				return "border-l-red-500";
			default:
				return "border-l-(--accent-primary)";
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/20 z-40 md:bg-transparent"
					/>

					{/* Dropdown */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -8 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
						className="fixed md:absolute right-0 md:right-0 top-full md:top-full mt-2 z-50 w-[calc(100vw-3rem)] md:w-96 max-h-[70vh] overscroll-y-scroll flex flex-col shadow-xl"
					>
						<div
							className="bg-(--bg-secondary) rounded-xl border border-(--border) flex flex-col shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b border-(--border)">
								<div className="flex items-center gap-3">
									<h2 className="text-lg font-semibold text-(--text)">
										Notifications
									</h2>
									{unreadCount() > 0 && (
										<span className="px-2 py-0.5 text-xs font-medium bg-(--accent-primary) text-white rounded-full">
											{unreadCount()}
										</span>
									)}
								</div>
								<div className="flex items-center gap-2">
									{notifications.length > 0 && (
										<>
											{unreadCount() > 0 && (
												<button
													onClick={markAllAsRead}
													className="p-2 hover:bg-(--bg-tertiary) rounded-lg transition-colors"
													aria-label="Mark all as read"
												>
													<History className="w-4 h-4 text-(--text-secondary)" />
												</button>
											)}
											<button
												onClick={clearAll}
												className="p-2 hover:bg-(--bg-tertiary) rounded-lg transition-colors"
												aria-label="Clear all"
											>
												<Trash2 className="w-4 h-4 text-(--text-secondary)" />
											</button>
										</>
									)}
									<button
										onClick={onClose}
										className="p-2 hover:bg-(--bg-tertiary) rounded-lg transition-colors"
										aria-label="Close"
									>
										<X className="w-5 h-5 text-(--text-secondary)" />
									</button>
								</div>
							</div>

							{/* Notifications List */}
							<div className="flex-1 overflow-y-auto">
								{notifications.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-12 px-4">
										<div className="w-16 h-16 rounded-full bg-(--bg-tertiary) flex items-center justify-center mb-4">
											<History className="w-8 h-8 text-(--text-tertiary)" />
										</div>
										<p className="text-(--text-secondary) text-center">
											No notifications yet
										</p>
									</div>
								) : (
									<div className="divide-y divide-(--border)">
										{notifications.map((notification) => (
											<motion.div
												key={notification.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												className={`px-4 py-2 rounded-b-lg border-l-4 ${getTypeColor(
													notification.type
												)} ${
													!notification.read
														? "bg-(--bg-tertiary)"
														: "bg-(--bg-secondary)"
												}`}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<h3
																className={`font-medium ${
																	!notification.read
																		? "text-(--text)"
																		: "text-(--text-secondary)"
																}`}
															>
																{notification.title}
															</h3>
															{!notification.read && (
																<span className="w-2 h-2 bg-(--accent-primary) rounded-full" />
															)}
														</div>
														<p className="text-sm text-(--text-secondary) mb-2">
															{notification.message}
														</p>
														<p className="text-xs text-(--text-tertiary)">
															{formatTimeAgo(notification.timestamp)}
														</p>
													</div>
													<div className="flex items-center gap-1">
														{!notification.read && (
															<button
																onClick={() => markAsRead(notification.id)}
																className="p-1.5 hover:bg-(--bg-secondary) rounded transition-colors"
																aria-label="Mark as read"
															>
																<History className="w-4 h-4 text-(--text-secondary)" />
															</button>
														)}
														<button
															onClick={() =>
																deleteNotification(notification.id)
															}
															className="p-1.5 hover:bg-(--bg-secondary) rounded transition-colors"
															aria-label="Delete"
														>
															<Trash2 className="w-4 h-4 text-(--text-secondary)" />
														</button>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								)}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default NotificationModal;
