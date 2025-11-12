import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import { somniaTestnet } from "wagmi/chains";

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
	console.log("Please provide a project Id");
}

export const config = getDefaultConfig({
	appName: "Rhitta",
	projectId,
	chains: [somniaTestnet],
	// ssr: true,
});
