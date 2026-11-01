import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon, UserIcon } from '../ui/Icons.jsx';
import { BRAND_NAME } from '../../utils/constants.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useCategoriesStore } from '../../store/useCategoriesStore.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';

export default function MobileMenu() {
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const user = useAuthStore((s) => s.user);
  const categories = useCategoriesStore((s) => s.categories);
  const loadCategories = useCategoriesStore((s) => s.load);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const navItems = [
    { label: 'Shop all', to: '/shop' },
    ...categories.map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-graphite/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-mist p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-char">{BRAND_NAME}</span>
              <button type="button" onClick={closeMobileMenu} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>

            <nav className="mt-8 flex flex-col overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-graphite/10 py-3.5">
                  <Link to={item.to} onClick={closeMobileMenu} className="font-body text-lg text-char">
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            <Link
              to={user ? '/account' : '/login'}
              onClick={closeMobileMenu}
              className="mt-auto flex items-center gap-2 rounded-full bg-graphite px-5 py-3 font-body text-sm font-semibold text-chalk"
            >
              <UserIcon size={17} /> {user ? 'My account' : 'Log in / Register'}
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
