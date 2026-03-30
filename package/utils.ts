export const toHref = (value: StringOrURL) => (typeof value === "string" ? value : value.toString());
