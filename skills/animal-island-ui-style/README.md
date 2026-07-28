# animal-island-ui-style skill

An installable skill that teaches AI coding agents (Claude Code, Codex, Cursor, and other
SKILL.md-compatible agents) to build UIs in the style of
[animal-island-ui](https://github.com/guokaigdg/animal-island-ui) — a React component
library inspired by a cozy island-style UI.

It covers two scenarios, each with its own entry:

- **React project** — using the `animal-island-ui` npm package: setup, API exploration via
  the package's TypeScript declarations, recipes, theming with `--animal-*` tokens.
- **Standalone HTML** — generating a single self-contained `index.html` (React via CDN +
  Babel runtime) that hand-rolls the components while mirroring the real API.

## Install

With the [skills](https://github.com/vercel-labs/skills) CLI:

```bash
skills add guokaigdg/animal-island-ui
```

Or manually: copy this `animal-island-ui-style/` directory into your agent's skills
location (for Claude Code: `~/.claude/skills/` or `<project>/.claude/skills/`).

## Layout

```
animal-island-ui-style/
├── SKILL.md                     # entry: style summary, tokens, scenario routing, hard rules
├── SKILL.zh-CN.md               # Chinese translation, for human review only (agents read SKILL.md)
└── references/
    ├── react-project.md         # scenario: React project with the npm package
    ├── standalone-html.md       # scenario: single-file HTML, no build step
    └── components/              # props references by category (9 files, 30 components)
```

Exact design values (every hex/px/keyframe) are deliberately not duplicated into the
skill — it links to the canonical
[design system](https://github.com/guokaigdg/animal-island-ui/tree/main/docs/design-system)
in the repository.

## License

The library and this skill are CC BY-NC 4.0 — non-commercial use only. See the
[repository LICENSE](https://github.com/guokaigdg/animal-island-ui/blob/main/LICENSE).
