import type { IntegrationRuntimeContext } from "@package/index";
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

  // --- Docs examples ---

  // Docs: Basic usage
  it("generates a minimal security.txt from a single contact and duration", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: "mailto:security@example.com",
        expires: "1 year",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toBe(
      "Contact: mailto:security@example.com\nExpires: 2027-05-05T00:00:00.000Z\n",
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Generated "${SECURITY_TXT_RELATIVE_PATH}"`,
    );
  });

  // Docs: With multiple contacts and policy
  it("outputs multiple contacts, preferred languages, and policy in field order", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: [
          "mailto:security@example.com",
          "https://example.com/security",
        ],
        expires: "6 months",
        policy: "https://example.com/security-policy",
        preferredLanguages: ["en", "fr"],
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toBe(
      "Contact: mailto:security@example.com\n" +
        "Contact: https://example.com/security\n" +
        "Expires: 2026-11-05T00:00:00.000Z\n" +
        "Preferred-Languages: en, fr\n" +
        "Policy: https://example.com/security-policy\n",
    );
  });

  // Docs: With explicit Date expiry
  it("accepts a Date instance for the expires field", async () => {
    await generateSecurityTxt(
      createContext({
        contact: "mailto:security@example.com",
        expires: new Date("2027-01-01T00:00:00.000Z"),
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toContain("Expires: 2027-01-01T00:00:00.000Z");
  });

  // Docs: Complete
  it("outputs all fields in correct declaration order", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T00:00:00.000Z"));

    await generateSecurityTxt(
      createContext({
        contact: [
          "mailto:security@example.com",
          "https://example.com/security",
        ],
        expires: "1 year",
        encryption: "https://example.com/pgp-key.asc",
        acknowledgments: "https://example.com/thanks",
        preferredLanguages: ["en", "fr"],
        canonical: "https://example.com/.well-known/security.txt",
        policy: "https://example.com/security-policy",
        hiring: "https://example.com/security-jobs",
        csaf: "https://example.com/.well-known/csaf/provider-metadata.json",
      }),
    );

    const result = await readFile(
      join(outputDir, ".well-known", "security.txt"),
      "utf-8",
    );
    expect(result).toBe(
      "Contact: mailto:security@example.com\n" +
        "Contact: https://example.com/security\n" +
        "Expires: 2027-05-05T00:00:00.000Z\n" +
        "Encryption: https://example.com/pgp-key.asc\n" +
        "Acknowledgments: https://example.com/thanks\n" +
        "Preferred-Languages: en, fr\n" +
        "Canonical: https://example.com/.well-known/security.txt\n" +
        "Policy: https://example.com/security-policy\n" +
        "Hiring: https://example.com/security-jobs\n" +
        "CSAF: https://example.com/.well-known/csaf/provider-metadata.json\n",
    );
  });

  // Docs: Explicit opt-out
  it("returns without creating a file or logging when securityTxt is false", async () => {
    await generateSecurityTxt(createContext(false));

    await expect(
      readFile(join(outputDir, ".well-known", "security.txt"), "utf-8"),
    ).rejects.toThrow();
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  // --- Edge cases ---

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

  it("rejects bare email address as Contact and http:// URL for encryption field", async () => {
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

  it("normalizes day-based duration to ISO 8601", async () => {
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

  it("rolls day additions across month boundaries", async () => {
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

  it("rolls month additions across year boundaries", async () => {
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
});
