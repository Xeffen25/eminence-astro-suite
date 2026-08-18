const META_HTTP_EQUIV_KEYWORDS = new Set([
  "accept-ch",
  "content-security-policy",
  "content-type",
  "default-style",
  "delegate-ch",
  "origin-trial",
  "x-dns-prefetch-control",
]);

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type HeadElement = {
  attributes: Map<string, string>;
  markup: string;
  originalIndex: number;
  tagName: string;
  textContent: string;
};

const findTagEnd = (html: string, start: number): number => {
  let quote: '"' | "'" | undefined;

  for (let index = start + 1; index < html.length; index++) {
    const character = html[index];
    if (quote) {
      if (character === quote) quote = undefined;
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === ">") return index + 1;
  }

  return html.length;
};

const readTagName = (html: string, start: number): string | undefined => {
  const match = /^<\s*([a-z][\w:-]*)/i.exec(html.slice(start));
  return match?.[1]?.toLowerCase();
};

const findClosingElementEnd = (
  html: string,
  openingEnd: number,
  tagName: string,
): number => {
  const lowerHtml = html.toLowerCase();
  const closingPrefix = `</${tagName}`;
  let searchFrom = openingEnd;

  while (searchFrom < html.length) {
    const closingStart = lowerHtml.indexOf(closingPrefix, searchFrom);
    if (closingStart === -1) return html.length;

    const boundary = lowerHtml[closingStart + closingPrefix.length];
    if (boundary === ">" || boundary === undefined || /\s/.test(boundary)) {
      return findTagEnd(html, closingStart);
    }

    searchFrom = closingStart + closingPrefix.length;
  }

  return html.length;
};

const findElementEnd = (
  html: string,
  start: number,
  openingEnd: number,
  tagName: string,
): number => {
  const openingTag = html.slice(start, openingEnd);
  if (VOID_ELEMENTS.has(tagName) || /\/\s*>$/.test(openingTag)) {
    return openingEnd;
  }

  return findClosingElementEnd(html, openingEnd, tagName);
};

const parseAttributes = (openingTag: string): Map<string, string> => {
  const attributes = new Map<string, string>();
  const tagNameMatch = /^<\s*[a-z][\w:-]*/i.exec(openingTag);
  const attributeSource = openingTag.slice(tagNameMatch?.[0].length ?? 0);
  const attributePattern =
    /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of attributeSource.matchAll(attributePattern)) {
    const name = match[1]?.toLowerCase();
    if (!name || name === "/") continue;
    attributes.set(name, match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attributes;
};

const tokenizeHead = (
  headContent: string,
): { elements: HeadElement[]; suffix: string } => {
  const elements: HeadElement[] = [];
  let pendingStart = 0;
  let position = 0;

  while (position < headContent.length) {
    const elementStart = headContent.indexOf("<", position);
    if (elementStart === -1) break;

    if (headContent.startsWith("<!--", elementStart)) {
      const commentEnd = headContent.indexOf("-->", elementStart + 4);
      position = commentEnd === -1 ? headContent.length : commentEnd + 3;
      continue;
    }

    const tagName = readTagName(headContent, elementStart);
    if (!tagName) {
      position = elementStart + 1;
      continue;
    }

    const openingEnd = findTagEnd(headContent, elementStart);
    const elementEnd = findElementEnd(
      headContent,
      elementStart,
      openingEnd,
      tagName,
    );
    const elementMarkup = headContent.slice(elementStart, elementEnd);
    const innerStart = openingEnd - elementStart;
    const closingStart = elementMarkup
      .toLowerCase()
      .lastIndexOf(`</${tagName}`);

    elements.push({
      attributes: parseAttributes(headContent.slice(elementStart, openingEnd)),
      markup: headContent.slice(pendingStart, elementEnd),
      originalIndex: elements.length,
      tagName,
      textContent:
        closingStart >= innerStart
          ? elementMarkup.slice(innerStart, closingStart)
          : "",
    });

    pendingStart = elementEnd;
    position = elementEnd;
  }

  return { elements, suffix: headContent.slice(pendingStart) };
};

const hasAttribute = (element: HeadElement, name: string): boolean =>
  element.attributes.has(name);

const getAttribute = (element: HeadElement, name: string): string | undefined =>
  element.attributes.get(name);

const getCapoWeight = (element: HeadElement): number => {
  const { tagName } = element;

  if (tagName === "base") return 10;
  if (tagName === "meta") {
    if (hasAttribute(element, "charset")) return 10;
    if (getAttribute(element, "name")?.toLowerCase() === "viewport") {
      return 10;
    }
    const httpEquiv = getAttribute(element, "http-equiv")?.toLowerCase();
    if (httpEquiv && META_HTTP_EQUIV_KEYWORDS.has(httpEquiv)) return 10;
  }

  if (tagName === "title") return 9;

  if (
    tagName === "link" &&
    getAttribute(element, "rel")?.toLowerCase() === "preconnect"
  ) {
    return 8;
  }

  if (
    tagName === "script" &&
    hasAttribute(element, "src") &&
    hasAttribute(element, "async")
  ) {
    return 7;
  }

  const media = getAttribute(element, "media")?.toLowerCase().trim();
  if (
    tagName === "style" &&
    media !== "print" &&
    /@import/.test(element.textContent)
  ) {
    return 6;
  }

  if (tagName === "script") {
    const type = getAttribute(element, "type")?.toLowerCase().trim();
    const hasSrc = hasAttribute(element, "src");
    const isDataScript = type?.includes("json") || type === "speculationrules";
    const isDeferred =
      hasSrc &&
      (hasAttribute(element, "defer") ||
        (type === "module" && !hasAttribute(element, "async")));

    if (!isDataScript && !isDeferred) return 5;
  }

  if (tagName === "style" && media !== "print") return 4;
  if (
    tagName === "link" &&
    getAttribute(element, "rel")?.toLowerCase() === "stylesheet" &&
    media !== "print"
  ) {
    return 4;
  }

  if (tagName === "link") {
    const rel = getAttribute(element, "rel")?.toLowerCase();
    if (rel === "preload" || rel === "modulepreload") return 3;
  }

  if (tagName === "script" && hasAttribute(element, "src")) {
    const type = getAttribute(element, "type")?.toLowerCase();
    if (
      hasAttribute(element, "defer") ||
      (type === "module" && !hasAttribute(element, "async"))
    ) {
      return 2;
    }
  }

  if (tagName === "script") {
    const type = getAttribute(element, "type")?.toLowerCase().trim();
    if (type === "speculationrules") return 1;
  }

  if (tagName === "link") {
    const rel = getAttribute(element, "rel")?.toLowerCase();
    if (rel === "prefetch" || rel === "dns-prefetch" || rel === "prerender") {
      return 1;
    }
  }

  return 0;
};

const findHead = (
  html: string,
): { contentEnd: number; contentStart: number } | undefined => {
  const openingPattern = /<head\b/gi;
  let openingMatch: RegExpExecArray | null;

  while ((openingMatch = openingPattern.exec(html))) {
    const commentStart = html.lastIndexOf("<!--", openingMatch.index);
    const commentEnd = html.lastIndexOf("-->", openingMatch.index);
    if (commentStart > commentEnd) continue;

    const contentStart = findTagEnd(html, openingMatch.index);
    let position = contentStart;

    while (position < html.length) {
      const tagStart = html.indexOf("<", position);
      if (tagStart === -1) return undefined;

      if (html.startsWith("<!--", tagStart)) {
        const end = html.indexOf("-->", tagStart + 4);
        position = end === -1 ? html.length : end + 3;
        continue;
      }

      if (/^<\/\s*head\s*>/i.test(html.slice(tagStart))) {
        return { contentStart, contentEnd: tagStart };
      }

      const tagName = readTagName(html, tagStart);
      if (!tagName) {
        position = tagStart + 1;
        continue;
      }

      const openingEnd = findTagEnd(html, tagStart);
      position = findElementEnd(html, tagStart, openingEnd, tagName);
    }
  }

  return undefined;
};

export const reorderHead = (html: string): string => {
  const head = findHead(html);
  if (!head) return html;

  const headContent = html.slice(head.contentStart, head.contentEnd);
  const { elements, suffix } = tokenizeHead(headContent);
  if (elements.length < 2) return html;

  const sorted = [...elements].sort((left, right) => {
    const weightDifference = getCapoWeight(right) - getCapoWeight(left);
    return weightDifference || left.originalIndex - right.originalIndex;
  });

  if (sorted.every((element, index) => element === elements[index])) {
    return html;
  }

  const sortedContent = sorted.map(({ markup }) => markup).join("") + suffix;
  return `${html.slice(0, head.contentStart)}${sortedContent}${html.slice(
    head.contentEnd,
  )}`;
};

const isUtf8Html = (contentType: string | null): boolean => {
  if (!contentType || !/^text\/html(?:\s*;|$)/i.test(contentType)) return false;
  const charset = /charset\s*=\s*["']?([^;\s"']+)/i.exec(contentType)?.[1];
  const normalizedCharset = charset?.toLowerCase();
  return (
    !normalizedCharset ||
    normalizedCharset === "utf-8" ||
    normalizedCharset === "utf8"
  );
};

export const reorderHtmlResponse = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (
    request.method === "HEAD" ||
    response.body === null ||
    !isUtf8Html(response.headers.get("content-type"))
  ) {
    return response;
  }

  const contentEncoding = response.headers.get("content-encoding");
  if (contentEncoding && contentEncoding.toLowerCase() !== "identity") {
    return response;
  }

  const transformedHtml = reorderHead(await response.text());
  const headers = new Headers(response.headers);
  for (const staleHeader of [
    "content-length",
    "content-md5",
    "digest",
    "etag",
  ]) {
    headers.delete(staleHeader);
  }

  return new Response(transformedHtml, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};
