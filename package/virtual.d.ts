declare module "virtual:eminence-astro-suite/config" {
	type ClientHeadConfig = import("./integration/virtual-config").ClientHeadConfig;

	const config: ClientHeadConfig;

	export default config;
}
