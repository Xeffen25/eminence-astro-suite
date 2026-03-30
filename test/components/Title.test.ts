import { Title } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Title", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders title tag with provided value", async () => {
		const result = await container.renderToString(Title, {
			props: { value: "Home" },
		});

		expect(result).toBe("<title>Home</title>");
	});

	it("applies template with prefix pattern", async () => {
		const result = await container.renderToString(Title, {
			props: { value: "Home", template: "Prefix | %s" },
		});

		expect(result).toBe("<title>Prefix | Home</title>");
	});

	it("applies template with %s placeholder", async () => {
		const result = await container.renderToString(Title, {
			props: { value: "Home", template: "Prefix | %s | Suffix" },
		});

		expect(result).toBe("<title>Prefix | Home | Suffix</title>");
	});

	it("applies template with suffix pattern", async () => {
		const result = await container.renderToString(Title, {
			props: { value: "Home", template: "%s | Suffix" },
		});

		expect(result).toBe("<title>Home | Suffix</title>");
	});
});
