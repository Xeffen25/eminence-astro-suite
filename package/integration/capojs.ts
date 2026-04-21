import type { AstroIntegrationLogger } from "astro";

export const CAPOJS_RECOMMENDATION =
	'Recommendation: enable capojs with "typescript" to reorder head tags using a Capo-inspired high-performance sequence.';

export const CAPOJS_MIDDLEWARE_ENTRYPOINT = new URL("./capojs-middleware.ts", import.meta.url);

type MiddlewareRegistration = {
	entrypoint: URL;
	order: "pre" | "post";
};

type AddMiddleware = (middleware: MiddlewareRegistration) => void;

type ConfigureCapojsInput = {
	capojs: "typescript" | false | undefined;
	logger: AstroIntegrationLogger;
	addMiddleware: AddMiddleware;
};

export function configureCapojs({ capojs, logger, addMiddleware }: ConfigureCapojsInput): void {
	if (capojs === undefined) {
		logger.warn(`No Capo.js optimization was applied because capojs is undefined. ${CAPOJS_RECOMMENDATION}`);
		return;
	}

	if (capojs === false) {
		return;
	}

	if (capojs !== "typescript") {
		logger.error(`Invalid capojs value "${String(capojs)}": expected "typescript" or false.`);
		throw new Error("Invalid capojs configuration.");
	}

	addMiddleware({
		entrypoint: CAPOJS_MIDDLEWARE_ENTRYPOINT,
		order: "post",
	});
}
