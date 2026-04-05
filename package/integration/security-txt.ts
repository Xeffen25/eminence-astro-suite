import { constants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from "../integration";

export type SecurityTxtExpiresUnit = "day" | "days" | "month" | "months" | "year" | "years";

export type SecurityTxtExpiresDuration = `${number} ${SecurityTxtExpiresUnit}`;

export type SecurityTxtOptions = {
	contact: string | string[];
	expires: Date | string | SecurityTxtExpiresDuration;
	encryption?: string | string[];
	acknowledgments?: string | string[];
	preferredLanguages?: string | string[];
	canonical?: string | string[];
	policy?: string | string[];
	hiring?: string | string[];
	csaf?: string | string[];
};

export const SECURITY_TXT_RECOMMENDATION =
	"Recommendation: follow todo.com/later-create-article to learn why adding a basic security.txt is important.";

export const SECURITY_TXT_RELATIVE_PATH = "/.well-known/security.txt";

const toArray = <T>(value: T | T[] | undefined): T[] => {
	if (value === undefined) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
};

const assertHttpsUrl = (value: string, fieldName: string): string => {
	let parsed: URL;

	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`Invalid ${fieldName} value "${value}": expected a valid absolute URL.`);
	}

	if (parsed.protocol !== "https:") {
		throw new Error(`Invalid ${fieldName} value "${value}": only https:// URLs are allowed.`);
	}

	return value;
};

const assertContact = (value: string): string => {
	if (value.startsWith("mailto:")) {
		return value;
	}

	return assertHttpsUrl(value, "Contact");
};

const EXPIRES_DURATION_PATTERN = /^(\d+)\s+(day|days|month|months|year|years)$/i;

const addDuration = (now: Date, amount: number, unit: SecurityTxtExpiresUnit): Date => {
	const result = new Date(now.getTime());

	switch (unit) {
		case "day":
		case "days":
			result.setUTCDate(result.getUTCDate() + amount);
			return result;
		case "month":
		case "months":
			result.setUTCMonth(result.getUTCMonth() + amount);
			return result;
		case "year":
		case "years":
			result.setUTCFullYear(result.getUTCFullYear() + amount);
			return result;
	}
};

const parseExpiresDuration = (value: string): { amount: number; unit: SecurityTxtExpiresUnit } | undefined => {
	const match = value.match(EXPIRES_DURATION_PATTERN);
	if (!match) {
		return undefined;
	}

	const amount = Number.parseInt(match[1], 10);
	if (!Number.isSafeInteger(amount) || amount < 1) {
		throw new Error(`Invalid Expires value "${value}": duration amount must be a positive integer.`);
	}

	return {
		amount,
		unit: match[2].toLowerCase() as SecurityTxtExpiresUnit,
	};
};

const normalizeExpires = (value: SecurityTxtOptions["expires"], now: Date = new Date()): string => {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) {
			throw new Error("Invalid Expires value: received an invalid Date instance.");
		}

		return value.toISOString();
	}

	const duration = parseExpiresDuration(value);
	if (duration) {
		return addDuration(now, duration.amount, duration.unit).toISOString();
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(
			`Invalid Expires value "${value}": expected an ISO 8601 date string, Date object, or a duration like "30 days", "6 months", or "1 year".`,
		);
	}

	return parsed.toISOString();
};

const buildSecurityTxt = (options: SecurityTxtOptions, now: Date = new Date()): string => {
	const lines: string[] = [];

	for (const value of toArray(options.contact)) {
		lines.push(`Contact: ${assertContact(value)}`);
	}

	if (lines.length === 0) {
		throw new Error("Missing required securityTxt.contact value.");
	}

	lines.push(`Expires: ${normalizeExpires(options.expires, now)}`);

	for (const value of toArray(options.encryption)) {
		lines.push(`Encryption: ${assertHttpsUrl(value, "Encryption")}`);
	}

	for (const value of toArray(options.acknowledgments)) {
		lines.push(`Acknowledgments: ${assertHttpsUrl(value, "Acknowledgments")}`);
	}

	const preferredLanguages = toArray(options.preferredLanguages).join(", ");
	if (preferredLanguages.length > 0) {
		lines.push(`Preferred-Languages: ${preferredLanguages}`);
	}

	for (const value of toArray(options.canonical)) {
		lines.push(`Canonical: ${assertHttpsUrl(value, "Canonical")}`);
	}

	for (const value of toArray(options.policy)) {
		lines.push(`Policy: ${assertHttpsUrl(value, "Policy")}`);
	}

	for (const value of toArray(options.hiring)) {
		lines.push(`Hiring: ${assertHttpsUrl(value, "Hiring")}`);
	}

	for (const value of toArray(options.csaf)) {
		lines.push(`CSAF: ${assertHttpsUrl(value, "CSAF")}`);
	}

	return `${lines.join("\n")}\n`;
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

export async function generateSecurityTxt({ dir, options, logger }: IntegrationRuntimeContext): Promise<void> {
	const input = options.securityTxt;
	const outputPath = join(fileURLToPath(dir), ".well-known", "security.txt");
	const outputExists = await exists(outputPath);

	if (input === false) {
		if (outputExists) {
			logger.info(
				`No "${SECURITY_TXT_RELATIVE_PATH}" file was generated nor modified because it already exists.`,
			);
		} else {
			logger.info(`No "${SECURITY_TXT_RELATIVE_PATH}" file exists and no file was generated.`);
		}

		return;
	}

	if (input === undefined) {
		logger.warn(
			`No security.txt file was generated because securityTxt is undefined. ${SECURITY_TXT_RECOMMENDATION}`,
		);
		return;
	}

	if (typeof input !== "object" || input === null) {
		logger.error("Invalid securityTxt configuration: expected an object with Contact and Expires fields.");
		throw new Error("Invalid securityTxt configuration: expected an object.");
	}

	if (outputExists) {
		logger.warn(
			`Could not generate "${SECURITY_TXT_RELATIVE_PATH}" because it already exists. Disabling securityTxt generation for this build.`,
		);
		options.securityTxt = false;
		return;
	}

	try {
		const content = buildSecurityTxt(input);
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, content, "utf-8");
		logger.info(`Generated "${SECURITY_TXT_RELATIVE_PATH}"`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		logger.error(`Failed to generate "${SECURITY_TXT_RELATIVE_PATH}": ${message}`);
		throw error;
	}
}
