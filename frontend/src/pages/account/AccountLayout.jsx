import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const TABS = [
  { label: 'Overview', to: '/account', end: true },
  { label: 'Profile', to: '/account/profile' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'Orders', to: '/account/orders' },
];

export default function AccountLayout() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-char">My account</h1>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full px-4 py-2 font-body text-sm md:rounded-xl',
                  isActive ? 'bg-graphite text-chalk' : 'text-char/60 hover:bg-graphite/5'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
