// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://eminence-astro-suite.xeffen25.com",
	adapter: cloudflare({
		prerenderEnvironment: "node",
	}),
	integrations: [
		starlight({
			title: "My Docs",
			social: [{ icon: "github", label: "GitHub", href: "https://github.com/Xeffen25/eminence-astro-suite" }],
			sidebar: [
				{
					label: "Components",
					autogenerate: { directory: "components" },
				},
			],
		}),
	],
});
