import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND_NAME } from '../utils/constants.js';
import { fadeUp } from '../animations/variants.js';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-between p-8 md:p-12">
        <Link to="/" className="font-display text-xl font-bold tracking-tightest text-char">
          {BRAND_NAME}
        </Link>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto w-full max-w-sm py-16">
          <Outlet />
        </motion.div>

        <p className="font-mono text-xs text-char/40">© {new Date().getFullYear()} {BRAND_NAME}</p>
      </div>

      <div className="relative hidden overflow-hidden bg-graphite md:block">
        <img
          src="https://picsum.photos/seed/ronvero-auth-panel/1200/1600"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-3xl font-semibold leading-tight text-chalk">
            Train in motion.
          </p>
          <p className="mt-2 max-w-sm font-body text-sm text-chalk/70">
            Create an account to track orders, save your sizes, and check out faster.
          </p>
        </div>
      </div>
    </div>
  );
}
