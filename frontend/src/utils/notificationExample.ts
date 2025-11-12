/**
 * Example usage of the notification system
 *
 * This file demonstrates how to add notifications throughout your app
 */

import { addNotification } from "./notifications";

// Example: Add a simple info notification
export const showInfoNotification = () => {
	addNotification(
		"Welcome!",
		"Thanks for using Rhitta music streaming platform",
		"info"
	);
};

// Example: Add a success notification
export const showSuccessNotification = () => {
	addNotification(
		"Song Added",
		"Your favorite song has been added to the queue",
		"success"
	);
};

// Example: Add a warning notification
export const showWarningNotification = () => {
	addNotification(
		"Low Volume",
		"Your volume is set very low. You might not hear the music",
		"warning"
	);
};

// Example: Add an error notification
export const showErrorNotification = () => {
	addNotification(
		"Playback Error",
		"Unable to play this song. Please try again later",
		"error"
	);
};

/**
 * Usage in components:
 *
 * import { addNotification } from "../utils/notifications";
 *
 * // In your component or function:
 * addNotification("Title", "Message", "info");
 * addNotification("Title", "Message", "success");
 * addNotification("Title", "Message", "warning");
 * addNotification("Title", "Message", "error");
 *
 * Or use the hook for more control:
 *
 * import { useNotifications } from "../utils/notifications";
 *
 * const MyComponent = () => {
 *   const { addNotification, notifications, unreadCount } = useNotifications();
 *
 *   const handleClick = () => {
 *     addNotification({
 *       title: "New Song",
 *       message: "A new song is available",
 *       type: "info"
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Notify</button>;
 * };
 */
