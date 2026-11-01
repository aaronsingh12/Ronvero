import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ShopFilters from '../components/product/ShopFilters.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { FilterIcon, GridIcon, ListIcon, CloseIcon, ChevronDownIcon } from '../components/ui/Icons.jsx';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll.js';
import { cn } from '../utils/cn.js';
import { useCatalogStore } from '../store/useCatalogStore.js';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-ratingsAverage', label: 'Top rated' },
];

export default function Shop() {
  const catalogVersion = useCatalogStore((state) => state.version);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facets, setFacets] = useState({ colors: [], sizes: [], priceRange: { min: 0, max: 0 } });
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useLockBodyScroll(mobileFiltersOpen);

  useEffect(() => {
    categoryService.list().then((data) => setCategories(data.categories));
    productService
      .getFilters()
      .then((data) => setFacets({ colors: data.colors, sizes: data.sizes, priceRange: data.priceRange }))
      .catch(() => {});
  }, [catalogVersion]);

  useEffect(() => {
    setLoading(true);
    productService
      .list(filters)
      .then((data) => {
        setProducts(data.products);
        setMeta({ total: data.total, pages: data.pages });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), catalogVersion]);

  const updateFilters = (patch) => {
    const next = { ...filters, ...patch, page: undefined };
    Object.keys(next).forEach((key) => {
      if (next[key] === undefined || next[key] === '') delete next[key];
    });
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <span className="eyebrow">Shop all</span>
        <h1 className="font-display text-3xl font-semibold text-char sm:text-4xl">
          {filters.category ? categories.find((c) => c.slug === filters.category)?.name || 'Shop' : 'Everything'}
        </h1>
        <p className="font-mono text-xs text-char/50">{meta.total} products</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <ShopFilters categories={categories} filters={filters} onChange={updateFilters} facets={facets} />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-graphite/15 px-4 py-2 font-mono text-xs md:hidden"
            >
              <FilterIcon size={15} /> Filters
            </button>

            <div className="relative ml-auto">
              <select
                value={filters.sort || ''}
                onChange={(e) => updateFilters({ sort: e.target.value || undefined })}
                className="appearance-none rounded-full border border-graphite/15 bg-transparent py-2 pl-4 pr-9 font-mono text-xs outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="hidden items-center gap-1 rounded-full border border-graphite/15 p-1 sm:flex">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn('rounded-full p-1.5', view === 'grid' && 'bg-graphite text-chalk')}
                aria-label="Grid view"
              >
                <GridIcon size={15} />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn('rounded-full p-1.5', view === 'list' && 'bg-graphite text-chalk')}
                aria-label="List view"
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} columns={view === 'list' ? 3 : 4} />

          {meta.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: meta.pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchParams({ ...filters, page: i + 1 })}
                  className={cn(
                    'h-9 w-9 rounded-full font-mono text-xs',
                    Number(filters.page || 1) === i + 1 ? 'bg-graphite text-chalk' : 'text-char/60 hover:bg-graphite/5'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-graphite/50 md:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-mist p-6 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Filters</h2>
                <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <ShopFilters categories={categories} filters={filters} onChange={updateFilters} facets={facets} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
