# NoData

Source: `src/components/NoData/`. Reusable empty-content presentation, using the library font, earth-brown text, cream surfaces and `naive-icons`. No requests, timers or runtime dependencies are added.

# Variants and anatomy

`default` uses NoDataIcon, an open brown cardboard box with a deep-blue inner wall and a cream label, directly from naive-icons. `search` uses SearchIcon with its original teal lens, white center and ink handle; its default title is “没有找到相关结果”. `simple` uses a smaller NoDataIcon. The other variants default to “暂无数据”. Icons retain their original 48×48 geometry, proportional 3.5-unit rounded ink strokes and solid palette; no badge, background shape, rotation, recoloring or shadow is added. All artwork is hidden from assistive technology.

Content order is artwork, title, optional description and optional action area. Undefined title/icon uses the defaults; null/false hides it. Extra content takes precedence over children. The bordered option adds a 1.5px dashed sand outline, 20px radius and themed `var(--animal-bg-color, #faf8f1)` background; it defaults off so empty states can sit inside existing cards.

# Visual specification

| Part | Specification |
| --- | --- |
| Small | 18px × 12px padding; 64 × 64px icon area; 14px title, 12px description; 14px artwork/action gaps, 5px description gap. |
| Medium | 32px × 24px padding; 96 × 96px icon area; 16px title, 13px description; 22px artwork/action gaps, 8px description gap. |
| Large | 40px × 24px padding; 120 × 120px icon area; 18px title, 14px description; 26px artwork gap. |
| Type | Library font; title 700, body inherits 500. Title inherits `--animal-text-color`; description uses `var(--animal-text-color-secondary, #7f6e57)`, line height 1.8 and maximum 32ch; balanced wrapping avoids an isolated final word. |
| Icons | Original NoDataIcon / SearchIcon from naive-icons; the component sets display dimensions only and never overrides SVG fills or strokes. No added framing, gradients or shadows. |
| Simple/custom | Simple and custom artwork use a square 32/52/64px area for small/medium/large. Custom icons keep their own palette and orientation, with no added tile. |
| Actions | Centered flex layout, 12px gap, wraps on narrow containers; reuse existing Button styles and focus states. |
| Motion | Static presentation; no perpetual empty-state motion. |

Artwork stays within its container width. The component does not recolor the icon package’s built-in palette; provide the `icon` slot to choose another icon or pass its supported color props. Native attributes, title/description/icon slots and action precedence remain unchanged.

# Semantics and composition

The root is a native div and accepts native attributes; it does not force a live region for static page content. Consumers may pass role="status" or aria-live when content changes need announcements. The decorative artwork has aria-hidden; title, description and actions remain readable and interactive. Use concise recovery instructions and a real callback in the action slot.

Chart uses the small variant for no data, missing map contours and all-hidden legends; the last state offers a restore-all action. Table retains its existing empty icon, so use icon={null} when placing NoData in its emptyText slot. Existing Table behavior is unchanged.

The independent demo under **反馈 → NoData 空状态** starts with an independent side-by-side box/search preview, followed by the retained defaults, working search reset with a persistent polite live region announcing result counts or no matches, a table creation action, sizes, custom icons and text-only presentation. Props and examples: [NoData reference](https://github.com/guokaigdg/animal-island-ui/blob/main/skills/animal-island-ui-style/references/components/no-data.md).
