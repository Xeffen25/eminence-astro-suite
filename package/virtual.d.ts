declare module "virtual:eminence-astro-seo/config" {
	type ClientHeadConfig = import("./integration/virtual-config").ClientHeadConfig;

	const config: ClientHeadConfig;

	export default config;
}
