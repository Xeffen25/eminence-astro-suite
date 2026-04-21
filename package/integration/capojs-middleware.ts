import { defineMiddleware } from "astro:middleware";
import { optimizeHeadResponse, reorderHeadInDocument } from "./capojs-order";

const CAPO_MARKER_ATTRIBUTE = "data-eminence-capo-index";
const CAPO_MARKER_PATTERN = new RegExp(`\\s${CAPO_MARKER_ATTRIBUTE}="\\d+"`, "g");

const stripCapoMarkers = (html: string): string => {
	return html.replace(CAPO_MARKER_PATTERN, "");
};

const reorderMarkedHead = (html: string): string => {
	return stripCapoMarkers(reorderHeadInDocument(html));
};

const annotateHeadElements = (response: Response): Response => {
	if (typeof HTMLRewriter === "undefined") {
		return response;
	}

	let index = 0;
	return new HTMLRewriter()
		.on("head > *", {
			element(element) {
				element.setAttribute(CAPO_MARKER_ATTRIBUTE, String(index));
				index += 1;
			},
		})
		.transform(response);
};

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();
	const annotatedResponse = annotateHeadElements(response);

	return optimizeHeadResponse(annotatedResponse, reorderMarkedHead);
});
