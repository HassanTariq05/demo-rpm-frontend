import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function Svg({ size = 20, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    />
  );
}

export const GridIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect height="7" rx="1.5" width="7" x="3" y="3" />
    <rect height="7" rx="1.5" width="7" x="14" y="3" />
    <rect height="7" rx="1.5" width="7" x="3" y="14" />
    <rect height="7" rx="1.5" width="7" x="14" y="14" />
  </Svg>
);

export const FolderIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
  </Svg>
);

export const CartIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="8.5" cy="19.5" r="1.25" />
    <circle cx="17.5" cy="19.5" r="1.25" />
    <path d="M3 4h2.2l1.8 10.2a1.5 1.5 0 0 0 1.5 1.3h8.8a1.5 1.5 0 0 0 1.5-1.2L20.5 8H7" />
  </Svg>
);

export const MegaphoneIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 10v4a2 2 0 0 0 2 2h1.2L12 20V4L7.2 8H6a2 2 0 0 0-2 2Z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
    <path d="M18 7a7 7 0 0 1 0 10" />
  </Svg>
);

export const ShareIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="6" cy="12" r="2" />
    <circle cx="17" cy="6.5" r="2" />
    <circle cx="17" cy="17.5" r="2" />
    <path d="m7.8 11 7.2-3.4M7.8 13l7.2 3.4" />
  </Svg>
);

export const GavelIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m14 5 5 5" />
    <path d="m12.5 6.5 5 5" />
    <path d="m4 20 8.2-8.2" />
    <path d="m6.5 8.5 5-5 4 4-5 5-4-4Z" />
  </Svg>
);

export const BookIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v16H7.5A2.5 2.5 0 0 0 5 20.5Z" />
    <path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H20" />
  </Svg>
);

export const TruckIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 7h11v8H3V7Z" />
    <path d="M14 10h4.2L21 13.2V15h-7v-5Z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Svg>
);

export const ChartIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M8 16v-4" />
    <path d="M12 16V8" />
    <path d="M16 16v-6" />
  </Svg>
);

export const HeartIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9Z" />
  </Svg>
);

export const DollarIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 3v18" />
    <path d="M16.5 7.2c0-1.6-1.8-2.7-4.5-2.7S7.5 5.6 7.5 7.4 9.4 10 12 10.6s4.5 1.3 4.5 3.2-1.9 3.2-4.5 3.2-4.5-1.1-4.5-2.8" />
  </Svg>
);

export const InfoIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </Svg>
);

export const UsersIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.5 19" />
    <circle cx="17" cy="9" r="2.2" />
    <path d="M16.2 14.6c1.8.4 3.2 1.6 3.8 3.4" />
  </Svg>
);

export const CalendarIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect height="15" rx="2" width="16" x="4" y="5" />
    <path d="M8 3.5V7" />
    <path d="M16 3.5V7" />
    <path d="M4 10h16" />
  </Svg>
);

export const UserLockIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.5-2.6 2.4-4.2 5.5-4.5" />
    <rect height="5.5" rx="1.2" width="7" x="13.5" y="14" />
    <path d="M15.5 14v-1.2a2 2 0 0 1 4 0V14" />
  </Svg>
);

export const MedicalIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect height="16" rx="3" width="16" x="4" y="4" />
    <path d="M12 8.5v7" />
    <path d="M8.5 12h7" />
  </Svg>
);

export const PinIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" />
    <circle cx="12" cy="11" r="2" />
  </Svg>
);

export const FilterIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 5h16l-6.2 7.1V19l-3.6 1.6v-8.5L4 5Z" />
  </Svg>
);

export const BellIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 9.5a6 6 0 1 1 12 0c0 6.2 2 6.5 2 6.5H4s2-.3 2-6.5Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Svg>
);

export const HomeIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m4 11 8-7 8 7" />
    <path d="M6 10.5V20h4.5v-5h3v5H18v-9.5" />
  </Svg>
);

export const CheckIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m5 12 5 5L20 7" />
  </Svg>
);

export const PlusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);

export const FileIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M7 3.5h7.2L19 8.2V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H7Z" />
    <path d="M14 3.5V8h5" />
  </Svg>
);

export const HeadsetIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <path d="M4 13.5V17a2 2 0 0 0 2 2h1.2v-6.5H6a2 2 0 0 0-2 2Z" />
    <path d="M20 13.5V17a2 2 0 0 1-2 2h-1.2v-6.5H18a2 2 0 0 1 2 2Z" />
  </Svg>
);

export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </Svg>
);

export const navIcons = {
  grid: GridIcon,
  folder: FolderIcon,
  cart: CartIcon,
  megaphone: MegaphoneIcon,
  share: ShareIcon,
  gavel: GavelIcon,
  book: BookIcon,
  truck: TruckIcon,
  chart: ChartIcon,
  heart: HeartIcon,
  dollar: DollarIcon,
  info: InfoIcon,
  users: UsersIcon,
  medical: MedicalIcon,
} as const;
