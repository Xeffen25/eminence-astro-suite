import { constants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from "../integration";

export type CrawlerAgent = string;

export type RobotsTxtRule = {
	agent: CrawlerAgent | CrawlerAgent[];
	allow?: string | string[];
	disallow?: string | string[];
	noindex?: string | string[];
	cleanParam?: string | string[];
	crawlDelay?: number;
};

export type RobotsTxtOptions = {
	rules: RobotsTxtRule | RobotsTxtRule[];
	sitemap?: string | string[];
};

export const ROBOTS_TXT_RECOMMENDATION =
	"Recommendation: follow todo.com/later-create-article to learn why adding a robots.txt is important.";

export const ROBOTS_TXT_RELATIVE_PATH = "/robots.txt";

const toArray = <T>(value: T | T[] | undefined): T[] => {
	if (value === undefined) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
};

const exists = async (path: string): Promise<boolean> => {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
			return false;
		}

		throw error;
	}
};

const assertNonEmptyString = (value: string, fieldName: string): string => {
	if (value.trim().length === 0) {
		throw new Error(`Invalid ${fieldName} value: expected a non-empty string.`);
	}

	return value;
};

const normalizeAgentList = (value: RobotsTxtRule["agent"]): string[] => {
	const agents = toArray(value).map((agent) => assertNonEmptyString(agent, "agent"));

	if (agents.length === 0) {
		throw new Error("Invalid robotsTxt rule: at least one agent is required.");
	}

	return agents;
};

const normalizePathDirective = (
	value: RobotsTxtRule["allow"] | RobotsTxtRule["disallow"] | RobotsTxtRule["noindex"],
	fieldName: "allow" | "disallow" | "noindex",
): string[] => {
	return toArray(value).map((entry) => {
		const normalized = assertNonEmptyString(entry, fieldName);

		if (!normalized.startsWith("/")) {
			throw new Error(`Invalid ${fieldName} value "${entry}": expected a path starting with "/".`);
		}

		return normalized;
	});
};

const normalizeCleanParam = (value: RobotsTxtRule["cleanParam"]): string[] => {
	return toArray(value).map((entry) => assertNonEmptyString(entry, "cleanParam"));
};

const normalizeCrawlDelay = (value: number | undefined): number | undefined => {
	if (value === undefined) {
		return undefined;
	}

	if (!Number.isFinite(value) || value < 0) {
		throw new Error(`Invalid crawlDelay value "${value}": expected a non-negative number.`);
	}

	return value;
};

const normalizeSite = (site: IntegrationRuntimeContext["config"]["site"]): URL | undefined => {
	if (!site) {
		return undefined;
	}

	return new URL(site);
};

const normalizeSitemapValue = (value: string, site: URL | undefined): string => {
	const entry = assertNonEmptyString(value, "sitemap");

	try {
		const parsed = new URL(entry);

		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			throw new Error(`Invalid sitemap value "${entry}": expected an http(s) URL or relative path.`);
		}

		return parsed.href;
	} catch {
		if (!site) {
			throw new Error(
				`Invalid sitemap value "${entry}": relative sitemap values require Astro site to be configured.`,
			);
		}

		return new URL(entry, site).href;
	}
};

const buildRobotsTxt = (options: RobotsTxtOptions, site: IntegrationRuntimeContext["config"]["site"]): string => {
	const normalizedSite = normalizeSite(site);
	const rules = toArray(options.rules);
	if (rules.length === 0) {
		throw new Error("Invalid robotsTxt configuration: expected at least one rule.");
	}

	const blocks = rules.map((rule) => {
		const lines: string[] = [];
		for (const agent of normalizeAgentList(rule.agent)) {
			lines.push(`User-agent: ${agent}`);
		}

		for (const value of normalizePathDirective(rule.allow, "allow")) {
			lines.push(`Allow: ${value}`);
		}

		for (const value of normalizePathDirective(rule.disallow, "disallow")) {
			lines.push(`Disallow: ${value}`);
		}

		for (const value of normalizePathDirective(rule.noindex, "noindex")) {
			lines.push(`Noindex: ${value}`);
		}

		for (const value of normalizeCleanParam(rule.cleanParam)) {
			lines.push(`Clean-param: ${value}`);
		}

		const crawlDelay = normalizeCrawlDelay(rule.crawlDelay);
		if (crawlDelay !== undefined) {
			lines.push(`Crawl-delay: ${crawlDelay}`);
		}

		if (lines.length === 0) {
			throw new Error("Invalid robotsTxt rule: each rule must include at least one directive.");
		}

		return lines.join("\n");
	});

	const sitemaps = toArray(options.sitemap).map((entry) => normalizeSitemapValue(entry, normalizedSite));

	const outputLines: string[] = [];
	for (const block of blocks) {
		if (outputLines.length > 0) {
			outputLines.push("");
		}

		outputLines.push(block);
	}

	if (sitemaps.length > 0) {
		outputLines.push("");
		for (const sitemap of sitemaps) {
			outputLines.push(`Sitemap: ${sitemap}`);
		}
	}

	return `${outputLines.join("\n")}\n`;
};

export async function generateRobotsTxt({ config, dir, options, logger }: IntegrationRuntimeContext): Promise<void> {
	const input = options.robotsTxt;
	const outputPath = join(fileURLToPath(dir), "robots.txt");
	const outputExists = await exists(outputPath);

	if (input === false) {
		if (outputExists) {
			logger.info(`No "${ROBOTS_TXT_RELATIVE_PATH}" file was generated nor modified because it already exists.`);
		} else {
			logger.info(`No "${ROBOTS_TXT_RELATIVE_PATH}" file exists and no file was generated.`);
		}

		return;
	}

	if (input === undefined) {
		logger.warn(`No robots.txt file was generated because robotsTxt is undefined. ${ROBOTS_TXT_RECOMMENDATION}`);
		return;
	}

	if (typeof input !== "object" || input === null) {
		logger.error("Invalid robotsTxt configuration: expected an object with a rules field.");
		throw new Error("Invalid robotsTxt configuration: expected an object.");
	}

	if (outputExists) {
		logger.warn(
			`Could not generate "${ROBOTS_TXT_RELATIVE_PATH}" because it already exists. Disabling robotsTxt generation for this build.`,
		);
		options.robotsTxt = false;
		return;
	}

	try {
		const content = buildRobotsTxt(input, config.site);
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, content, "utf-8");
		logger.info(`Generated "${ROBOTS_TXT_RELATIVE_PATH}"`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		logger.error(`Failed to generate "${ROBOTS_TXT_RELATIVE_PATH}": ${message}`);
		throw error;
	}
}
