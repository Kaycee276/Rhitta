import type * as React from "react";
import type { Transport } from "viem";
import type { Config, CreateConfigParameters, CreateConnectorFn } from "wagmi";

declare module "@rainbow-me/rainbowkit" {
	export const RainbowKitProvider: React.ComponentType<React.PropsWithChildren>;
	export const ConnectButton: React.ComponentType;

	type _RainbowKitChain = {
		id: number;
		[key: string]: unknown;
	};

	type _Chains = readonly [_RainbowKitChain, ..._RainbowKitChain[]];
	type _Transports = Record<_Chains[number]["id"], Transport>;

	interface GetDefaultConfigParameters<
		chains extends _Chains,
		transports extends _Transports
	> extends Omit<
			CreateConfigParameters<chains, transports>,
			"client" | "connectors"
		> {
		appName: string;
		appDescription?: string;
		appUrl?: string;
		appIcon?: string;
		projectId: string;
		wallets?: unknown;
	}

	export function getDefaultConfig<
		chains extends _Chains,
		transports extends _Transports
	>(
		args: GetDefaultConfigParameters<chains, transports>
	): Config<chains, transports, CreateConnectorFn[]>;
}
