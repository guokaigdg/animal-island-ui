# One-click prompt — generate an animal-island-ui page with any AI tool

For non-developers: paste one short prompt into an AI tool that can fetch URLs
(Cursor / Claude / ChatGPT / Gemini / v0 / Bolt / Lovable / Windsurf), answer one
question, and get a single `index.html` you can double-click to preview — no npm,
no build step.

The prompt intentionally contains no style definitions. The AI fetches the canonical
spec files from this repository itself, so the prompt never drifts out of date.

## How to use (4 steps)

1. Copy the prompt block below in full.
2. Paste it into your AI tool and send.
3. The AI asks what page you want — answer in one phrase (e.g. "personal blog",
   "product list", "FAQ page").
4. Save the returned `index.html` and double-click it to preview in your browser.

## The prompt

````markdown
You are a senior React engineer. Your goal: produce ONE self-contained `index.html`
(React 18 via unpkg CDN + Babel standalone; all CSS inline) that perfectly matches the
visual style of the "animal-island-ui" component library, for a non-technical user who
will save the file and double-click it.

STEP 1 — Fetch and read these spec files (raw markdown) before doing anything else:

- Generation contract (output requirements, CDN setup, component hand-rolling rules):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/skills/animal-island-ui-style/references/standalone-html.md
- Complete `:root` design-token template (exact values):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/css-variables.md
- Design rules (hard visual contracts and anti-patterns):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-rules.md

Follow every instruction in the first file, including fetching the per-component spec
files it points to for the components your page will use.

STEP 2 — Ask me what page I want (offer 3–5 concrete suggestions). Do not generate HTML
in that turn.

STEP 3 — After I answer, deliver the complete `index.html` in a single fenced code block,
then list any spec line you intentionally relaxed and why.
````

## Notes

- Tools without URL access can't use this prompt — install the
  [agent skill](../skills/animal-island-ui-style/README.md) instead, or work in a real
  React project.
- This mode reproduces 95%+ of the visual style by hand-rolling components. For 100%
  pixel fidelity, use a React project with `npm install animal-island-ui` — see the
  [README quick start](../README.md).
