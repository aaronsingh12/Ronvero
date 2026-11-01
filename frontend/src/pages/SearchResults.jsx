import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { productService } from '../services/productService.js';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    productService
      .list({ search: query })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <span className="eyebrow">Search results</span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">"{query}"</h1>
      <p className="mt-1 font-mono text-xs text-char/50">{products.length} results</p>

      <div className="mt-8">
        <ProductGrid products={products} loading={loading} emptyMessage={`No results for "${query}".`} />
      </div>
    </div>
  );
}
