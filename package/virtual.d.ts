declare module "virtual:eminence-astro-suite/head-tags" {
	type Config = import("./integration/virtual-config").ResolvedTagConfig;

	const config: Config;

	export default config;
}
