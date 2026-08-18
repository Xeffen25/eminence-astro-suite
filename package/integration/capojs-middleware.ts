import { defineMiddleware } from "astro:middleware";
import { reorderHtmlResponse } from "./capojs";

export const onRequest = defineMiddleware(async ({ request }, next) => {
  return reorderHtmlResponse(request, await next());
});
