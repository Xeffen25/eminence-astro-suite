import type { IntegrationRuntimeContext } from "@package/integration";
import {
  generateRobotsTxt,
  ROBOTS_TXT_RECOMMENDATION,
  ROBOTS_TXT_RELATIVE_PATH,
} from "@package/integration/robots-txt";
import type { AstroConfig } from "astro";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Integration - RobotsTxt", () => {
  let outputDir: string;
  let outDirUrl: URL;
  let logger: TestLogger;

  beforeEach(async () => {
    outputDir = join(tmpdir(), `eminence-robots-${randomUUID()}`);
    outDirUrl = pathToFileURL(outputDir + "/");
    logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

    await mkdir(outputDir, { recursive: true });
  });

  const createContext = (
    robotsTxt: IntegrationRuntimeContext["options"]["robotsTxt"],
    site: URL | string | undefined = new URL("https://example.com/"),
  ): IntegrationRuntimeContext => ({
    config: { site, outDir: outDirUrl } as unknown as AstroConfig,
    dir: outDirUrl,
    options: { robotsTxt },
    logger: logger as unknown as IntegrationRuntimeContext["logger"],
  });

  it("writes robots.txt with directives and sitemap entries", async () => {
    await generateRobotsTxt(
      createContext({
        rules: [
          {
            agent: "*",
            allow: "/",
            disallow: "/private",
            noindex: "/drafts",
            cleanParam: "utm_source /",
            crawlDelay: 2,
          },
          {
            agent: ["Googlebot", "Bingbot"],
            disallow: ["/tmp", "/cache"],
          },
        ],
        sitemap: ["/sitemap.xml", "https://cdn.example.com/sitemap-news.xml"],
      }),
    );

    const result = await readFile(join(outputDir, "robots.txt"), "utf-8");
    expect(result).toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /private",
        "Noindex: /drafts",
        "Clean-param: utm_source /",
        "Crawl-delay: 2",
        "",
        "User-agent: Googlebot",
        "User-agent: Bingbot",
        "Disallow: /tmp",
        "Disallow: /cache",
        "",
        "Sitemap: https://example.com/sitemap.xml",
        "Sitemap: https://cdn.example.com/sitemap-news.xml",
        "",
      ].join("\n"),
    );

    expect(logger.info).toHaveBeenCalledWith(
      `Generated "${ROBOTS_TXT_RELATIVE_PATH}"`,
    );
  });

  it("warns and disables generation when robots.txt already exists", async () => {
    await writeFile(join(outputDir, "robots.txt"), "existing", "utf-8");
    const context = createContext({
      rules: { agent: "*", disallow: "/private" },
    });

    await generateRobotsTxt(context);

    expect(context.options.robotsTxt).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      `Could not generate "${ROBOTS_TXT_RELATIVE_PATH}" because it already exists. Disabling robotsTxt generation for this build.`,
    );
  });

  it("logs info when robotsTxt is false and robots.txt exists", async () => {
    await writeFile(join(outputDir, "robots.txt"), "existing", "utf-8");

    await generateRobotsTxt(createContext(false));

    expect(logger.info).toHaveBeenCalledWith(
      `No "${ROBOTS_TXT_RELATIVE_PATH}" file was generated nor modified because it already exists.`,
    );
  });

  it("logs info when robotsTxt is false and no file exists", async () => {
    await generateRobotsTxt(createContext(false));

    expect(logger.info).toHaveBeenCalledWith(
      `No "${ROBOTS_TXT_RELATIVE_PATH}" file exists and no file was generated.`,
    );
  });

  it("warns with recommendation when robotsTxt is undefined", async () => {
    await generateRobotsTxt(createContext(undefined));

    expect(logger.warn).toHaveBeenCalledWith(
      `No robots.txt file was generated because robotsTxt is undefined. ${ROBOTS_TXT_RECOMMENDATION}`,
    );
  });

  it("logs an error before throwing when a directive path is invalid", async () => {
    await expect(
      generateRobotsTxt(
        createContext({
          rules: {
            agent: "*",
            disallow: "private",
          },
        }),
      ),
    ).rejects.toThrow(
      'Invalid disallow value "private": expected a path starting with "/".',
    );

    expect(logger.error).toHaveBeenCalledWith(
      `Failed to generate "${ROBOTS_TXT_RELATIVE_PATH}": Invalid disallow value "private": expected a path starting with "/".`,
    );
  });

  it("throws when relative sitemap entries are used without Astro site", async () => {
    const context = createContext(
      {
        rules: { agent: "*", allow: "/" },
        sitemap: "/sitemap.xml",
      },
      new URL("https://example.com/"),
    );
    context.config.site = undefined;

    await expect(generateRobotsTxt(context)).rejects.toThrow(
      "relative sitemap values require Astro site to be configured",
    );
  });

  it("throws when crawlDelay is negative", async () => {
    await expect(
      generateRobotsTxt(
        createContext({
          rules: {
            agent: "*",
            allow: "/",
            crawlDelay: -1,
          },
        }),
      ),
    ).rejects.toThrow(
      'Invalid crawlDelay value "-1": expected a non-negative number.',
    );
  });

  it("throws when rules are missing or empty", async () => {
    await expect(
      generateRobotsTxt(
        createContext({
          rules: [],
        }),
      ),
    ).rejects.toThrow(
      "Invalid robotsTxt configuration: expected at least one rule.",
    );
  });
});
