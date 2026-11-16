# Countdown shake

Source: `src/components/Countdown/Countdown.tsx`, `motion.ts` and `countdown.module.less`. Base layout, digit rolling and color reminders remain in [feedback.md](feedback.md). Full nested declarations with defaults are in the [published shake reference](https://github.com/guokaigdg/animal-island-ui/blob/main/skills/animal-island-ui-style/references/components/countdown-motion.md).

# Configuration

| Prop | Contract |
| --- | --- |
| `shake` | Boolean, a number of seconds, or `CountdownShakeOptions`: start/escalation thresholds, normal/urgent period, distance, rotation and CSS easing. |

`shake` defaults to false. `true` starts at 5 seconds with escalation at 3; a number sets the start threshold to that many seconds; an object overrides individual fields. Thresholds use the ceiling-rounded displayed seconds, so the shake never starts early. A non-positive `seconds` disables it, and `urgentSeconds: 0` removes escalation. Non-finite numbers use defaults; negative unsigned values clamp to zero, rotation to 0–360, and periods to at least 16ms. Numeric values cap at 60000. CSS easing strings accept variables; empty strings fall back to the token.

# Default sequence

| Phase | Defaults and configurable properties |
| --- | --- |
| Normal | Last 5 seconds: 1000ms period, ±1.5px horizontal displacement, ±0.6° rotation. |
| Urgent | Last 3 seconds: 650ms period, ±2.5px horizontal displacement, ±0.9° rotation. |
| Burst | The active burst occupies the first 30% of each period; the digit group rests for the remaining 70%. |
| Easing | `var(--animal-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))`, configurable. |

The animation targets the inner digit group only. The prefix, panel and surrounding layout stay still, and the rolling digits keep their own vertical transform.

# State and lifecycle

Shake is active while the ceiling-rounded remaining seconds are above zero and at or below `seconds`; the urgent phase applies at or below `urgentSeconds`. Offscreen and hidden-page loops pause their CSS animation and resume without replaying missed cycles; the absolute countdown remains accurate. Resetting the deadline or disabling the prop removes the effect.

# Reduced motion

`prefers-reduced-motion: reduce` removes the shake entirely: the countdown keeps its colors and rolling digits but stops moving. No option overrides the system preference.

# Example

```tsx
<Countdown value={deadline} reminder shake />
<Countdown value={deadline} reminder shake={8} />
<Countdown
    value={deadline}
    reminder={[{ seconds: 30, color: '#c77c34' }, { seconds: 8, color: '#e05a5a' }]}
    shake={{ seconds: 8, urgentSeconds: 3, duration: 1000, urgentDuration: 650, distance: 1.5, urgentDistance: 2.5 }}
/>
```
