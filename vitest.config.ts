import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		reporters: ["default"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
});
