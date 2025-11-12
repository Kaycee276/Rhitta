import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type?: "info" | "success" | "warning" | "error";
	timestamp: number;
	read: boolean;
}

interface NotificationStore {
	notifications: Notification[];
	addNotification: (
		notification: Omit<Notification, "id" | "timestamp" | "read">
	) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	deleteNotification: (id: string) => void;
	clearAll: () => void;
	unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
	persist(
		(set, get) => ({
			notifications: [],
			addNotification: (notification) => {
				const newNotification: Notification = {
					...notification,
					id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					timestamp: Date.now(),
					read: false,
					type: notification.type || "info",
				};
				set((state) => ({
					notifications: [newNotification, ...state.notifications],
				}));
			},
			markAsRead: (id) =>
				set((state) => ({
					notifications: state.notifications.map((notif) =>
						notif.id === id ? { ...notif, read: true } : notif
					),
				})),
			markAllAsRead: () =>
				set((state) => ({
					notifications: state.notifications.map((notif) => ({
						...notif,
						read: true,
					})),
				})),
			deleteNotification: (id) =>
				set((state) => ({
					notifications: state.notifications.filter((notif) => notif.id !== id),
				})),
			clearAll: () => set({ notifications: [] }),
			unreadCount: () => {
				return get().notifications.filter((notif) => !notif.read).length;
			},
		}),
		{
			name: "rhitta-notifications",
		}
	)
);
