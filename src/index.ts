// 全局样式
import './styles/index.less';


// Nunito（latin subset only）
import '@fontsource/nunito/latin-500.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-900.css';

// Noto Sans SC（中文简体，圆润方正，兜底覆盖）
import '@fontsource/noto-sans-sc/latin-400.css';
import '@fontsource/noto-sans-sc/latin-500.css';
import '@fontsource/noto-sans-sc/latin-700.css';
import '@fontsource/noto-sans-sc/chinese-simplified-400.css';
import '@fontsource/noto-sans-sc/chinese-simplified-500.css';
import '@fontsource/noto-sans-sc/chinese-simplified-700.css';

// Zen Maru Gothic（latin + japanese subset，japanese 覆盖假名 + JIS 汉字）
import '@fontsource/zen-maru-gothic/latin-500.css';
import '@fontsource/zen-maru-gothic/latin-700.css';
import '@fontsource/zen-maru-gothic/latin-900.css';
import '@fontsource/zen-maru-gothic/japanese-500.css';
import '@fontsource/zen-maru-gothic/japanese-700.css';
import '@fontsource/zen-maru-gothic/japanese-900.css';

// ============================================
// 基础 UI 组件
// ============================================
export { Button } from './components/Button';
export type { ButtonProps, ButtonType, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps, InputSize } from './components/Input';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Card } from './components/Card';
export type { CardProps, CardType, CardColor } from './components/Card';

export { Footer } from './components/Footer';
export type { FooterProps, FooterType } from './components/Footer';

export { Collapse } from './components/Collapse';
export type { CollapseProps } from './components/Collapse';

export { Cursor } from './components/Cursor';
export type { CursorProps } from './components/Cursor';

export { Time } from './components/Time';
export type { TimeProps } from './components/Time';

export { Phone } from './components/Phone';
export type { PhoneProps } from './components/Phone';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Typewriter } from './components/Typewriter';
export type { TypewriterProps } from './components/Typewriter';

export { Icon, ICON_LIST } from './components/Icon';
export type { IconProps, IconName } from './components/Icon';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';
