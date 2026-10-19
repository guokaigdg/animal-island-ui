# ADR 0005: dayjs as the Date Layer

## Status

Accepted (v2.3.0) — supersedes the "no further runtime dependency" clause of
[ADR 0001](0001-zero-runtime-dependencies.md), leaving the rest of that record intact.

## Context

ADR 0001 set the rule that the library declares no runtime dependencies, with a single
later exception for icons. Two things have now pulled against that absolute:

1. **Date logic is the part of a component library where hand-rolled code is most likely
   to be subtly wrong.** `DatePicker` and `Countdown` had each grown their own private
   date code: month-grid arithmetic from `new Date(year, month + 1, 0).getDate()`,
   day/month equality by comparing three `getFullYear/getMonth/getDate` fields, string
   formatting through sequential `String.replace` calls, and timestamp subtraction for a
   countdown. Every one of those is a place where time zones, month lengths and
   day-of-month overflow produce bugs that are hard to see in review.
2. **The date surface is about to grow.** The calendar/schedule component requested in
   [discussion #38](https://github.com/guokaigdg/animal-island-ui/discussions/38) needs
   week-start handling, locale month names and potentially time-zone awareness. None of
   the existing hand-rolled helpers can absorb that; each would have to be rebuilt.

"Vendor a copy into `src/`" — the escape hatch ADR 0001 offered — does not work for a
date library. A date library is 2000+ lines of accumulated edge-case handling, and a
vendored copy that is pruned down to what the library currently needs would have to be
re-pruned and re-verified for every new requirement, at which point it is neither small
nor low-risk.

## Decision

`dayjs` is the second runtime entry under `dependencies`, and the only sanctioned way to
do date arithmetic, parsing, formatting and comparison in `src/`:

```json
"dependencies": {
    "dayjs": "^1.11.23",
    "naive-icons": "^1.6.0"
}
```

- **Bundled, not external.** Unlike the peer packages, `dayjs` is deliberately left out
  of the `external` list in `vite.config.ts`. It is emitted once as
  `dist/es/node_modules/dayjs/dayjs.min.js` (+ its CJS twin) and shared by every
  component in this package that imports it, so a consumer gets the date layer with no
  separate install step. This does **not** guarantee a single instance process-wide: a
  host application that imports its own `dayjs` can load an independent copy, and the
  two do not share locale state or plugin registration. `preserveModules` still drops
  the bundled copy entirely for consumers who import no date component.
- **Plugins are registered where they are used.** `dayjs.extend(customParseFormat)` sits
  at the top of the module that needs it. `customParseFormat` is required to parse
  `value` / `defaultValue` in strict mode, which is what turns an impossible date such as
  `2026-02-30` into a rejected value instead of a silent roll-over to March 2.
- **Locale stays untouched.** The library never calls `dayjs.locale(...)`. Setting a
  locale is process-wide state that belongs to the host application, and mutating it from
  inside a component would change how the consumer's own dayjs code behaves.
- **Wall-clock values stay out of it.** `TimePicker` holds a `{ h, m, s }` wall-clock
  value and `Time` renders the current wall clock. Neither does date arithmetic, and
  neither imports dayjs: attaching a calendar date to a bare time is what creates
  daylight-saving bugs, not what fixes them.

A further runtime dependency still requires its own record. This one is deliberately
narrow: it licenses a date library, not a general loosening of the rule.

## Consequences

- The zero-transitive-dependency property survives: `dayjs` declares no dependencies of
  its own, so installing the library still adds exactly one package.
- The package grows by roughly 3 kB gzipped for consumers who import `DatePicker`,
  `Countdown`, or any future date component, and by nothing for consumers who do not.
- Date behaviour becomes consistent and reviewable — one library's semantics instead of
  four private implementations — and the calendar component can be built on a base that
  already understands weeks, months and locales.
- `dayjs`'s locale registry is mutable state **inside the bundled module instance**; it
  is not shared with a host application's independently imported `dayjs`. The library
  never calls `dayjs.locale()`, which keeps the bundled instance deterministic (its
  default `en`) — and means a host-level `dayjs.locale(...)` call does not change
  locale-sensitive `DatePicker` output such as `ddd`. A future component that needs a
  locale must take it as a prop and format through a local instance instead of reaching
  for global state.
- Date formatting in `DatePicker` follows **core** dayjs tokens. The previously documented
  subset (`YYYY` / `MM` / `DD` / `M` / `D`) still renders identically; further core tokens
  such as `HH` / `mm` / `ss` / `ddd` now interpolate instead of passing through as literal
  text. Plugin-owned tokens are the exception: they do not expand, and they do not fail
  loudly either — `Q` renders as the letter `Q` and `Do` as `10o` until `advancedFormat`
  is registered, and `L` / `LT` stay literal without `localizedFormat`. The documented
  token set must therefore not be described as "any dayjs token".

## Related

- Supersedes the "no further runtime dependency" clause of
  [ADR 0001](0001-zero-runtime-dependencies.md).
- The externals list this decision deliberately does not change is part of
  [ADR 0003](0003-vite-library-mode-build.md).
