# Countdown shake options

Import `CountdownShakeOptions` from `animal-island-ui`. `shake` accepts the object as well as its original boolean and numeric-seconds shortcuts.

# Declarations

Copied from `src/components/Countdown/motion.ts`; defaults and units are documented on each field.

```ts
/** 抖动提醒的阈值、节奏和幅度，时间单位为毫秒，距离单位为 px，角度单位为度。 */
export interface CountdownShakeOptions {
    /** 开始抖动的剩余秒数，默认 5；非正数关闭 */
    seconds?: number;
    /** 加强阶段的剩余秒数，默认 3；0 关闭加强 */
    urgentSeconds?: number;
    /** 普通阶段周期，默认 1000ms，最小 16ms */
    duration?: number;
    /** 加强阶段周期，默认 650ms，最小 16ms */
    urgentDuration?: number;
    /** 普通阶段水平位移，默认 1.5px */
    distance?: number;
    /** 加强阶段水平位移，默认 2.5px */
    urgentDistance?: number;
    /** 普通阶段旋转角度，默认 0.6 度 */
    rotation?: number;
    /** 加强阶段旋转角度，默认 0.9 度 */
    urgentRotation?: number;
    /** CSS 缓动函数，默认沿用组件库令牌 */
    easing?: string;
}
```

# Timing and composition

- `true` shakes for the last 5 seconds with escalation at 3; a number sets the start threshold to that many seconds; an object overrides individual fields.
- Defaults: 1000ms period, ±1.5px displacement and ±0.6° rotation normally; 650ms, ±2.5px and ±0.9° in the urgent phase. The burst occupies the first 30% of each period, and the digit group rests for the remaining 70%.
- Thresholds use the ceiling-rounded displayed seconds and never start early. A non-positive `seconds` disables shaking; `urgentSeconds: 0` removes escalation.
- The shake animates the inner digit group only. The prefix, panel and surrounding layout stay still, and the rolling digits keep their own vertical transform.
- Shake pauses offscreen or while the document is hidden and resumes without replaying missed cycles; the real deadline continues advancing.
- `prefers-reduced-motion: reduce` removes the shake entirely; no option overrides the system preference.
- Non-finite object values use defaults; negative unsigned values clamp to zero, rotation to 0–360, and periods to at least 16ms. Numeric fields cap at 60000. Numeric `shake={NaN}`/`Infinity` keeps the old disabled behavior. CSS easing strings accept CSS variables; empty strings fall back to defaults.

See [countdown.md](countdown.md) for the component API and [canonical shake specs](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/components/countdown-motion.md) for the visual contract.
