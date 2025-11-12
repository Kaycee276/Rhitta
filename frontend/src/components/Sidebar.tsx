import {
	Home,
	Music,
	// TrendingUp,
	Library,
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useToastStore } from "../store/toastStore";

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { address } = useAccount();
	const { addToast } = useToastStore();

	const getIsMobile = () =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false;

	const [isMobile, setIsMobile] = useState(getIsMobile);
	const [collapsed, setCollapsed] = useState(() =>
		getIsMobile() ? true : false
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(getIsMobile());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (isMobile) {
			setCollapsed(true);
		}
	}, [isMobile]);

	const menuItems = [
		{ icon: Home, label: "Home", path: "/" },
		{ icon: Music, label: "Discover", path: "/discover" },
		// { icon: TrendingUp, label: "Trending", path: "/trending" },
		{ icon: Library, label: "Library", path: "/library" },
	];

	const toggleSidebar = useCallback(() => {
		if (isMobile) return;
		setCollapsed((prev) => !prev);
	}, [isMobile]);

	const sidebarWidth = collapsed ? "w-24" : "w-64";

	const handleAddSong = () => {
		if (!address) {
			addToast("Please connect your wallet to add a song.", "warning");
			return;
		}
		navigate("/add-song");
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<aside
				className={`hidden md:block ${sidebarWidth} bg-(--bg-secondary) border-r border-(--border) h-screen sticky top-0 overflow-y-auto transition-all duration-300`}
			>
				<div className={`${collapsed ? "p-4" : "p-6"}`}>
					{/* Logo */}
					<div
						className={`mb-8 ${
							collapsed
								? "flex justify-center"
								: "flex items-center justify-between"
						}`}
					>
						<div>
							<h1 className="text-2xl font-bold text-(--accent-primary)">
								{collapsed ? "R" : "Rhitta"}
							</h1>
							{!collapsed && (
								<p className="text-sm text-(--text-tertiary) mt-1">
									Music Streaming
								</p>
							)}
						</div>
						<button
							onClick={toggleSidebar}
							className="hidden md:inline-flex p-2 rounded-full hover:bg-(--bg-tertiary) transition-colors"
							aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{collapsed ? (
								<ChevronRight className="w-4 h-4 text-(--text-secondary)" />
							) : (
								<ChevronLeft className="w-4 h-4 text-(--text-secondary)" />
							)}
						</button>
					</div>

					{/* Navigation */}
					<nav className="space-y-2">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;
							return (
								<button
									key={item.path}
									onClick={() => navigate(item.path)}
									className={`w-full flex items-center cursor-pointer ${
										collapsed ? "justify-center px-3 flex-col" : "gap-3 px-4"
									} py-3 rounded-lg transition-colors ${
										isActive
											? "bg-(--accent-primary) text-white"
											: "text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text)"
									}`}
								>
									<Icon className="w-5 h-5" />
									{!collapsed && (
										<span className="font-medium ">{item.label}</span>
									)}
								</button>
							);
						})}
					</nav>

					{collapsed && (
						<button
							onClick={handleAddSong}
							className="w-full mt-6 flex flex-col items-center gap-2 px-3 py-3 border-2 border-dashed border-(--border) border-dashed  rounded-xl text-(--accent-primary) hover:bg-(--bg-tertiary) transition-colors"
						>
							<Plus className="w-5 h-5" />
							<span className="text-xs font-extralight">Add Song</span>
						</button>
					)}

					{/* Playlists Section */}
					{!collapsed && (
						<div className="mt-8">
							<div className="space-y-2">
								<button
									onClick={handleAddSong}
									className="w-full flex items-center gap-3 px-4 py-2 border-2 border-dashed border-(--border) text-(--accent-primary) rounded-lg hover:bg-(--bg-tertiary) transition-colors"
								>
									<Plus className="w-5 h-5" />
									<span className="font-medium">Add Your Song</span>
								</button>
								<h3 className="text-sm font-semibold text-(--text-secondary) uppercase mb-4">
									Playlists
								</h3>
								<button className="w-full text-left px-4 py-2 text-(--text-secondary) hover:text-(--text) hover:bg-(--bg-tertiary) rounded-lg transition-colors">
									Trending Now
								</button>
								<button className="w-full text-left px-4 py-2 text-(--text-secondary) hover:text-(--text) hover:bg-(--bg-tertiary) rounded-lg transition-colors">
									Electronic Vibes
								</button>
								<button className="w-full text-left px-4 py-2 text-(--text-secondary) hover:text-(--text) hover:bg-(--bg-tertiary) rounded-lg transition-colors">
									Chill Space
								</button>
							</div>
						</div>
					)}
				</div>
			</aside>

			{/* Mobile Bottom Navigation */}
			<nav
				className="md:hidden fixed left-0 right-0 bg-(--bg-secondary) border-t border-(--border) z-40"
				style={{ bottom: "0" }}
			>
				<div className="flex items-center justify-around px-2 py-3">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<button
								key={item.path}
								onClick={() => navigate(item.path)}
								className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
									isActive
										? "text-(--accent-primary)"
										: "text-(--text-secondary)"
								}`}
							>
								<Icon className="w-5 h-5" />
								<span className="text-[10px] font-medium">{item.label}</span>
							</button>
						);
					})}

					<button
						onClick={handleAddSong}
						className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
							location.pathname === "/add-song"
								? "text-(--accent-primary)"
								: "text-(--text-secondary)"
						}`}
					>
						<Plus className="w-5 h-5" />
						<span className="text-[10px] font-medium">Add Song</span>
					</button>
				</div>
			</nav>
		</>
	);
};

export default Sidebar;
