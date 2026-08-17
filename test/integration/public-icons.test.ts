import {
  detectPublicIcons,
  FAVICON_ICO_RECOMMENDATION,
} from "@package/integration/public-icons";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

describe("Integration - Public icons", () => {
  const createPublicDir = async (): Promise<{ path: string; url: URL }> => {
    const path = join(tmpdir(), `eminence-public-icons-${randomUUID()}`);
    await mkdir(path, { recursive: true });
    return { path, url: pathToFileURL(`${path}/`) };
  };

  it("detects only supported public icon files and emits their fixed metadata", async () => {
    const publicDir = await createPublicDir();
    await Promise.all([
      writeFile(join(publicDir.path, "favicon.svg"), "<svg />"),
      writeFile(join(publicDir.path, "favicon.png"), "png"),
      writeFile(join(publicDir.path, "apple-touch-icon.png"), "png"),
      writeFile(join(publicDir.path, "other-icon.png"), "png"),
    ]);

    expect(detectPublicIcons(publicDir.url)).toEqual({
      tags: [
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        {
          rel: "icon",
          href: "/favicon.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      hasFaviconIco: false,
    });
  });

  it("detects favicon.ico without creating a link tag for it", async () => {
    const publicDir = await createPublicDir();
    await writeFile(join(publicDir.path, "favicon.ico"), "ico");

    expect(detectPublicIcons(publicDir.url)).toEqual({
      tags: [],
      hasFaviconIco: true,
    });
  });

  it("returns no tags when no supported icons exist", async () => {
    const publicDir = await createPublicDir();

    expect(detectPublicIcons(publicDir.url)).toEqual({
      tags: [],
      hasFaviconIco: false,
    });
  });

  it("explains why favicon.ico is recommended but not tagged", () => {
    expect(FAVICON_ICO_RECOMMENDATION).toContain("public/favicon.ico");
    expect(FAVICON_ICO_RECOMMENDATION).toContain("does not emit a link tag");
  });
});
