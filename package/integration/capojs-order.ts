const HEAD_PATTERN = /<head([^>]*)>([\s\S]*?)<\/head>/i;
const TAG_PATTERN =
	/<!--[\s\S]*?-->|<([a-zA-Z][\w:-]*)(\s[^>]*)?>[\s\S]*?<\/\1\s*>|<([a-zA-Z][\w:-]*)(\s[^>]*)?\/?\s*>/g;

type HeadElement = {
	raw: string;
	tagName: string;
	attributes: Record<string, string>;
	index: number;
};

const ATTRIBUTE_PATTERN = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

const parseAttributes = (rawAttributes: string | undefined): Record<string, string> => {
	if (!rawAttributes) {
		return {};
	}

	const attributes: Record<string, string> = {};
	for (const match of rawAttributes.matchAll(ATTRIBUTE_PATTERN)) {
		const key = match[1]?.toLowerCase();
		if (!key) {
			continue;
		}

		const value = match[2] ?? match[3] ?? match[4] ?? "";
		attributes[key] = value;
	}

	return attributes;
};

const extractHeadElements = (headContent: string): HeadElement[] => {
	const elements: HeadElement[] = [];
	let index = 0;

	for (const match of headContent.matchAll(TAG_PATTERN)) {
		const raw = match[0];
		if (!raw.startsWith("<") || raw.startsWith("<!--")) {
			continue;
		}

		const tagName = (match[1] ?? match[3] ?? "").toLowerCase();
		if (!tagName) {
			continue;
		}

		const rawAttributes = match[2] ?? match[4];
		elements.push({
			raw,
			tagName,
			attributes: parseAttributes(rawAttributes),
			index,
		});
		index += 1;
	}

	return elements;
};

export const getCapoWeight = (tagName: string, attributes: Record<string, string>): number => {
	const lowerTag = tagName.toLowerCase();
	const rel = (attributes.rel ?? "").toLowerCase();
	const name = (attributes.name ?? "").toLowerCase();
	const httpEquiv = (attributes["http-equiv"] ?? "").toLowerCase();

	if (lowerTag === "meta" && "charset" in attributes) return 0;
	if (lowerTag === "meta" && name === "viewport") return 10;
	if (lowerTag === "meta" && httpEquiv === "content-security-policy") return 15;
	if (lowerTag === "base") return 20;
	if (lowerTag === "title") return 30;
	if (lowerTag === "link" && rel === "preconnect") return 40;
	if (lowerTag === "link" && rel === "dns-prefetch") return 45;
	if (lowerTag === "link" && (rel === "preload" || rel === "modulepreload")) return 50;
	if (lowerTag === "meta") return 60;
	if (lowerTag === "link") return 70;
	if (lowerTag === "style") return 80;
	if (lowerTag === "script") return 90;

	return 100;
};

const sortHeadElements = (elements: HeadElement[]): HeadElement[] => {
	return [...elements].sort((left, right) => {
		const leftWeight = getCapoWeight(left.tagName, left.attributes);
		const rightWeight = getCapoWeight(right.tagName, right.attributes);

		if (leftWeight !== rightWeight) {
			return leftWeight - rightWeight;
		}

		return left.index - right.index;
	});
};

export const reorderHeadContent = (headContent: string): string => {
	const elements = extractHeadElements(headContent);
	if (elements.length < 2) {
		return headContent;
	}

	const leadingWhitespace = headContent.match(/^\s*/)?.[0] ?? "";
	const trailingWhitespace = headContent.match(/\s*$/)?.[0] ?? "";
	const sorted = sortHeadElements(elements)
		.map((element) => element.raw)
		.join("\n");

	return `${leadingWhitespace}${sorted}${trailingWhitespace}`;
};

export const reorderHeadInDocument = (html: string): string => {
	const match = html.match(HEAD_PATTERN);
	if (!match) {
		return html;
	}

	const headAttributes = match[1] ?? "";
	const currentHeadContent = match[2] ?? "";
	const reorderedHeadContent = reorderHeadContent(currentHeadContent);

	if (reorderedHeadContent === currentHeadContent) {
		return html;
	}

	const replacement = `<head${headAttributes}>${reorderedHeadContent}</head>`;
	return html.replace(HEAD_PATTERN, replacement);
};

export const isHtmlResponse = (response: Response): boolean => {
	const contentType = response.headers.get("content-type") ?? "";
	return /text\/html/i.test(contentType);
};

export const optimizeHeadResponse = async (
	response: Response,
	transformDocument: (html: string) => string = reorderHeadInDocument,
): Promise<Response> => {
	if (!response.ok || !isHtmlResponse(response)) {
		return response;
	}

	const originalHtml = await response.text();
	const transformedHtml = transformDocument(originalHtml);
	const headers = new Headers(response.headers);
	headers.delete("content-length");

	return new Response(transformedHtml, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
};
