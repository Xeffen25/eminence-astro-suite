import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type IconTag = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
  media?: "light" | "dark" | (string & {});
};

export type DetectedPublicIcons = {
  tags: IconTag[];
  hasFaviconIco: boolean;
};

export const FAVICON_ICO_RECOMMENDATION =
  'Recommendation: add "public/favicon.ico" as a fallback favicon. Browsers discover this conventional path automatically, so Eminence does not emit a link tag for it.';

const existsInPublicDir = (publicDir: URL, fileName: string): boolean =>
  existsSync(fileURLToPath(new URL(fileName, publicDir)));

export const detectPublicIcons = (publicDir: URL): DetectedPublicIcons => {
  const tags: IconTag[] = [];

  if (existsInPublicDir(publicDir, "favicon.svg")) {
    tags.push({
      rel: "icon",
      href: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml",
    });
  }

  if (existsInPublicDir(publicDir, "favicon.png")) {
    tags.push({
      rel: "icon",
      href: "/favicon.png",
      sizes: "32x32",
      type: "image/png",
    });
  }

  if (existsInPublicDir(publicDir, "apple-touch-icon.png")) {
    tags.push({
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    });
  }

  return {
    tags,
    hasFaviconIco: existsInPublicDir(publicDir, "favicon.ico"),
  };
};
