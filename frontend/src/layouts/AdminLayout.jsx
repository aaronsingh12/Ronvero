import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, MenuIcon, CloseIcon } from '../components/ui/Icons.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNotificationStore } from '../store/useNotificationStore.js';
import { BRAND_NAME } from '../utils/constants.js';
import { cn } from '../utils/cn.js';

const LINKS = [
  { label: 'Overview', to: '/admin' },
  { label: 'Notifications', to: '/admin/notifications' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Collections', to: '/admin/collections' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Reviews', to: '/admin/reviews' },
  { label: 'Coupons', to: '/admin/coupons' },
  { label: 'Banners', to: '/admin/banners' },
  { label: 'Testimonials', to: '/admin/testimonials' },
];

function NavLinks({ unreadCount, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/admin'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-xl px-3.5 py-2.5 font-body text-sm transition-colors',
              isActive ? 'bg-chalk/10 text-chalk' : 'text-chalk/60 hover:text-chalk'
            )
          }
        >
          <span className="flex items-center justify-between gap-2">
            <span>{link.label}</span>
            {link.to === '/admin/notifications' && unreadCount > 0 && (
              <span className="rounded-full bg-ember px-1.5 py-0.5 font-mono text-[10px] text-chalk">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const loadNotifications = useNotificationStore((s) => s.load);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user?.role !== 'admin') return undefined;

    loadNotifications({ limit: 50 }).catch(() => {});
    const timer = window.setInterval(() => {
      loadNotifications({ limit: 50 }).catch(() => {});
    }, 30000);

    return () => window.clearInterval(timer);
  }, [loadNotifications, user?.role]);

  // Close the mobile nav whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-mist">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-graphite/10 bg-graphite p-6 text-chalk md:flex">
        <span className="font-display text-lg font-bold tracking-tightest">
          {BRAND_NAME} <span className="text-ember">/admin</span>
        </span>

        <div className="mt-10">
          <NavLinks unreadCount={unreadCount} />
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-auto rounded-xl px-3.5 py-2.5 text-left font-body text-sm text-chalk/50 hover:text-ember"
        >
          Log out
        </button>
      </aside>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-graphite/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-graphite p-6 text-chalk shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold tracking-tightest">
                  {BRAND_NAME} <span className="text-ember">/admin</span>
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-full p-1 text-chalk/60 hover:text-chalk"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="mt-8 flex-1 overflow-y-auto">
                <NavLinks unreadCount={unreadCount} onNavigate={() => setMobileNavOpen(false)} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  logout();
                }}
                className="mt-4 rounded-xl px-3.5 py-2.5 text-left font-body text-sm text-chalk/50 hover:text-ember"
              >
                Log out
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-graphite/10 bg-mist/80 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-full border border-graphite/15 p-2 text-char/70 hover:text-char md:hidden"
            >
              <MenuIcon size={18} />
            </button>
            <p className="truncate font-body text-sm text-char/60">
              Signed in as {user?.name || 'RONVERO Admin'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="rounded-full border border-graphite/15 px-3 py-1.5 font-mono text-xs text-char/60 hover:text-char"
            >
              View site
            </Link>
            <Link
              to="/admin/notifications"
              aria-label="Admin notifications"
              className="relative rounded-full border border-graphite/15 p-2 text-char/60 hover:text-char"
            >
              <BellIcon size={17} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 font-mono text-[9px] text-chalk">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
