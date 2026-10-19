# ADR 0006: Formattable, Localized Date Capsule in Time

## Status

Accepted — supersedes the "`Time` … neither imports dayjs" clause of
[ADR 0005](0005-dayjs-as-the-date-layer.md). The rest of that record stands.

## Context

`Time` renders the current wall clock as `HH:MM` plus a date capsule below it. The
capsule's weekday and month-day were built from two hard-coded English arrays
(`Sunday…` and `Jan…`), so the component could only ever display `MONDAY · Jun 8`: a
Chinese UI had no way to use it, and no caller could reshape the date at all.

Changing this runs into a constraint ADR 0005 established. `dayjs` is bundled into this
package, so its locale registry is independent of a host application's copy: a host that
imports `dayjs/locale/zh-cn` and calls `dayjs.locale('zh-cn')` cannot reach the instance
`Time` sees. A locale therefore has to arrive as a prop, and its data has to ship with
the component.

## Decision

- **Two format props, not one.** `weekdayFormat` (default `dddd`) and `dateFormat`
  (default `MMM D`) accept dayjs **core** tokens. The capsule styles the weekday
  (primary color, 800 weight) and the month-day (secondary, 700 weight) as separate
  spans, so a single whole-line `format` would lose that hierarchy. Plugin-owned tokens
  do not expand — the same contract as `DatePicker`.
- **A `locale` prop typed as a closed union.** `TimeLocale` is `'en' | 'zh-cn'`, not
  `string`, because the data for a locale must be present in the bundle for the prop to
  mean anything. `zh-cn` ships inside the component module, and under it `dateFormat`
  defaults to `M月D日` so the common case needs one prop.
- **The locale is imported as a binding, not for its side effect.**
  `src/components/Time` imports the `zh-cn` locale object and passes it to the per-instance
  `.locale(...)`. The package declares `sideEffects: false`, so a bare
  `import 'dayjs/locale/zh-cn'` is a module a consumer's bundler may drop; a value that
  is read in the component cannot be dropped.
- **No global locale.** Formatting runs on a clone (`dayjs(now).locale(zhCn)`); the
  library never calls `dayjs.locale()` to switch the active locale, so a host
  application's own dayjs behaviour is untouched.
- **The clock stays `Date`-based.** `HH:MM` is still read from `Date` and split around
  the blinking colon; only the date capsule goes through dayjs.

## Consequences

- `Time` now imports dayjs, so consumers who import the component pull dayjs (about
  3 kB gzipped) and the `zh-cn` locale data (about 1 kB gzipped).
  `preserveModules` keeps both out of bundles that never import `Time`.
- The date-capsule order stays weekday · month-day because that is the component's
  visual identity. A caller who needs a different order or a fully custom line needs a
  code change, not a prop.
- `locale="zh-cn"` works with no setup for this package's dayjs instance, while a host
  application's dayjs keeps its own locale; the two are independent by design.
- `Time` now honours the same core-token contract as `DatePicker`, including its
  inability to expand plugin-owned tokens.

## Related

- Supersedes the "`Time` … neither imports dayjs" clause of
  [ADR 0005](0005-dayjs-as-the-date-layer.md); its TimePicker and locale decisions
  remain in force.
- dayjs bundling and externals: [ADR 0003](0003-vite-library-mode-build.md).
