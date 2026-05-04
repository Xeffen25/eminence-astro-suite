import { Manifest } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Manifest", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.manifest = undefined;
  });

  // Basic
  it("renders a manifest link tag with an explicit href string", async () => {
    const result = await container.renderToString(Manifest, {
      props: { href: "https://example.com/manifest.webmanifest" },
    });

    expect(result).toBe(
      '<link rel="manifest" href="https://example.com/manifest.webmanifest">',
    );
  });

  // Automatic
  it("renders a manifest link tag from integration config when href is omitted", async () => {
    config.manifest = "https://example.com/manifest.webmanifest";

    const result = await container.renderToString(Manifest, {
      props: {},
    });

    expect(result).toBe(
      '<link rel="manifest" href="https://example.com/manifest.webmanifest">',
    );
  });

  // Complete
  it("renders a manifest link tag with a URL instance href", async () => {
    const result = await container.renderToString(Manifest, {
      props: { href: new URL("https://cdn.example.com/app.webmanifest") },
    });

    expect(result).toBe(
      '<link rel="manifest" href="https://cdn.example.com/app.webmanifest">',
    );
  });

  // Edge cases
  it("uses prop href instead of integration config to prevent fallback override", async () => {
    config.manifest = "https://example.com/manifest.webmanifest";

    const result = await container.renderToString(Manifest, {
      props: { href: "https://cdn.example.com/app.webmanifest" },
    });

    expect(result).toBe(
      '<link rel="manifest" href="https://cdn.example.com/app.webmanifest">',
    );
  });

  it("renders nothing when href is explicitly false to prevent invalid tag output", async () => {
    const result = await container.renderToString(Manifest, {
      props: { href: false },
    });

    expect(result).toBe("");
  });

  it("renders nothing when neither prop nor integration config provides href", async () => {
    const result = await container.renderToString(Manifest, {
      props: {},
    });

    expect(result).toBe("");
  });
});
