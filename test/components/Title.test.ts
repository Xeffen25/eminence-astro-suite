import { Title } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Title", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.titleTemplate = "%s";
  });

  // Basic
  it("renders title tag with provided value", async () => {
    const result = await container.renderToString(Title, {
      props: { value: "Home" },
    });

    expect(result).toBe("<title>Home</title>");
  });

  // Automatic
  it("renders title tag using integration config template", async () => {
    config.titleTemplate = "%s | My Site";

    const result = await container.renderToString(Title, {
      props: { value: "Home" },
    });

    expect(result).toBe("<title>Home | My Site</title>");
  });

  // Complete
  it("renders title tag with explicit template", async () => {
    const result = await container.renderToString(Title, {
      props: { value: "Home", template: "%s | My Site" },
    });

    expect(result).toBe("<title>Home | My Site</title>");
  });

  it("explicit template prop overrides integration config template", async () => {
    config.titleTemplate = "%s | Config Site";

    const result = await container.renderToString(Title, {
      props: { value: "Home", template: "%s | My Site" },
    });

    expect(result).toBe("<title>Home | My Site</title>");
  });
});
