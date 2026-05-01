# Eminence Astro Suite

Astro components and integration for managing your page head, metadata, social sharing, icons, and SEO outputs.

## Installation

This integration configures your Astro project with head metadata components and build-time outputs like `robots.txt`, `security.txt`, sitemap support, and icons.

If you are not using this integration in your Astro config, the components will fail because they rely on the integration runtime configuration.

### Why Eminence Astro Suite

Eminence Astro Suite provides a single setup for page head metadata and SEO-oriented outputs. It combines reusable components with integration features so you can keep metadata, social sharing tags, and generated policy files consistent across your project.

### Install with `astro add` (recommended)

Astro includes an `astro add` command to automate integration setup. This installs `eminence-astro-suite` and updates your Astro config in one step.

**pnpm**

```bash
pnpm astro add eminence-astro-suite
```

**npm**

```bash
npx astro add eminence-astro-suite
```

After installation, you can use `Head` and the individual metadata components in your pages and layouts.

### Manual install

If you prefer manual setup, install the package with your preferred package manager.

**pnpm**

```bash
pnpm add eminence-astro-suite
```

**npm**

```bash
npm install eminence-astro-suite
```

Then add the integration to your Astro config:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import eminence from "eminence-astro-suite/integration";

export default defineConfig({
  integrations: [
    eminence({
      head: {
        titleTemplate: "%s | My Site",
      },
      icons: {},
      robotsTxt: {},
      securityTxt: {},
      sitemap: {},
    }),
  ],
});
```

> [!WARNING]
> The components require the integration to be present in your Astro config. Using components without registering `eminence-astro-suite/integration` will fail.

## Usage

There are two primary ways to use this package. Pick what suits your project, or combine them freely.

### Head component

The simplest approach: use `Head` in your layout and pass page-level props. Title, description, and Open Graph data can be handled in one place.

```astro
---
import { Head } from "eminence-astro-suite/components";
---

<html lang="en">
  <head>
    <Head
      title="Home"
      titleTemplate="%s | My Site"
      description="Welcome to my site"
      openGraph={{
        title: "Home",
        description: "Welcome to my site",
        images: [{ url: "/og.jpg", alt: "My Site", width: 1200, height: 630 }],
      }}
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Read more in the [Head component docs](https://eminence-astro-suite.xeffen25.com/components/head/).

### Individual components

Use components directly in your `<head>` for full control.

```astro
---
import {
  Charset,
  Viewport,
  Title,
  Description,
  Canonical,
  OpenGraph,
  Robots,
  Icons,
} from "eminence-astro-suite/components";
---

<html lang="en">
  <head>
    <Charset />
    <Viewport />
    <Title value="My Page" template="%s | My Site" />
    <Description content="Welcome to my site" />
    <Canonical href="https://example.com/my-page" />
    <OpenGraph
      title="My Page"
      description="Welcome to my site"
      images={[{ url: "/og.jpg", alt: "My Site" }]}
    />
    <Robots index follow />
    <Icons />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Read more in the component docs under `docs/src/content/docs/components/`.

## Integration

If you installed with `astro add`, your config is set up automatically. Manual setup is also available:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import eminence from "eminence-astro-suite/integration";

export default defineConfig({
  integrations: [
    eminence({
      head: {
        titleTemplate: "%s | My Site",
      },
      // Set any of these to false to disable
      icons: {},
      robotsTxt: {},
      securityTxt: {},
      sitemap: {},
    }),
  ],
});
```

## Components

- AppleItunesApp
- AppLinks
- Base
- Canonical
- Charset
- ColorScheme
- Description
- Generator
- Head
- HumansTxt
- Icons
- JsonLd
- LanguageAlternates
- Layout
- Manifest
- OpenGraph
- Robots
- ThemeColor
- Title
- Verification
- Viewport

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and contribution guidelines.

## License

MIT
