// 全局样式
import './styles/index.less';

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

export { Drawer } from './components/Drawer';
export type { DrawerProps, DrawerPlacement } from './components/Drawer';

export { Card } from './components/Card';
export type { CardProps, CardType, CardColor } from './components/Card';

export { Footer } from './components/Footer';
export type { FooterProps } from './components/Footer';

export { Collapse } from './components/Collapse';
export type { CollapseProps } from './components/Collapse';

export { Cursor } from './components/Cursor';
export type { CursorProps, CursorType } from './components/Cursor';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Background } from './components/Background';
export type { BackgroundProps, BackgroundType } from './components/Background';

export { Typewriter } from './components/Typewriter';
export type { TypewriterProps } from './components/Typewriter';

export { Icon, ICON_LIST } from './components/Icon';
export type { IconProps, IconName } from './components/Icon';
// 内置可爱图标（101 个）：import { HeartIcon } from 'animal-island-ui' 或 <Icon name="Heart" />
export {
    AirplaneIcon,
    AnchorIcon,
    AppleIcon,
    BalloonIcon,
    BearIcon,
    BeeIcon,
    BellIcon,
    BicycleIcon,
    BirdIcon,
    BookIcon,
    BookmarkIcon,
    BulbIcon,
    ButterflyIcon,
    CactusIcon,
    CakeIcon,
    CalendarIcon,
    CameraIcon,
    CandleIcon,
    CarIcon,
    CartIcon,
    CatIcon,
    ChatIcon,
    CheckIcon,
    CherryIcon,
    ClockIcon,
    CloseIcon,
    CloudIcon,
    CodeIcon,
    CoffeeIcon,
    CompassIcon,
    CreditCardIcon,
    DogIcon,
    DonutIcon,
    DownloadIcon,
    EditIcon,
    EyeIcon,
    FileIcon,
    FishIcon,
    FlagIcon,
    FlameIcon,
    FlowerIcon,
    FolderIcon,
    FoxIcon,
    FrogIcon,
    GiftIcon,
    GlobeIcon,
    HeadphonesIcon,
    HeartIcon,
    HomeIcon,
    IcecreamIcon,
    ImageIcon,
    KeyIcon,
    LadybugIcon,
    LampIcon,
    LeafIcon,
    LemonIcon,
    LocationIcon,
    LockIcon,
    MagnetIcon,
    MailIcon,
    MapIcon,
    MicIcon,
    MoonIcon,
    MushroomIcon,
    MusicIcon,
    OwlIcon,
    PaintbrushIcon,
    PencilIcon,
    PenguinIcon,
    PhoneIcon,
    PlayIcon,
    PlusIcon,
    RabbitIcon,
    RainbowIcon,
    RefreshIcon,
    RocketIcon,
    SailboatIcon,
    SaveIcon,
    SearchIcon,
    SettingsIcon,
    ShareIcon,
    ShoppingBagIcon,
    SmileIcon,
    SnailIcon,
    SnowflakeIcon,
    StarIcon,
    StrawberryIcon,
    SunIcon,
    TagIcon,
    ThermometerIcon,
    ThumbsUpIcon,
    TrainIcon,
    TrashIcon,
    TreeIcon,
    TrophyIcon,
    UmbrellaIcon,
    UploadIcon,
    UserIcon,
    VideoIcon,
    WatermelonIcon,
    WifiIcon,
} from './components/Icon/src';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps, DatePickerSize, DatePickerStatus, DatePickerValue } from './components/DatePicker';

export { TimePicker } from './components/TimePicker';
export type { TimePickerProps, TimePickerSize, TimePickerStatus, TimePart } from './components/TimePicker';

export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxOption, CheckboxSize } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps, RadioOption, RadioSize } from './components/Radio';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipPlacement, TooltipTrigger, TooltipVariant } from './components/Tooltip';

export { Form, FormItem, useForm } from './components/Form';
export type {
    ColProps,
    FieldData,
    FormInstance,
    FormItemLayout,
    FormItemProps,
    FormLabelAlign,
    FormLayout,
    FormProps,
    FormSize,
    NamePath,
    RequiredMark,
    RuleObject,
    RuleRender,
    RuleType,
    Rules,
    ScrollOptions,
    ValidateError,
    ValidateInfo,
    ValidateStatus,
} from './components/Form';

export { Title } from './components/Title';
export type { TitleProps, TitleSize, TitleColor } from './components/Title';

export { CodeBlock } from './components/CodeBlock';
export type { CodeBlockProps } from './components/CodeBlock';

export { Table } from './components/Table';
export type { TableProps, TableColumn } from './components/Table';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { Tag } from './components/Tag';
export type { TagProps, TagSize, TagVariant, TagColor } from './components/Tag';

export {
    Notification,
    notificationOpen,
    notificationDestroy,
    NOTIFICATION_DEFAULT_DURATION,
} from './components/Notification';
export type {
    NotificationStatic,
    NotificationConfig,
    NotificationType,
    NotificationPosition,
    NotificationPlacement,
    NotificationItem,
} from './components/Notification';

export { Progress } from './components/Progress';
export type { ProgressProps, ProgressSize, ProgressInfoPosition } from './components/Progress';

export { Loading } from './components/Loading';
export type { LoadingProps } from './components/Loading';

// ============================================
// 新增组件
// ============================================
export { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './components/Skeleton';
export type {
    SkeletonProps,
    SkeletonVariant,
    SkeletonButtonProps,
    SkeletonInputProps,
    SkeletonAvatarProps,
} from './components/Skeleton';

export { BackTop } from './components/BackTop';
export type { BackTopProps } from './components/BackTop';

export { Image } from './components/Image';
export type { ImageProps, ImageColor } from './components/Image';

export { Countdown } from './components/Countdown';
export type { CountdownProps, CountdownSize, CountdownVariant } from './components/Countdown';

export { Time } from './components/Time';
export type { TimeProps } from './components/Time';

export { Carousel } from './components/Carousel';
export type { CarouselProps } from './components/Carousel';
