import type { IntegrationRuntimeContext } from "@package/integration";
import {
  generateSecurityTxt,
  SECURITY_TXT_RECOMMENDATION,
  SECURITY_TXT_RELATIVE_PATH,
} from "@package/integration/security-txt";
import type { AstroConfig } from "astro";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Integration - SecurityTxt", () => {
  let outputDir: string;
  let outDirUrl: URL;
  let logger: TestLogger;

  beforeEach(async () => {
    outputDir = join(tmpdir(), `eminence-security-${randomUUID()}`);
    outDirUrl = pathToFileURL(outputDir + "/");
    logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

    await mkdir(outputDir, { recursive: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createContext = (
    securityTxt: IntegrationRuntimeContext["options"]["securityTxt"],
  ): IntegrationRuntimeContext => ({
    config: { outDir: outDirUrl } as unknown as AstroConfig,
    dir: outDirUrl,
    options: { securityTxt },
    logger: logger as unknown as IntegrationRuntimeContext["logger"],
  });

  it("writes a valid security.txt with required and optional fields", async () => {
    await generateSecurityTxt(
      createContext({
        contact: [
          "mailto:test@test.com",
          "https://example.com/security-contact",
        ],
        expires: "2026-04-03T16:55:00.000Z",
        encryption: "https://example.com/pgp-key.txt",
        acknowledgments: "https://example.com/hall-of-fame.html",
        preferredLanguages: ["en", "es", "ru"],
        canonical: "https://example.com/.well-known/security.txt",
        policy: "https://example.com/security-policy.html",
        hiring: "https://example.com/jobs.html",
        csaf: "https://example.com/.well-known/csaf/provider-metadata.json",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );

    expect(result).toContain("Contact: mailto:test@test.com");
    expect(result).toContain("Contact: https://example.com/security-contact");
    expect(result).toContain("Expires: 2026-04-03T16:55:00.000Z");
    expect(result).toContain("Encryption: https://example.com/pgp-key.txt");
    expect(result).toContain(
      "Acknowledgments: https://example.com/hall-of-fame.html",
    );
    expect(result).toContain("Preferred-Languages: en, es, ru");
    expect(result).toContain(
      "Canonical: https://example.com/.well-known/security.txt",
    );
    expect(result).toContain(
      "Policy: https://example.com/security-policy.html",
    );
    expect(result).toContain("Hiring: https://example.com/jobs.html");
    expect(result).toContain(
      "CSAF: https://example.com/.well-known/csaf/provider-metadata.json",
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Generated "${SECURITY_TXT_RELATIVE_PATH}"`,
    );
  });

  it("supports Expires durations in days and normalizes to ISO 8601", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: "mailto:test@test.com",
        expires: "7 days",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toContain("Expires: 2026-04-03T00:00:00.000Z");
  });

  it("rolls months into the next year when needed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-15T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: "mailto:test@test.com",
        expires: "1 month",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toContain("Expires: 2027-01-15T00:00:00.000Z");
  });

  it("rolls days into the next month when needed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-30T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: "mailto:test@test.com",
        expires: "5 days",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toContain("Expires: 2026-02-04T00:00:00.000Z");
  });

  it("accepts Date instances for Expires", async () => {
    await generateSecurityTxt(
      createContext({
        contact: "mailto:test@test.com",
        expires: new Date("2030-01-01T00:00:00.000Z"),
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toContain("Expires: 2030-01-01T00:00:00.000Z");
  });

  it("warns and disables generation when security.txt already exists", async () => {
    await mkdir(join(outputDir, ".well-known"), { recursive: true });
    await writeFile(
      join(outputDir, ".well-known", "security.txt"),
      "existing",
      "utf-8",
    );
    const context = createContext({
      contact: "mailto:test@test.com",
      expires: "1 year",
    });

    await expect(generateSecurityTxt(context)).resolves.toBeUndefined();
    expect(context.options.securityTxt).toBe(false);

    expect(logger.warn).toHaveBeenCalledWith(
      `Could not generate "${SECURITY_TXT_RELATIVE_PATH}" because it already exists. Disabling securityTxt generation for this build.`,
    );
  });

  it("logs info when securityTxt is false and file already exists", async () => {
    await mkdir(join(outputDir, ".well-known"), { recursive: true });
    await writeFile(
      join(outputDir, ".well-known", "security.txt"),
      "existing",
      "utf-8",
    );

    await generateSecurityTxt(createContext(false));

    expect(logger.info).toHaveBeenCalledWith(
      `No "${SECURITY_TXT_RELATIVE_PATH}" file was generated nor modified because it already exists.`,
    );
  });

  it("logs info when securityTxt is false and no file exists", async () => {
    await generateSecurityTxt(createContext(false));

    expect(logger.info).toHaveBeenCalledWith(
      `No "${SECURITY_TXT_RELATIVE_PATH}" file exists and no file was generated.`,
    );
  });

  it("warns with recommendation when securityTxt is undefined", async () => {
    await generateSecurityTxt(createContext(undefined));

    expect(logger.warn).toHaveBeenCalledWith(
      `No security.txt file was generated because securityTxt is undefined. ${SECURITY_TXT_RECOMMENDATION}`,
    );
  });

  it("logs an error before throwing when generation fails", async () => {
    await expect(
      generateSecurityTxt(
        createContext({
          contact: "test@test.com",
          expires: "1 year",
        }),
      ),
    ).rejects.toThrow("Invalid Contact value");

    expect(logger.error).toHaveBeenCalledWith(
      `Failed to generate "${SECURITY_TXT_RELATIVE_PATH}": Invalid Contact value "test@test.com": expected a valid absolute URL.`,
    );
  });

  it("rejects invalid Contact and invalid URL fields", async () => {
    await expect(
      generateSecurityTxt(
        createContext({
          contact: "test@test.com",
          expires: "1 year",
        }),
      ),
    ).rejects.toThrow("Invalid Contact value");

    await expect(
      generateSecurityTxt(
        createContext({
          contact: "mailto:test@test.com",
          expires: "1 year",
          encryption: "http://example.com/key.txt",
        }),
      ),
    ).rejects.toThrow("Invalid Encryption value");
  });

  it("rejects invalid Expires duration units", async () => {
    await expect(
      generateSecurityTxt(
        createContext({
          contact: "mailto:test@test.com",
          expires: "2 weeks",
        }),
      ),
    ).rejects.toThrow("Invalid Expires value");
  });
});
