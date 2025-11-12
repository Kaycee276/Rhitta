import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import Loader from "./components/Loader";
import Toast from "./components/Toast";
import { usePlayerStore } from "./store/playerStore";
import { useToastStore } from "./store/toastStore";

// Lazy load page components
const Home = lazy(() => import("./pages/Home"));
const Discover = lazy(() => import("./pages/Discover"));
const Library = lazy(() => import("./pages/Library"));
const AddSong = lazy(() => import("./pages/AddSong"));
// const Trending = lazy(() => import("./pages/Trending"));

const App = () => {
	const { playerState } = usePlayerStore();
	const { toasts, removeToast } = useToastStore();

	return (
		<Router>
			<div className="flex h-screen bg-(--bg) text-(--text) overflow-hidden">
				<Sidebar />
				<div className="flex-1 flex flex-col overflow-hidden">
					<Header />
					<main className="flex-1 overflow-y-auto pb-32 md:pb-24">
						<Suspense fallback={<Loader />}>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/discover" element={<Discover />} />
								{/* <Route path="/trending" element={<Trending />} /> */}
								<Route path="/library" element={<Library />} />
								<Route path="/add-song" element={<AddSong />} />
							</Routes>
						</Suspense>
					</main>
				</div>
				{playerState.currentSong && <MusicPlayer />}
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</Router>
	);
};

export default App;
