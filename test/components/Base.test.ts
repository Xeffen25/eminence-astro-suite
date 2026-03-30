import { Base } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Base", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders base tag with href and target", async () => {
		const result = await container.renderToString(Base, {
			props: { href: "https://example.com", target: "_blank" },
		});

		expect(result).toBe('<base href="https://example.com" target="_blank">');
	});

	it("renders base tag with only href", async () => {
		const result = await container.renderToString(Base, {
			props: { href: "https://example.com" },
		});

		expect(result).toBe('<base href="https://example.com">');
	});

	it("renders base tag with only target", async () => {
		const result = await container.renderToString(Base, {
			props: { target: "_blank" },
		});

		expect(result).toBe('<base target="_blank">');
	});

	it("renders nothing when href is not provided", async () => {
		const result = await container.renderToString(Base, {
			props: {},
		});

		expect(result).toBe("");
	});
});
