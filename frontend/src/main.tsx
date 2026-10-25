import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StellarWalletProvider } from "./context/StellarWalletContext";

window.Buffer = Buffer;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StellarWalletProvider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StellarWalletProvider>
	</StrictMode>
);
