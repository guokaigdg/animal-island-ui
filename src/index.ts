// 全局样式
import './styles/index.less';

// 字体
import '@fontsource/nunito';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/900.css';
import '@fontsource/zen-maru-gothic';
import '@fontsource/zen-maru-gothic/500.css';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/zen-maru-gothic/900.css';
import '@fontsource/m-plus-rounded-1c';
import '@fontsource/m-plus-rounded-1c/500.css';
import '@fontsource/m-plus-rounded-1c/700.css';
import '@fontsource/m-plus-rounded-1c/900.css';

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
