// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://eminence-astro-suite.xeffen25.com",
	adapter: cloudflare(),
	output: "server",
	integrations: [
		starlight({
			title: "My Docs",
			social: [{ icon: "github", label: "GitHub", href: "https://github.com/withastro/starlight" }],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Example Guide", slug: "guides/example" },
					],
				},
				{
					label: "Components",
					autogenerate: { directory: "components" },
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
