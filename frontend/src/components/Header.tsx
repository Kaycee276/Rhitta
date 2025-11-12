import { useCallback, useState, useEffect } from "react";
import { Search, Bell, User, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../utils/useClickOutside";
import { useLocation } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import { useNotificationStore } from "../store/notificationStore";

const Header = () => {
	const location = useLocation();
	const isDiscoverPage = location.pathname === "/discover";
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
	const notifications = useNotificationStore((state) => state.notifications);
	const unreadCount = notifications.filter((n) => !n.read).length;

	const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
	const closeMobileSearch = useCallback(() => setIsMobileSearchOpen(false), []);

	// Close mobile search when navigating away from discover page
	useEffect(() => {
		if (!isDiscoverPage) {
			setIsMobileSearchOpen(false);
		}
	}, [isDiscoverPage]);

	const mobileMenuRef = useClickOutside<HTMLDivElement>(
		closeMobileMenu,
		isMobileMenuOpen
	);
	const mobileSearchRef = useClickOutside<HTMLDivElement>(
		closeMobileSearch,
		isMobileSearchOpen
	);

	return (
		<header className="sticky top-0 z-50 bg-(--bg-secondary) border-b border-(--border) backdrop-blur-sm ">
			<div className="relative flex items-center justify-between px-6 py-4">
				{/* Search or App Name */}
				{isDiscoverPage ? (
					<div className="flex-1 max-w-2xl">
						{/* Desktop search */}
						<div className="relative hidden md:block">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) w-5 h-5" />
							<input
								type="text"
								placeholder="Search songs, artists, albums..."
								className="w-full pl-10 pr-4 py-2 bg-(--bg-tertiary) border border-(--border) rounded-full text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
							/>
						</div>
						{/* Mobile search icon */}
						<button
							className="md:hidden p-2 hover:bg-(--bg-tertiary) rounded-full transition-colors"
							onClick={() => setIsMobileSearchOpen((v) => !v)}
							aria-label="Open search"
						>
							<Search className="w-5 h-5 text-(--text-secondary)" />
						</button>
					</div>
				) : (
					<div className="md:hidden">
						<h1 className="text-xl font-bold text-(--accent-primary)">
							Rhitta
						</h1>
					</div>
				)}

				{/* Right Side Actions */}
				<div
					className={`flex items-center gap-4 ${
						isDiscoverPage ? "ml-6" : "md:ml-auto"
					}`}
				>
					{/* Desktop actions */}
					<div className="hidden md:block relative">
						<button
							onClick={() => setIsNotificationModalOpen(true)}
							className="relative p-2 hover:bg-(--bg-tertiary) rounded-full transition-colors"
							aria-label="Notifications"
						>
							<Bell className="w-5 h-5 text-(--text-secondary)" />
							{unreadCount > 0 && (
								<span className="absolute top-1 right-1 w-2 h-2 bg-(--accent-primary) rounded-full" />
							)}
						</button>
						<NotificationModal
							isOpen={isNotificationModalOpen}
							onClose={() => setIsNotificationModalOpen(false)}
						/>
					</div>
					<div className="hidden md:block">
						<ConnectButton />
					</div>

					{/* Mobile user menu trigger */}
					<button
						className="md:hidden p-2 hover:bg-(--bg-tertiary) rounded-full transition-colors"
						onClick={() => setIsMobileMenuOpen((v) => !v)}
						aria-expanded={isMobileMenuOpen}
						aria-haspopup="menu"
						aria-label="Open menu"
					>
						<User className="w-5 h-5 text-(--text-secondary)" />
					</button>
				</div>
			</div>

			{/* Mobile search bar drawer */}
			<AnimatePresence>
				{isDiscoverPage && isMobileSearchOpen && (
					<motion.div
						ref={mobileSearchRef}
						className="md:hidden border-t border-(--border) px-4 py-3 bg-(--bg-secondary)"
						initial={{ height: 0, opacity: 0, y: -8 }}
						animate={{ height: "auto", opacity: 1, y: 0 }}
						exit={{ height: 0, opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) w-5 h-5" />
							<input
								autoFocus
								type="text"
								placeholder="Search songs, artists, albums..."
								className="w-full pl-10 pr-10 py-2 bg-(--bg-tertiary) border border-(--border) rounded-full text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
							/>
							<button
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-(--bg-secondary)"
								onClick={() => setIsMobileSearchOpen(false)}
								aria-label="Close search"
							>
								<X className="w-4 h-4 text-(--text-secondary)" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile dropdown menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						ref={mobileMenuRef}
						className="md:hidden absolute right-6 top-full mt-2 w-56 rounded-xl border border-(--border) bg-(--bg-secondary) shadow-lg p-4"
						role="menu"
						initial={{ opacity: 0, scale: 0.95, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -8 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
					>
						<div className="flex flex-col gap-3">
							<button
								className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-(--bg-tertiary) transition-colors relative"
								onClick={() => {
									setIsMobileMenuOpen(false);
									setIsNotificationModalOpen(true);
								}}
							>
								<Bell className="w-5 h-5 text-(--text-secondary)" />
								<span className="text-sm text-(--text)">Notifications</span>
								{unreadCount > 0 && (
									<span className="absolute top-1 right-1 w-2 h-2 bg-(--accent-primary) rounded-full" />
								)}
							</button>
							<div className="w-full">
								<ConnectButton />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile Notification Modal */}
			<div className="md:hidden">
				{isNotificationModalOpen && (
					<NotificationModal
						isOpen={isNotificationModalOpen}
						onClose={() => setIsNotificationModalOpen(false)}
					/>
				)}
			</div>
		</header>
	);
};

export default Header;
