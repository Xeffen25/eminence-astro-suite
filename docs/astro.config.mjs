// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import cloudflare from "@astrojs/cloudflare";

const packageDir = fileURLToPath(new URL("../package", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://eminence-astro-suite.xeffen25.com",
  vite: {
    resolve: {
      alias: {
        "@package": packageDir,
      },
    },
  },
  adapter: cloudflare({
    imageService: "cloudflare",
    prerenderEnvironment: "node",
  }),
  integrations: [
    starlight({
      title: "Eminence Astro Suite",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Xeffen25/eminence-astro-suite",
        },
      ],
      sidebar: [
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Integration",
          items: [{ autogenerate: { directory: "integration" } }],
        },
        {
          label: "Policies",
          items: [{ autogenerate: { directory: "policies" } }],
        },
        {
          label: "Recommendations",
          items: [{ autogenerate: { directory: "recommendations" } }],
        },
      ],
    }),
  ],
});
