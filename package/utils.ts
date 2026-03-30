export const toHref = (value: StringOrURL) => (typeof value === "string" ? value : value.toString());

type HrefishProps = {
	href?: StringOrURL | false;
};

/**
 * Normalizes "href-like" input into an optional props object.
 *
 * Accepts either an existing props object `T`, a `StringOrURL` value, a boolean,
 * or `undefined` and converts it into a value compatible with `HrefishProps`:
 *
 * - `undefined` or `false` → `undefined` (no props).
 * - `true` → an empty props object (`{} as T`), allowing callers to opt-in
 *   without specifying any concrete `href` value.
 * - `StringOrURL` (string or `URL` instance) → `{ href: value } as T`.
 * - An object of type `T` (extending `HrefishProps`) → returned as-is.
 *
 * @typeParam T - A props type that extends {@link HrefishProps}.
 * @param value - A props object, `StringOrURL`, boolean flag, or `undefined` to normalize.
 * @returns `undefined` when no props should be applied, or a props object of type `T`.
 */

export const toOptionalHrefProps = <T extends HrefishProps>(
	value: T | StringOrURL | boolean | undefined,
): T | undefined =>
	value === undefined || value === false
		? undefined
		: value === true
			? ({} as T)
			: typeof value === "string" || value instanceof URL
				? ({ href: value } as T)
				: value;
