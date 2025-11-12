import { useNotificationStore } from "../store/notificationStore";

/**
 * Utility function to add a notification
 * This is the gateway for passing notifications throughout the app
 */
export const addNotification = (
	title: string,
	message: string,
	type?: "info" | "success" | "warning" | "error"
) => {
	const { addNotification } = useNotificationStore.getState();
	addNotification({ title, message, type });
};

/**
 * Hook to use notification functions
 */
export const useNotifications = () => {
	const {
		notifications,
		addNotification,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAll,
		unreadCount,
	} = useNotificationStore();

	return {
		notifications,
		addNotification: (notification: {
			title: string;
			message: string;
			type?: "info" | "success" | "warning" | "error";
		}) => addNotification(notification),
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAll,
		unreadCount: unreadCount(),
	};
};
