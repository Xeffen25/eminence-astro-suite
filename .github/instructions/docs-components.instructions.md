---
description: "Use when creating or editing component documentation pages in src/content/docs/components. Enforces MDX-only docs, Starlight component usage, frontmatter patterns, and the standard page structure."
name: "Docs Components Structure"
applyTo: "src/content/docs/components/**/*.mdx"
---

# Docs Components Structure

Use this structure for every page in `src/content/docs/components`.

## File Type And Components

- Component docs pages must be `.mdx` files.
- Do not create new `.md` files in `src/content/docs/components`.
- Use Starlight components where they improve clarity (for example: tabs, asides, steps, and cards).
- When using a Starlight component, import it explicitly at the top of the MDX file.

## Frontmatter

- Use YAML frontmatter with `title` and `description`.
- `title` must follow: `ComponentName - Component`
- `description` should follow this structure:
    - Sentence 1: identify the component by name and purpose.
    - Sentence 2 (optional): clarify what it handles, generates, or constrains.
    - Keep language concise and factual.
- Keep frontmatter concise and factual.

### Frontmatter Template

```md
---
title: ComponentName - Component
description: Documentation for ComponentName, focused on <primary responsibility>. <Optional short scope sentence.>
---
```

## Required Sections

Keep this exact high-level section order:

1. Intro description paragraph (directly below frontmatter)
2. `## Props`
3. `## Usage & Examples`
4. `## Decisions Made`
5. `## Reference`

## Section Rules

### Intro Description

- Add a clear summary of what the component renders and what responsibility boundaries it has.
- Keep it short (1 to 3 paragraphs).

### Props

- Use a table with exactly 5 columns:
    - `prop`
    - `type`
    - `default`
    - `required`
    - `description`
- Include all public props.

### Usage & Examples

- Always include these examples in this order:
    1. Basic usage (essential props)
    2. Auto usage (no props, if supported)
    3. Complete usage (all relevant props)
- For each example, include:
    - Input (`.astro`)
    - Output (`.html`)
- Show output generated through Astro `experimental_AstroContainer` style testing context.
- Prefer Starlight presentation components for example readability (for example tabs or cards when showing input/output pairs).

### Decisions Made

- Explain component opinions and defaults.
- Start with an overview paragraph when helpful.
- Use one `###` subsection per decision.
- For each decision, include:
    - What decision was made
    - Why it was made
    - How it is implemented (when relevant)

### Reference

- Include relevant official references and trusted sources.
- Start with MDN links when MDN has relevant documentation.
- Prefer specifications and official framework docs before blog posts.
