import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default getViteConfig({
	resolve: {
		alias: {
			"virtual:eminence-astro-suite/config": fileURLToPath(
				new URL("./test/mocks/virtual-config.ts", import.meta.url),
			),
		},
	},
});
