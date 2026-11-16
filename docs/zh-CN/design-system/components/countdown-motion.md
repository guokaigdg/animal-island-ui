# Countdown 抖动

源码：`src/components/Countdown/Countdown.tsx`、`motion.ts` 和 `countdown.module.less`。基础布局、数字滚动与颜色提醒仍见 [feedback.md](feedback.md)。包含默认值的完整嵌套声明见[公开抖动参考](https://github.com/guokaigdg/animal-island-ui/blob/main/skills/animal-island-ui-style/references/components/countdown-motion.md)。

# 配置

| 属性 | 约定 |
| --- | --- |
| `shake` | 布尔值、秒数或 `CountdownShakeOptions`：起始/加强阈值、普通/加强周期、位移、旋转和 CSS 缓动。 |

`shake` 默认关闭。传 `true` 时在最后 5 秒开始抖动、最后 3 秒加强；传数字时把起始阈值设为该秒数；传对象可逐项覆盖。阈值使用向上取整后的显示秒数，不会提前触发。非正的 `seconds` 关闭抖动，`urgentSeconds: 0` 关闭加强阶段。非有限数使用默认值；非负参数的负值钳制到零，旋转限制为 0–360，周期最小 16ms，数值上限 60000。CSS 缓动字符串支持变量，空字符串回退到默认令牌。

# 默认时序

| 阶段 | 默认值与可配置项 |
| --- | --- |
| 普通 | 最后 5 秒：1000ms 周期、水平位移 ±1.5px、旋转 ±0.6°。 |
| 加强 | 最后 3 秒：650ms 周期、水平位移 ±2.5px、旋转 ±0.9°。 |
| 节奏 | 抖动集中在每个周期的前 30%，剩余 70% 数字组回到静止。 |
| 缓动 | `var(--animal-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))`，可配置。 |

动画只作用于内部数字组。前缀、面板和周围布局保持不动，滚动数字条保留自身的纵向位移。

# 状态与生命周期

当向上取整后的剩余秒数大于零且不超过 `seconds` 时抖动生效；不超过 `urgentSeconds` 时进入加强阶段。离屏和页面隐藏时暂停 CSS 动画，恢复后接着播放，不补播错过的周期；真实截止时间继续准确推进。重置截止时间或关闭属性会立即移除效果。

# 减少动态效果

`prefers-reduced-motion: reduce` 下完全移除抖动：倒计时保留颜色与滚动数字，但不再运动。任何选项都不会覆盖系统设置。

# 示例

```tsx
<Countdown value={deadline} reminder shake />
<Countdown value={deadline} reminder shake={8} />
<Countdown
    value={deadline}
    reminder={[{ seconds: 30, color: '#c77c34' }, { seconds: 8, color: '#e05a5a' }]}
    shake={{ seconds: 8, urgentSeconds: 3, duration: 1000, urgentDuration: 650, distance: 1.5, urgentDistance: 2.5 }}
/>
```
