# Calendar — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Calendar

```ts
type CalendarColor = 'teal' | 'amber' | 'coral' | 'green' | 'purple';

interface CalendarEvent {
    title: React.ReactNode;
    start: string | Dayjs;          // YYYY-MM-DD, or a dayjs object (its HH:mm shows when showTime)
    end?: string | Dayjs;           // omit for a single day; set it for a continuous multi-day bar
    color?: CalendarColor;          // default 'teal'
    showTime?: boolean;             // default false — shows the start HH:mm on the first slice
}

interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    width?: number | string;        // default: fill the parent; numbers are px and also drive the scale
    value?: string;                 // controlled selected date, YYYY-MM-DD
    defaultValue?: string;          // uncontrolled; defaults to today
    panelValue?: string;            // controlled visible month; pair it with onPanelChange or the panel cannot flip
    defaultPanelValue?: string;     // uncontrolled visible month
    onChange?: (date: string) => void;
    onPanelChange?: (month: string) => void;   // 'YYYY-MM' — required to write back when panelValue is controlled
    events?: CalendarEvent[];       // default []
    showEventTime?: boolean;        // default true — HH:mm prefix, shown once on an event's first slice
    draggableEvents?: boolean;      // default false — drag across days to create an event
    onEventCreate?: (start: string, end: string) => void;
    'aria-label'?: string; 'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Calendar
    width={900}
    value={date}
    onChange={setDate}
    events={[
        { title: '周会', start: '2026-08-10 09:30', showTime: true },
        { title: '海岛团建', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
    ]}
    onEventCreate={(start, end) => console.log(start, end)}
    draggableEvents
/>
```

Standalone month calendar (no popup, month panel only — no week/year modes). The panel is a permanent cream card in the
DatePicker visual language, with DatePicker's teal selection accent: 6×7 always-full date grid, month/year navigation, optional `今天`. Events render as bars in a
bar band anchored under each week's date numbers (two rows per week); a multi-day event is cut at week boundaries (never
wraps), its first slice carries the `HH:mm` prefix, and a third same-day event folds into `+N` on the day cell. Events
entirely outside the 42-day grid are neither rendered nor counted. `value` is a plain `YYYY-MM-DD` string and the
date arithmetic runs on dayjs (see [ADR 0005](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/adr/0005-dayjs-as-the-date-layer.md)).
`width` defaults to filling the parent; the baseline rhythm is tuned to a 750px panel (antd's full calendar card).
There is no size prop: the panel measures its own box and derives the rhythm from it
(`--animal-calendar-scale` = width / 750, clamped to 0.6…2), so a wider panel gets taller rows and larger type.
Cells are `role="gridcell"` with the roving tabindex: arrows move the cursor (crossing a month boundary flips the panel),
Enter/Space selects, PageUp/PageDown flip months, and `draggableEvents` adds click-and-drag creation via `onEventCreate`.
