export const toHref = (value: StringOrURL) => (typeof value === "string" ? value : value.toString());

export const hasAnyProp = (props: object): boolean => Object.keys(props).length > 0;
