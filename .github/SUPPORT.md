# 🛠️ Support & Documentation

Before opening an issue or asking for help, please follow this guide to find the information you need. Our goal is to keep the issue tracker focused on actionable development tasks.

---

## 📖 1. Documentation Site (Primary Resource)

For component references, integration configuration, and usage guides specific to **Eminence Astro Suite**, please visit the [documentation site](https://eminence-astro-suite.xeffen25.com).

**Use the docs for:**

- Component API references (`Head`, `Title`, `OpenGraph`, `JsonLd`, and more).
- Integration setup and configuration options.
- Generated output guides (`robots.txt`, `security.txt`, sitemap, icons).

---

## 📚 2. Official Technical Documentation

If your question is about a specific technology we use, the official docs are the fastest way to get an answer. We use the following stack (ordered by relevance):

- [Astro](https://docs.astro.build)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [pnpm](https://pnpm.io/docs)
- [Vitest](https://vitest.dev/guide/)
- [sharp](https://sharp.pixelplumbing.com/)
- [sharp-ico](https://github.com/ssnangua/sharp-ico)
- [Prettier](https://prettier.io/docs/en/)
- [Husky](https://typicode.github.io/husky/)
- [Lint-staged](https://github.com/okonet/lint-staged)

---

## 🔍 3. Troubleshooting Workflow

If you encounter an error during development:

1. **Read the docs:** Ensure the integration is registered in your Astro config — components depend on the integration runtime config and will fail without it.
2. **Clean Install:** Try running `pnpm install` again to ensure dependencies are synced.
3. **Run checks:** Use `pnpm check` to catch formatting, type, and test issues in one step.
4. **Verify Git Hooks:** If your commit is failing, ensure your code passes the Prettier rules enforced by **Husky** and **Lint-staged**.
5. **Search Issues:** Check both open and closed issues on the repository before filing a new one.

---

## ✉️ Still Need Help?

If you've exhausted the resources above:

- **Bug/Feature:** Open a new issue using the appropriate template.
- **Security:** Please refer to our [Security Policy](.github/SECURITY.md).
