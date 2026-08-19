# Design System

This directory is the single source of truth for the animal-island-ui design language. The component library source code is its implementation; every other usage document is a derived summary of what is written here.

## Design language

animal-island-ui is a React + TypeScript UI component library inspired by *a cozy island-style UI*.

The core of the design language: **warm earth-tone palette + large-radius pill shapes + game-button 3D depth + soft motion + geometric and organic shapes coexisting**. Geometric examples: the swallowtail clip-path of the Title ribbon, the olive-yellow capsule of Wallet. Organic example: the SVG blob of Modal.

- Source: `src/components/<ComponentName>/`
- Demo site: `demo/`
- Build: Vite (library mode), `vite.config.ts` for the library and `vite.config.demo.ts` for the demo
- Style system: Less Modules + design tokens in `src/styles/variables.less`

## Full export inventory

35 components plus 3 companion exports (`FormItem` / `useForm` / `ICON_LIST`), all exported from `src/index.ts`:

| Component      | Responsibility                                                                                                                                                                                    | Interactive | Decorative / display-only |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------- |
| `Button`       | Button, 5 types × 3 sizes                                                                                                                                                                           | ✓           |                           |
| `Input`        | Text input, 3 sizes + clear/prefix/suffix                                                                                                                                                           | ✓           |                           |
| `Switch`       | Toggle, default/small                                                                                                                                                                               | ✓           |                           |
| `Modal`        | Dialog clipped by an SVG blob                                                                                                                                                                       | ✓           |                           |
| `Drawer`       | Depth-of-field drawer (background sinks, scales down and dims; left/right/top/bottom)                                                                                                               | ✓           |                           |
| `Card`         | Container, `default`/`dashed`, 13 IslandPhone solid colors + 13 `pattern` polka-dot wallpapers (CSS radial-gradient, not images)                                                                       |             | ✓                         |
| `Title`        | Section heading, ribbon banner (swallowtail clip-path + fold shadow + slight front-face perspective), 13 color schemes (replaces the removed `Card type="title"`)                                    |             | ✓                         |
| `Collapse`     | Accordion (animated with CSS Grid 0fr↔1fr, no JS animation)                                                                                                                                         | ✓           |                           |
| `Select`       | Dropdown selector (controlled)                                                                                                                                                                      | ✓           |                           |
| `DatePicker`   | Calendar date selector: date/month/year panels, controlled or uncontrolled, `disabledDate`, `allowClear`, keyboard navigation, start/end range mode (two linked panels)                                                                                                                                      | ✓           |                           |
| `TimePicker`   | Time selector: hour/minute/second scroll columns, `此刻` / `确定` footer, `hourStep` / `minuteStep` / `secondStep`, custom `format`                                                                                                                                                                          | ✓           |                           |
| `Checkbox`     | Checkbox group, horizontal/vertical, 3 sizes                                                                                                                                                        | ✓           |                           |
| `Radio`        | Radio group, 3 sizes, keyboard roving tabindex                                                                                                                                                      | ✓           |                           |
| `Tooltip`      | 12 placements, `hover`/`focus`/`click` triggers, `default`/`island` shapes                                                                                                                          | ✓           |                           |
| `Icon`         | SVG icon set (10 icons)                                                                                                                                                                             |             | ✓                         |
| `Time`         | HUD live clock                                                                                                                                                                                      |             | ✓                         |
| `Phone`        | IslandPhone 3×3 app grid                                                                                                                                                                              |             | ✓                         |
| `Footer`       | Decorative footer artwork (`sea`/`tree`)                                                                                                                                                            |             | ✓                         |
| `Divider`      | Decorative divider, 5 styles                                                                                                                                                                        |             | ✓                         |
| `Cursor`       | Game finger-cursor wrapper                                                                                                                                                                          |             | ✓                         |
| `Typewriter`   | Typewriter effect, preserves the ReactNode structure                                                                                                                                                |             | ✓                         |
| `Tabs`         | Tab switching, optional leaf-sway animation                                                                                                                                                         | ✓           |                           |
| `CodeBlock`    | JSX/TS syntax-highlighted code block                                                                                                                                                                |             | ✓                         |
| `Loading`      | Full-screen mask + SVG spinner (mint `#19c8b9`, `stroke-dasharray` animation)                                                                                                                       |             | ✓                         |
| `Table`        | Data table, fixed columns, empty state, loading                                                                                                                                                     | ✓           |                           |
| `Form`         | Form container + validation (ships the `FormItem` / `useForm` companion exports, API modeled on mainstream form libraries)                                                                           | ✓           |                           |
| `Wallet`       | island-themed bell-bag amount capsule (olive-yellow pill + Island bag icon, 3 sizes, automatic thousands separators)                                                                                 |             | ✓                         |
| `Tag`          | Capsule tag, 3 sizes × 3 variants (solid/outlined/dashed) × 12 colors (fully aligned with the Card palette), supports closable / onClick / disabled                                                  | ✓           |                           |
| `Notification` | Imperative global notifications (antd-style): 4 types × 6 positions, supports description / btn / onClick / key reuse for in-place updates / destroy all                                             | ✓           |                           |
| `Progress`     | Diagonal-stripe scrolling progress bar: the fill reuses the -45° stripes of Button loading (`#0ec4b6`/`#01b0a7`) + 1s infinite scroll, 3 sizes, supports inside/right/top text positions, custom infoFormat, and duration to control the fill-width animation |             | ✓                         |
| `Skeleton`     | Loading placeholder, 4 variants (`text`/`circle`/`rect`/`paragraph`) plus the `SkeletonButton` / `SkeletonInput` / `SkeletonAvatar` sub-components, warm-white shimmer sweep                          |             | ✓                         |
| `BackTop`      | Fixed bottom-right back-to-top button (Island bag artwork, easeInOutQuad smooth scroll)                                                                                                                | ✓           |                           |
| `Image`        | Mat-frame image with lazy loading, error fallback and click-to-preview lightbox                                                                                                                      | ✓           |                           |
| `Countdown`    | Live deadline countdown with configurable DD/HH/mm/ss formatting, three sizes and two visual variants                                                                                               |             | ✓                         |
| `Carousel`     | Controlled/uncontrolled carousel with autoplay, looping, arrows, dots and keyboard navigation                                                                                                        | ✓           |                           |

Type exports: `ButtonProps/ButtonType/ButtonSize`, `InputProps/InputSize`, `SwitchProps/SwitchSize`, `ModalProps`, `DrawerProps/DrawerPlacement`, `CardProps/CardType/CardColor`, `TitleProps/TitleSize/TitleColor`, `FooterProps/FooterType`, `CollapseProps`, `CursorProps`, `TimeProps/TimeType`, `PhoneProps`, `DividerProps`, `TypewriterProps`, `SelectProps/SelectOption`, `DatePickerProps/DatePickerSize/DatePickerStatus/DatePickerValue`, `TimePickerProps/TimePickerSize/TimePickerStatus/TimePart`, `IconProps/IconName`, `TabsProps/TabItem`, `CheckboxProps/CheckboxOption/CheckboxSize`, `RadioProps/RadioOption/RadioSize`, `TooltipProps/TooltipPlacement/TooltipTrigger/TooltipVariant`, `CodeBlockProps`, `LoadingProps`, `TableProps/TableColumn`, `FormProps/FormItemProps/FormInstance/FormLayout/FormItemLayout/FormSize/FormLabelAlign/ColProps/NamePath/RequiredMark/RuleObject/RuleRender/RuleType/Rules/FieldData/ValidateStatus/ValidateError/ValidateInfo/ScrollOptions`, `WalletProps/WalletSize`, `TagProps/TagSize/TagVariant/TagColor`, `NotificationConfig/NotificationType/NotificationPosition/NotificationPlacement/NotificationItem/NotificationStatic`, `ProgressProps/ProgressSize/ProgressInfoPosition`, `SkeletonProps/SkeletonVariant/SkeletonButtonProps/SkeletonInputProps/SkeletonAvatarProps`, `BackTopProps`, `ImageProps/ImageColor`, `CountdownProps/CountdownSize/CountdownVariant`, `CarouselProps`.

Runtime values: `Notification`, `notificationOpen`, `notificationDestroy`, `NOTIFICATION_DEFAULT_DURATION`, `ICON_LIST`. Companion exports: `FormItem`, `useForm` (the default `Form` export also supports the `Form.Item` / `Form.useForm` spelling).

## Files in this directory

- [design-tokens.md](./design-tokens.md) — colors, typography, spacing, radius, borders, shadows and motion, with exact values.
- [design-rules.md](./design-rules.md) — the seven design laws, the fourteen visual hard rules, and the ❌/✅ anti-pattern quick reference.
- [css-variables.md](./css-variables.md) — the complete `:root` variable template for re-implementing the style without the library.
- [components/](./components/) — per-component pixel-level specs.
- [demo-site.md](./demo-site.md) — layout specs for the demo and documentation site (not part of the shipped library).
