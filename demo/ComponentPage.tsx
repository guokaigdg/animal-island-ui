import React from 'react';
import { Title, TitleColor, Typewriter } from '../src';
import FooterDemo from './components/Footer';
import IconDemo from './components/Icon/IconDemo';
import TabsDemo from './components/Tabs';
import CheckboxDemo from './components/Checkbox';
import RadioDemo from './components/Radio';
import TooltipDemo from './components/Tooltip';
import TitleDemo from './components/Title';
import CodeBlockDemo from './components/CodeBlock';
import LoadingDemo from './components/Loading/LoadingDemo';
import TableDemo from './components/Table/TableDemo';
import PaginationDemo from './components/Pagination';
import DrawerDemo from './components/Drawer/DrawerDemo';
import FormDemo from './components/Form';
import TagDemo from './components/Tag';
import NotificationDemo from './components/Notification';
import ProgressDemo from './components/Progress';
import SkeletonDemo from './components/Skeleton';
import BackTopDemo from './components/BackTop';
import ImageDemo from './components/Image';
import ButtonDemo from './components/Button';
import InputDemo from './components/Input';
import SwitchDemo from './components/Switch';
import CardDemo from './components/Card';
import CollapseDemo from './components/Collapse';
import CursorDemo from './components/Cursor';
import ModalDemo from './components/Modal';
import TypewriterDemo from './components/Typewriter';
import DividerDemo from './components/Divider';
import SelectDemo from './components/Select';
import DatePickerDemo from './components/DatePicker';
import TimePickerDemo from './components/TimePicker';
import CountdownDemo from './components/Countdown';
import CarouselDemo from './components/Carousel';
import SkillDemo from './components/Skill';
import { PAGE_INFO } from './pageInfo';
const pageDescStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#794f27',
    marginBottom: 20,
};

// ============================================
// Page info & mapping
// ============================================

const PAGES: Record<string, React.FC> = {
    button: ButtonDemo,
    input: InputDemo,
    switch: SwitchDemo,
    card: CardDemo,
    collapse: CollapseDemo,
    cursor: CursorDemo,
    footer: FooterDemo,
    modal: ModalDemo,
    drawer: DrawerDemo,
    typewriter: TypewriterDemo,
    'divider-comp': DividerDemo,
    icon: IconDemo,
    select: SelectDemo,
    'date-picker': DatePickerDemo,
    'time-picker': TimePickerDemo,
    tabs: TabsDemo,
    checkbox: CheckboxDemo,
    radio: RadioDemo,
    tooltip: TooltipDemo,
    title: TitleDemo,
    codeblock: CodeBlockDemo,
    loading: LoadingDemo,
    table: TableDemo,
    pagination: PaginationDemo,
    tag: TagDemo,
    notification: NotificationDemo,
    progress: ProgressDemo,
    form: FormDemo,
    skeleton: SkeletonDemo,
    backtop: BackTopDemo,
    image: ImageDemo,
    countdown: CountdownDemo,
    carousel: CarouselDemo,
    skill: SkillDemo,
};

// ============================================
// ComponentPage
// ============================================
const TITLE_COLORS: TitleColor[] = [
    'lime-green',
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-red',
    'yellow-green',
    'brown',
    'warm-peach-pink',
];

interface ComponentPageProps {
    activeKey: string;
}

const ComponentPage: React.FC<ComponentPageProps> = ({ activeKey }) => {
    const Page = PAGES[activeKey];
    const info = PAGE_INFO[activeKey];

    // 根据 activeKey 固定映射一种颜色，切换页面时变色但同一页面不随机抖动
    const titleColor =
        TITLE_COLORS[Math.abs(activeKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % TITLE_COLORS.length];

    if (!Page || !info) return null;

    return (
        <>
            <Title size="large" color={titleColor} style={{ marginBottom: 30, marginLeft: 18 }}>
                {info.title}
            </Title>
            <div style={{ ...pageDescStyle, minHeight: 40 }}>
                <Typewriter key={activeKey} trigger={activeKey} speed={30}>
                    {info.desc}
                </Typewriter>
            </div>
            <Page />
        </>
    );
};

export default ComponentPage;
