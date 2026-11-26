# Contributing

Issues and pull requests are welcome.

## Filing an Issue

- Use [GitHub Issues](https://github.com/guokaigdg/animal-island-ui/issues) for bug reports and feature requests.
- Bug reports should include reproduction steps, expected behavior, actual behavior, and browser/OS.
- Feature requests should describe the use case and the API design you have in mind.

## Pull Requests

1. Fork the repository and branch off `main` (`git checkout -b feature/my-feature`).
2. Write the code and make sure `npm run ci` passes.
3. Commit following [Conventional Commits](https://www.conventionalcommits.org/) **in English**:
    - `feat: add xxx` — new feature
    - `fix: resolve xxx` — bug fix
    - `docs: update xxx` — documentation
    - `refactor: simplify xxx` — refactor
    - `chore:` / `test:` for tooling and tests
4. Push your branch (`git push origin feature/my-feature`).
5. Open a pull request describing what changed and why.

`npm run ci` is `format:check` + `check:docs` + `lint` + `test:run` + `test:a11y` + `build`. It has to be green before a
PR is reviewed.

## Git Hooks

A git pre-commit hook runs `npm run ci` before every `git commit`; a failing CI aborts the commit.

A git commit-msg hook rejects commit messages containing non-ASCII characters (Chinese etc.) — write the message in
English.

- **Fresh clone**: `npm install` installs the hooks automatically through the `prepare` script
  (`git config core.hooksPath .githooks`).
- **Install manually**: `npm run setup:hooks`
- **Uninstall**: `git config --unset core.hooksPath`
- **Emergency bypass** (discouraged): `git commit --no-verify` — skips the checks entirely, so broken code can land
- **Hook location**: `.githooks/pre-commit` and `.githooks/commit-msg`, committed to the repository so a fresh clone
  gets them

## Local Development

```bash
# clone
git clone https://github.com/guokaigdg/animal-island-ui.git
cd animal-island-ui

# install dependencies (also installs the pre-commit hook)
npm install

# start the demo dev server
npm run dev

# build the library
npm run build

# build the demo site
npm run build:demo
```

The full script list is in [repository-structure.md](./repository-structure.md).

## Before You Open the PR

- New or changed component? Follow [component-development.md](./component-development.md), including its documentation
  sync matrix and the four demo registration points.
- Changed component count or coverage? Run `npm run badges` so `README.md` and `docs/README.zh-CN.md` stay in sync.
- Changed an English file under `docs/`? Update its `docs/zh-CN/` counterpart in the same commit — `npm run check:docs`
  fails otherwise.
- Added a runtime dependency? Don't — `naive-icons` and `dayjs` are the only two; see
  [build-and-release.md](./build-and-release.md) and [ADR 0005](../adr/0005-dayjs-as-the-date-layer.md).

## License

Contributions are licensed under the MIT License, the license of this repository (see `LICENSE`).
