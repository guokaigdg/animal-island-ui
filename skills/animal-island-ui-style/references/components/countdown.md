# Countdown

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownReminderRule { seconds: number; color: string }
interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date; // REQUIRED — absolute deadline
    format?: string; // default 'HH:mm:ss'; DD / HH / mm / ss tokens
    prefix?: React.ReactNode;
    size?: CountdownSize; // default 'middle'
    variant?: CountdownVariant; // default 'default'
    bordered?: boolean; // default false — draws the 1.5px digit-tile borders
    reminder?: boolean | readonly CountdownReminderRule[]; // default false
    shake?: boolean | number | CountdownShakeOptions; // default false
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

`shake` accepts its original boolean/number shortcuts or a `CountdownShakeOptions` object. See [countdown-motion.md](countdown-motion.md) for all nested declarations, defaults, validation and reduced-motion behavior.

```tsx
<Countdown value={deadline} reminder shake />
<Countdown value={deadline} reminder shake={8} />
<Countdown value={deadline} reminder shake={false} />
<Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="活动结束还有" variant="island" />
```

The remaining time never drops below zero and `onFinish` fires once. Without a `DD` token, `HH` is total hours; with `DD`, hours are the 0–23 remainder. Each DD / HH / mm / ss token renders as its own 12px-radius digit tile; every digit inside is a vertical strip of two 0-9 cycles that always rolls downward to the current value with a 0.35s transition (odometer style — wrapping past 0 teleports to the next cycle and keeps rolling down, never reversing). Format literals such as `:` or `天` render as plain separators. The rolling strips are `aria-hidden`; a visually-hidden span carries the full formatted value. The root is `role="timer"` with `aria-live="off"`. `reminder` defaults to false. Set it to true for warm orange `#c77c34` at ≤60 seconds and the error token `var(--animal-error-color, #e05a5a)` at ≤10 seconds. An array of `{ seconds, color }` fully replaces these defaults; CSS colors and variables are accepted. Rules compare the ceiling-rounded displayed seconds: the smallest matching threshold wins regardless of order, with the first entry winning ties. Negative/non-finite thresholds and empty colors are ignored; an empty array disables reminders. Only digits, separators and enabled digit-tile borders change color (0.2s color transition); the prefix and panel retain their styling. Zero retains the matching reminder color; resetting outside all thresholds or disabling reminders restores the original color without changing timing or callbacks.

`shake` does not change timing or callbacks. It animates only the inner digit group, so the prefix, panel and layout stay still. Shaking pauses offscreen or in hidden tabs and is removed under reduced motion; resetting or disabling cleans up the effect.

The countdown demo includes separate color-reminder and shaking examples with live values and copyable props.

# Object configuration example

```tsx
<Countdown
    value={deadline}
    reminder={[{ seconds: 30, color: '#c77c34' }, { seconds: 8, color: '#e05a5a' }]}
    shake={{ seconds: 8, urgentSeconds: 3, duration: 1000, urgentDuration: 650, distance: 1.5, urgentDistance: 2.5 }}
/>
```
