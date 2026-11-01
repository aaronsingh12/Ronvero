import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, HeartIcon, UserIcon, BagIcon, MenuIcon } from '../ui/Icons.jsx';
import { BRAND_NAME } from '../../utils/constants.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useCartStore } from '../../store/useCartStore.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useCategoriesStore } from '../../store/useCategoriesStore.js';
import { cn } from '../../utils/cn.js';

export default function Navbar() {
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const openWishlist = useUIStore((s) => s.openWishlist);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);

  const categories = useCategoriesStore((s) => s.categories);
  const loadCategories = useCategoriesStore((s) => s.load);

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const user = useAuthStore((s) => s.user);
  const accountPath = user?.role === 'admin' ? '/admin' : user ? '/account' : '/login';
  const accountLabel = user?.role === 'admin' ? 'Admin' : user ? 'Account' : 'Log in';

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Nav is driven by the real catalog categories (+ a "Shop all" entry).
  const navItems = [
    { label: 'Shop all', to: '/shop' },
    ...categories.map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })),
  ];

  return (
    <header className={cn('sticky top-0 z-40 glass shadow-soft transition-colors duration-500')}>
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-5 py-4 md:px-8">
        <button type="button" onClick={toggleMobileMenu} className="p-1 md:hidden" aria-label="Open menu">
          <MenuIcon className="text-char" />
        </button>

        <Link to="/" className="font-display text-xl font-bold tracking-tightest text-char transition-colors">
          {BRAND_NAME}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="trace-underline font-body text-sm font-medium text-char transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button type="button" onClick={openSearch} aria-label="Search" className="text-char transition-colors">
            <SearchIcon size={19} />
          </button>
          <Link
            to={accountPath}
            aria-label={accountLabel}
            className="hidden items-center gap-1.5 rounded-full border border-graphite/15 px-3 py-1.5 font-mono text-xs text-char transition-colors sm:inline-flex"
          >
            <UserIcon size={16} />
            <span>{accountLabel}</span>
          </Link>
          <button
            type="button"
            onClick={openWishlist}
            aria-label="Wishlist"
            className="relative text-char transition-colors"
          >
            <HeartIcon size={19} />
            {wishlistCount > 0 && <CountBubble count={wishlistCount} />}
          </button>
          <button type="button" onClick={openCart} aria-label="Cart" className="relative text-char transition-colors">
            <BagIcon size={19} />
            {itemCount > 0 && <CountBubble count={itemCount} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

function CountBubble({ count }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ember font-mono text-[9px] text-chalk"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}
