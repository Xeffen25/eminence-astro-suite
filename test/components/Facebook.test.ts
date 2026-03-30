import { Facebook } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Facebook", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders fb:app_id when appId is provided", async () => {
		const result = await container.renderToString(Facebook, {
			props: { appId: "123456789" },
		});

		expect(result).toBe('<meta property="fb:app_id" content="123456789">');
	});

	it("renders one fb:admins tag for a string admin", async () => {
		const result = await container.renderToString(Facebook, {
			props: { admins: "10001" },
		});

		expect(result).toBe('<meta property="fb:admins" content="10001">');
	});

	it("renders multiple fb:admins tags for an admin list", async () => {
		const result = await container.renderToString(Facebook, {
			props: { admins: ["10001", "10002"] },
		});

		expect(result).toBe('<meta property="fb:admins" content="10001"><meta property="fb:admins" content="10002">');
	});
});
