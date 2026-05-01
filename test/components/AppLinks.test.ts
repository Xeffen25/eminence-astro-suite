import { AppLinks } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const resetClientHeadConfig = () => {
  Object.assign(clientHeadConfig, {
    appLinks: undefined,
  });
};

describe("Component AppLinks", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetClientHeadConfig();
    container = await experimental_AstroContainer.create();
  });

  it("renders App Links tags from integration defaults when no props are provided", async () => {
    Object.assign(clientHeadConfig, {
      appLinks: {
        ios: {
          url: "myapp://open",
          app_store_id: "123456789",
        },
        android: {
          package: "com.example.app",
          app_name: "Example App",
        },
        web: {
          url: "https://example.com",
          should_fallback: true,
        },
      },
    });

    const result = await container.renderToString(AppLinks, {
      props: {},
    });

    expect(result).toBe(
      '<meta property="al:ios:url" content="myapp://open"><meta property="al:ios:app_store_id" content="123456789"><meta property="al:android:package" content="com.example.app"><meta property="al:android:app_name" content="Example App"><meta property="al:web:url" content="https://example.com"><meta property="al:web:should_fallback" content="true">',
    );
  });

  it("renders nothing when no props are provided", async () => {
    const result = await container.renderToString(AppLinks, {
      props: {},
    });

    expect(result).toBe("");
  });

  it("renders iOS, Android, and web App Links tags", async () => {
    const result = await container.renderToString(AppLinks, {
      props: {
        ios: {
          url: "myapp://open",
          app_store_id: "123456789",
        },
        android: {
          package: "com.example.app",
          app_name: "Example App",
        },
        web: {
          url: "https://example.com",
          should_fallback: true,
        },
      },
    });

    expect(result).toBe(
      '<meta property="al:ios:url" content="myapp://open"><meta property="al:ios:app_store_id" content="123456789"><meta property="al:android:package" content="com.example.app"><meta property="al:android:app_name" content="Example App"><meta property="al:web:url" content="https://example.com"><meta property="al:web:should_fallback" content="true">',
    );
  });

  it("renders URL instances and false web fallback", async () => {
    const result = await container.renderToString(AppLinks, {
      props: {
        ios: {
          url: new URL("https://ios.example.com/open"),
        },
        web: {
          url: new URL("https://example.com/path"),
          should_fallback: false,
        },
      },
    });

    expect(result).toBe(
      '<meta property="al:ios:url" content="https://ios.example.com/open"><meta property="al:web:url" content="https://example.com/path"><meta property="al:web:should_fallback" content="false">',
    );
  });
});
