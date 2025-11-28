import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { addNotification } from "../utils/notifications";

import { somniaTestnet } from "wagmi/chains";

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
	addNotification("Please provide a project Id", "error");
}

export const config = getDefaultConfig({
	appName: "Rhitta",
	projectId,
	chains: [somniaTestnet],
	// ssr: true,
});
