import { CAPOJS_MIDDLEWARE_ENTRYPOINT, CAPOJS_RECOMMENDATION, configureCapojs } from "@package/integration/capojs";
import { describe, expect, it, vi } from "vitest";

describe("Integration - Capojs", () => {
	const createLogger = (): TestLogger => ({
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
	});

	it("warns with recommendation when capojs is undefined", () => {
		const logger = createLogger();
		const addMiddleware = vi.fn();

		configureCapojs({
			capojs: undefined,
			logger: logger as never,
			addMiddleware,
		});

		expect(addMiddleware).not.toHaveBeenCalled();
		expect(logger.warn).toHaveBeenCalledWith(
			`No Capo.js optimization was applied because capojs is undefined. ${CAPOJS_RECOMMENDATION}`,
		);
	});

	it("returns silently when capojs is false", () => {
		const logger = createLogger();
		const addMiddleware = vi.fn();

		configureCapojs({
			capojs: false,
			logger: logger as never,
			addMiddleware,
		});

		expect(addMiddleware).not.toHaveBeenCalled();
		expect(logger.warn).not.toHaveBeenCalled();
		expect(logger.error).not.toHaveBeenCalled();
	});

	it("registers middleware when capojs is 'typescript'", () => {
		const logger = createLogger();
		const addMiddleware = vi.fn();

		configureCapojs({
			capojs: "typescript",
			logger: logger as never,
			addMiddleware,
		});

		expect(addMiddleware).toHaveBeenCalledWith({
			entrypoint: CAPOJS_MIDDLEWARE_ENTRYPOINT,
			order: "post",
		});
	});

	it("logs an error and throws when capojs has an invalid value", () => {
		const logger = createLogger();
		const addMiddleware = vi.fn();

		expect(() => {
			configureCapojs({
				capojs: "invalid" as never,
				logger: logger as never,
				addMiddleware,
			});
		}).toThrow("Invalid capojs configuration.");

		expect(logger.error).toHaveBeenCalledWith('Invalid capojs value "invalid": expected "typescript" or false.');
	});
});
