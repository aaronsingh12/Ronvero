import { ChevronDownIcon } from '../ui/Icons.jsx';
import { cn } from '../../utils/cn.js';
import { SIZE_ORDER } from '../../utils/constants.js';

function FilterSection({ title, children, defaultOpen = true }) {
  return (
    <details className="group border-b border-graphite/10 py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between font-body text-sm font-medium text-char">
        {title}
        <ChevronDownIcon size={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

const orderSizes = (sizes) =>
  [...sizes].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

export default function ShopFilters({ categories, filters, onChange, facets }) {
  const colors = facets?.colors || [];
  const sizes = orderSizes(facets?.sizes || []);
  const priceRange = facets?.priceRange;

  const toggleListValue = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ [key]: next.join(',') || undefined });
  };

  const activeFilterKeys = ['category', 'colors', 'sizes', 'minPrice', 'maxPrice'].filter((k) => filters[k]);
  const hasActiveFilters = activeFilterKeys.length > 0;

  const clearAll = () =>
    onChange({ category: undefined, colors: undefined, sizes: undefined, minPrice: undefined, maxPrice: undefined });

  return (
    <div className="flex flex-col">
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-3">
          <span className="font-mono text-xs text-char/50">
            {activeFilterKeys.length} filter{activeFilterKeys.length > 1 ? 's' : ''} applied
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="font-mono text-xs text-ember underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}

      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {categories.length === 0 && <p className="font-mono text-xs text-char/40">No categories yet</p>}
          {categories.map((cat) => (
            <label key={cat._id} className="flex cursor-pointer items-center gap-2 font-body text-sm text-char/80">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => onChange({ category: cat.slug })}
              />
              {cat.name}
            </label>
          ))}
          {filters.category && (
            <button
              type="button"
              onClick={() => onChange({ category: undefined })}
              className="mt-1 w-fit font-mono text-xs text-ember underline"
            >
              Clear category
            </button>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={priceRange?.min != null ? `Min ${priceRange.min}` : 'Min'}
            defaultValue={filters.minPrice || ''}
            key={`min-${filters.minPrice || ''}`}
            onBlur={(e) => onChange({ minPrice: e.target.value || undefined })}
            className="w-full rounded-lg border border-graphite/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-char"
          />
          <span className="text-char/40">–</span>
          <input
            type="number"
            placeholder={priceRange?.max ? `Max ${priceRange.max}` : 'Max'}
            defaultValue={filters.maxPrice || ''}
            key={`max-${filters.maxPrice || ''}`}
            onBlur={(e) => onChange({ maxPrice: e.target.value || undefined })}
            className="w-full rounded-lg border border-graphite/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-char"
          />
        </div>
      </FilterSection>

      {colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => {
              const active = filters.colors?.split(',').includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleListValue('colors', c.name)}
                  aria-label={c.name}
                  title={c.name}
                  className={cn(
                    'h-7 w-7 rounded-full border-2 shadow-soft transition-transform hover:scale-110',
                    active ? 'scale-110 border-ember' : 'border-graphite/15'
                  )}
                  style={{ backgroundColor: c.hex || '#ccc' }}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      {sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = filters.sizes?.split(',').includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleListValue('sizes', size)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 font-mono text-xs transition-colors',
                    active ? 'border-graphite bg-graphite text-chalk' : 'border-graphite/20 text-char hover:border-char'
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
}
