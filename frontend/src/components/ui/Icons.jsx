// A small, consistent set of stroke icons used across the site.
// Hand-rolled as inline SVG so we don't need to add an icon package
// beyond the stack the project specifies.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ children, size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} {...props}>
    {children}
  </svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </Svg>
);

export const HeartIcon = ({ filled, ...props }) => (
  <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 21s-7.5-4.87-10.1-9.36C.4 8.7 1.4 5 5 4.2c2.1-.47 3.9.6 5 2.3 1.1-1.7 2.9-2.77 5-2.3 3.6.8 4.6 4.5 3.1 7.44C19.5 16.13 12 21 12 21Z" />
  </Svg>
);

export const BagIcon = (props) => (
  <Svg {...props}>
    <path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const UserIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20.2a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

export const BellIcon = (props) => (
  <Svg {...props}>
    <path d="M18 9a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9" />
    <path d="M10 21h4" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const ChevronDownIcon = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (props) => (
  <Svg {...props}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = (props) => (
  <Svg {...props}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);

export const StarIcon = ({ filled = true, ...props }) => (
  <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 2.8 14.7 8.6 21 9.4l-4.6 4.4 1.1 6.3L12 17l-5.5 3.1 1.1-6.3L3 9.4l6.3-.8L12 2.8Z" />
  </Svg>
);

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <path d="m5 12 5 5L19 7" />
  </Svg>
);

export const TruckIcon = (props) => (
  <Svg {...props}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Svg>
);

export const ShieldIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const RefreshIcon = (props) => (
  <Svg {...props}>
    <path d="M4 12a8 8 0 0 1 14-5.3L21 9" />
    <path d="M21 4v5h-5" />
    <path d="M20 12a8 8 0 0 1-14 5.3L3 15" />
    <path d="M3 20v-5h5" />
  </Svg>
);

export const CameraIcon = (props) => (
  <Svg {...props}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
    <circle cx="12" cy="13" r="3.4" />
  </Svg>
);

export const TrashIcon = (props) => (
  <Svg {...props}>
    <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
  </Svg>
);

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);

export const GridIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </Svg>
);

export const ListIcon = (props) => (
  <Svg {...props}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" />
  </Svg>
);

export const FilterIcon = (props) => (
  <Svg {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);
