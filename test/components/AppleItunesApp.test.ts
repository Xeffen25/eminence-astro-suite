import { AppleItunesApp } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component AppleItunesApp", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders nothing when no id is provided", async () => {
		const result = await container.renderToString(AppleItunesApp, {
			props: {},
		});

		expect(result).toBe("");
	});

	it("renders the meta tag with only an id", async () => {
		const result = await container.renderToString(AppleItunesApp, {
			props: { id: "123456789" },
		});

		expect(result).toBe('<meta name="apple-itunes-app" content="app-id=123456789">');
	});

	it("renders the meta tag with id and argument", async () => {
		const result = await container.renderToString(AppleItunesApp, {
			props: { id: "123456789", argument: "myapp://open" },
		});

		expect(result).toBe('<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">');
	});
});
