import type { IntegrationRuntimeContext } from "@package/integration";
import { HUMANS_TXT_RECOMMENDATION, validateHumansTxtInBuildOutput } from "@package/integration/humans-txt";
import type { AstroConfig } from "astro";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Integration - HumansTxt", () => {
	let outputDir: string;
	let outDirUrl: URL;
	let logger: TestLogger;

	beforeEach(async () => {
		outputDir = join(tmpdir(), `eminence-astro-suite-${randomUUID()}`);
		outDirUrl = pathToFileURL(outputDir + "/");
		logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

		await mkdir(outputDir, { recursive: true });
	});

	const createContext = (humansTxt: boolean | undefined): IntegrationRuntimeContext => ({
		config: { outDir: outDirUrl } as AstroConfig,
		dir: outDirUrl,
		options: { head: { humansTxt } },
		logger: logger as unknown as IntegrationRuntimeContext["logger"],
	});

	it("returns silently when humansTxt is false", async () => {
		await validateHumansTxtInBuildOutput(createContext(false));

		expect(logger.warn).not.toHaveBeenCalled();
		expect(logger.info).not.toHaveBeenCalled();
		expect(logger.error).not.toHaveBeenCalled();
	});

	it("warns with recommendation when humansTxt is undefined", async () => {
		await validateHumansTxtInBuildOutput(createContext(undefined));

		expect(logger.warn).toHaveBeenCalledWith(
			`No humans.txt file was generated because humansTxt is undefined. ${HUMANS_TXT_RECOMMENDATION}`,
		);
	});

	it("does not warn when humansTxt is true and humans.txt exists", async () => {
		await writeFile(join(outputDir, "humans.txt"), "Team humans.txt content", "utf-8");

		await validateHumansTxtInBuildOutput(createContext(true));

		expect(logger.warn).not.toHaveBeenCalled();
	});

	it("warns with recommendation when humansTxt is true and humans.txt is missing", async () => {
		await validateHumansTxtInBuildOutput(createContext(true));

		expect(logger.warn).toHaveBeenCalledWith(
			`humans.txt was not found in the build output. ${HUMANS_TXT_RECOMMENDATION}`,
		);
	});
});
