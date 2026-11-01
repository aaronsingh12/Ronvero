import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, CloseIcon } from '../ui/Icons.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { productService } from '../../services/productService.js';
import { overlayFade } from '../../animations/variants.js';

export default function SearchOverlay() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
    else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    productService
      .list({ search: debouncedQuery, limit: 6 })
      .then((data) => setResults(data.products))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col bg-mist"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-24">
            <div className="flex items-center gap-4 border-b border-graphite/15 pb-4">
              <SearchIcon size={22} className="text-char/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tees, tights, jackets…"
                className="w-full bg-transparent font-display text-2xl text-char outline-none placeholder:text-char/30"
              />
              <button type="button" onClick={closeSearch} aria-label="Close search">
                <CloseIcon size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              {loading && <p className="font-mono text-sm text-char/50">Searching…</p>}

              {!loading && debouncedQuery && results.length === 0 && (
                <p className="font-mono text-sm text-char/50">No results for "{debouncedQuery}"</p>
              )}

              <div className="flex flex-col gap-1">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-graphite/5"
                  >
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="h-16 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-body text-sm text-char">{product.name}</p>
                      <p className="font-mono text-xs text-char/60">
                        {formatCurrency(product.discountPrice || product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {!debouncedQuery && (
                <div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-wideish text-char/50">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Momentum Tee', 'Joggers', 'Windline Shell', 'Recovery fleece'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-graphite/15 px-4 py-2 font-body text-sm text-char/70 hover:border-char"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
