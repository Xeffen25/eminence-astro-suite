import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default getViteConfig(
	{
		resolve: {
			alias: {
				"virtual:eminence-astro-suite/head-tags": fileURLToPath(
					new URL("./test/mocks/virtual-config.ts", import.meta.url),
				),
			},
		},
	},
	{
		configFile: false,
	},
);
